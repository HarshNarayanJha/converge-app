import { ref, onUnmounted, h } from 'vue'
import { useTemplateRef } from 'vue'
import { useFirestore } from 'vuefire'
import { useMounted, useClipboard, useShare } from '@vueuse/core'
import { collection, doc, addDoc, setDoc, deleteDoc, getDoc, onSnapshot } from '@firebase/firestore'
import type { DocumentData, DocumentSnapshot, QuerySnapshot, DocumentChange } from '@firebase/firestore'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast/use-toast'

export const useVideoCall = () => {
  const { toast } = useToast()
  const isMounted = useMounted()
  const db = useFirestore()
  const copy = useClipboard()
  const share = useShare()

  const servers = {
    constceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
      },
    ],
    iceCandidatePoolSize: 10,
  }

  const pc = new RTCPeerConnection(servers)
  const localStream = ref<MediaStream | null>(null)
  const remoteStream = ref<MediaStream | null>(null)

  // const localStreamVideo = useTemplateRef<HTMLVideoElement>('self-stream')
  // const remoteStreamVideo = useTemplateRef<HTMLVideoElement>('remote-stream')

  const callStarted = ref(false)
  const callId = ref<string>('')

  const setupLocalCamera = async () => {
    localStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

    if (localStream.value) {
      localStream.value.getTracks().forEach(track => {
        pc.addTrack(track, localStream.value!)
      })
    }

    // if (isMounted.value && localStreamVideo.value) {
    //   localStreamVideo.value.srcObject = localStream
    //   localStreamVideo.value.muted = true
    // }
  }

  const setupRemoteStream = () => {
    remoteStream.value = new MediaStream()

    pc.ontrack = event => {
      event.streams[0].getTracks().forEach(track => {
        remoteStream.value?.addTrack(track)
      })
    }

    // if (isMounted.value && remoteStreamVideo.value) {
    //   remoteStreamVideo.value.srcObject = remoteStream
    // }
  }

  const createCall = async () => {
    const callDoc = collection(db, 'calls')
    const newCallDoc = doc(callDoc)
    const offerCandidates = collection(db, `calls/${newCallDoc.id}/offerCandidates`)
    const answerCandidates = collection(db, `calls/${newCallDoc.id}/answerCandidates`)

    callId.value = newCallDoc.id

    pc.onicecandidate = event => {
      if (event.candidate) {
        addDoc(offerCandidates, event.candidate.toJSON())
      }
    }

    const offerDescription = await pc.createOffer()
    await pc.setLocalDescription(offerDescription)

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    }

    await setDoc(newCallDoc, { offer })

    // Listen for remote answer
    onSnapshot(newCallDoc, (snapshot: DocumentSnapshot<DocumentData>) => {
      const data = snapshot.data()
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer)
        pc.setRemoteDescription(answerDescription)
      }
    })

    // Listen for remote ICE candidates
    onSnapshot(answerCandidates, (snapshot: QuerySnapshot<DocumentData>) => {
      snapshot.docChanges().forEach((change: DocumentChange<DocumentData>) => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data())
          pc.addIceCandidate(candidate)
        }
      })
    })
  }

  const joinCall = async () => {
    const callDoc = doc(collection(db, 'calls'), callId.value)
    const offerCandidates = collection(db, `calls/${callId.value}/offerCandidates`)
    const answerCandidates = collection(db, `calls/${callId.value}/answerCandidates`)

    pc.onicecandidate = event => {
      if (event.candidate) {
        addDoc(answerCandidates, event.candidate.toJSON())
      }
    }

    // Fetch data, then set the offer & answer
    const callData = (await getDoc(callDoc)).data()
    if (!callData) return

    const offerDescription = callData.offer
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription))

    const answerDescription = await pc.createAnswer()
    await pc.setLocalDescription(answerDescription)

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    }

    await setDoc(callDoc, { answer }, { merge: true })

    // Listen to offer candidates
    onSnapshot(offerCandidates, (snapshot: QuerySnapshot<DocumentData>) => {
      snapshot.docChanges().forEach((change: DocumentChange<DocumentData>) => {
        console.log(change)
        if (change.type === 'added') {
          const data = change.doc.data()
          pc.addIceCandidate(new RTCIceCandidate(data))
        }
      })
    })
  }

  const startCall = async () => {
    callStarted.value = true

    await setupLocalCamera()
    setupRemoteStream()
    await createCall()


    copy.copy(callId.value)

    toast({
      title: 'Call ID copied to Clipboard!',
      description: 'Share the ID for the other person to join',
      action: h(Button, {
        onClick: () => share.isSupported && share.share(
          { title: 'Join my Video Call on Converge', text: callId.value, url: location.origin }
        )
      }, {
        default: () => 'Share'
      })
    })
  }

  const answerCall = async (answerCallId: string | undefined) => {
    if (!answerCallId) return

    callId.value = answerCallId
    callStarted.value = true

    await setupLocalCamera()
    setupRemoteStream()
    await joinCall()

    toast({
      title: 'call Connected!',
      description: 'Connected to the person who sent you the Call ID'
    })
  }

  // release the streams and delete firestore doc on unmount
  onUnmounted(() => {
    if (callId.value) {
      deleteDoc(doc(collection(db, 'calls'), callId.value))
    }

    if (localStream.value) {
      localStream.value.getTracks().forEach(track => track.stop())
      localStream.value = null
    }

    if (remoteStream.value) {
      remoteStream.value.getTracks().forEach(track => track.stop())
      remoteStream.value = null
    }
  })

  return {
    callStarted,
    callId,
    localStream,
    remoteStream,
    startCall,
    answerCall,
    // localStreamVideo,
    // remoteStreamVideo
  }
}
