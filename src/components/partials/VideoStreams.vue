<script setup lang="ts">
import { ref, watch } from 'vue'

const { localStream, remoteStream } = defineProps<{
  localStream: MediaStream | null,
  remoteStream: MediaStream | null
}>()

const localVideoRef = ref<HTMLVideoElement | null>(null)
const remoteVideoRef = ref<HTMLVideoElement | null>(null)

watch(() => localStream, newStream => {
  if (localVideoRef.value && newStream) {
    localVideoRef.value.srcObject = newStream
    localVideoRef.value.muted = true
  }

}, { immediate: true })

watch(() => remoteStream, newStream => {
  if (remoteVideoRef.value && newStream) {
    remoteVideoRef.value.srcObject = newStream
  }

}, { immediate: true })

</script>

<template>
  <div class="flex justify-center items-center space-x-3 my-4">
    <div class="relative w-[320px] h-[240px] bg-gray-900 rounded-lg overflow-hidden">
      <video ref="localVideoRef" autoplay playsinline class="w-full h-full object-cover"></video>
      <div v-if="!localStream" class="absolute inset-0 flex items-center justify-center text-white">
        Waiting for camera...
      </div>
    </div>

    <div class="relative w-[320px] h-[240px] bg-gray-900 rounded-lg overflow-hidden">
      <video ref="remoteVideoRef" autoplay playsinline class="w-full h-full object-cover"></video>
      <div v-if="!remoteStream" class="absolute inset-0 flex items-center justify-center text-white">
        Waiting for peer...
      </div>
    </div>
  </div>
</template>
