<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

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
  <div class="relative w-full xl:w-9/12 xl:h-9/12 bg-gray-900 rounded-lg overflow-clip">
    <video ref="remoteVideoRef" autoplay playsinline class="w-full h-full object-contain"></video>
    <div v-if="!remoteStream" class="absolute inset-0 flex items-center justify-center text-white">
      <Icon icon="radix-icons:person" class="w-8 h-8" />
    </div>

    <div ref="localVideoContainer"
      class="absolute w-[160px] h-[120px] bg-gray-600 rounded-lg overflow-hidden right-6 bottom-5">
      <video ref="localVideoRef" autoplay playsinline class="w-full h-full object-contain"></video>
      <div v-if="!localStream" class="absolute inset-0 flex items-center justify-center text-white">
        <Icon icon="radix-icons:person" class="w-8 h-8" />
      </div>
    </div>
  </div>
</template>
