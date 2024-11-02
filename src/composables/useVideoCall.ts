import { ref } from 'vue'

import { collection, doc, addDoc, setDoc, deleteDoc, getDoc, onSnapshot } from '@firebase/firestore'
import type { DocumentChange, DocumentData, DocumentSnapshot, QuerySnapshot } from '@firebase/firestore'
import { useFirestore } from 'vuefire'

export const useVideoCall = () => {

  const db = useFirestore()

  const servers = {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
      },
    ],
    iceCandidatePoolSize: 10,
  }

  const pc = new RTCPeerConnection(servers)
  const localStream = ref<MediaStream | null>(null)
  const remoteStream = ref<MediaStream | null>(null)

  const callStarted = ref(false)
  const callJoined = ref(false)
  const callId = ref<string>('')

  const setupLocalCamera = async () => {
    localStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

    if (localStream.value) {
      localStream.value.getTracks().forEach(track => {
        pc.addTrack(track, localStream.value!)
      })
    }
  }

  const setupRemoteStream = () => {
    remoteStream.value = new MediaStream()

    pc.ontrack = event => {
      event.streams[0].getTracks().forEach(track => {
        remoteStream.value?.addTrack(track)
      })
    }
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

    callJoined.value = true
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
        if (change.type === 'added') {
          const data = change.doc.data()
          pc.addIceCandidate(new RTCIceCandidate(data))
        }
      })
    })

    callJoined.value = true
  }

  const cleanup = async () => {
    console.log(`Cleanup event!`)
    if (callId.value) {
      await deleteDoc(doc(collection(db, 'calls'), callId.value))
    }

    if (localStream.value) {
      localStream.value.getTracks().forEach(track => track.stop())
      localStream.value = null
    }

    if (remoteStream.value) {
      remoteStream.value.getTracks().forEach(track => track.stop())
      remoteStream.value = null
    }
  }

  return {
    callStarted,
    callJoined,
    callId,
    localStream,
    remoteStream,
    setupLocalCamera,
    setupRemoteStream,
    createCall,
    joinCall,
    cleanup
  }
}
