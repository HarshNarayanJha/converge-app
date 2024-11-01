<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { Button } from '@/components/ui/button'

import { useMounted } from '@vueuse/core'

const isMounted = useMounted()

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
}

const pc = new RTCPeerConnection(servers)
let localStream: MediaStream | null = null
let remoteStream: MediaStream | null = null

const localStreamVideo = useTemplateRef<HTMLVideoElement>('self-stream')
const remoteStreamVideo = useTemplateRef<HTMLVideoElement>('remote-stream')

const connectVideo = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

  if (localStream) {
    localStream.getTracks().forEach(track => {
      pc.addTrack(track, localStream!)
    })
  }

  if (isMounted.value && localStreamVideo.value) {
    localStreamVideo.value.srcObject = localStream
  }

  remoteStream = new MediaStream()

  pc.ontrack = event => {
    event.streams[0].getTracks().forEach(track => {
      remoteStream?.addTrack(track)
    })
  }

  if (isMounted.value && remoteStreamVideo.value) {
    remoteStreamVideo.value.srcObject = remoteStream
  }
}

</script>

<template>
  <main class="h-svh flex flex-col justify-start items-center py-32 px-8">
    <video id="self-stream" ref="self-stream" autoplay playsinline></video>
    <video id="remote-stream" autoplay playsinline></video>
    <Button @click="connectVideo" class="py-2 px-4 rounded-lg">Connect Camera</Button>
  </main>
</template>
