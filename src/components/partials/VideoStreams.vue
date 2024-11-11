<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useElementHover } from '@vueuse/core'

const { localStream, remoteStream } = defineProps<{
  localStream: MediaStream | null,
  remoteStream: MediaStream | null
}>()

const localVideoRef = ref<HTMLVideoElement | null>(null)
const remoteVideoRef = ref<HTMLVideoElement | null>(null)

const videoContainer = ref<HTMLDivElement | null>(null)
const showControls = useElementHover(videoContainer)

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
  <div class="relative xl:w-auto xl:h-5/6 w-full h-4/6 bg-gray-900 rounded-lg overflow-clip" ref="videoContainer">
    <video ref="remoteVideoRef" autoplay playsinline class="w-full h-full object-contain"></video>
    <div v-if="!remoteStream" class="absolute inset-0 flex items-center justify-center text-white">
      <Icon icon="radix-icons:person" class="w-8 h-8" />
    </div>

    <div ref="localVideoContainer"
      class="absolute md:w-[160px] md:h-[120px] w-[90px] h-[120px] bg-gray-600 rounded-lg overflow-hidden right-6 bottom-5">
      <video ref="localVideoRef" autoplay playsinline class="w-full h-full object-contain"></video>
      <div v-if="!localStream" class="absolute inset-0 flex items-center justify-center text-white">
        <Icon icon="radix-icons:person" class="w-8 h-8" />
      </div>
    </div>

    <Transition>

      <div id="controls" v-show="showControls"
        class="absolute bottom-5 w-full flex flex-row items-center justify-center space-x-5">

        <button class="rounded-full border-0 bg-none hover:bg-[#ffffff45] transition-colors p-2 h-10 w-10">
          <!-- <Icon icon="lucide:camera-off" class="w-8 h-8" /> -->
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2.22 2.22a.75.75 0 0 1 1.06 0l18.5 18.5a.75.75 0 0 1-1.06 1.06l-.946-.945A3.245 3.245 0 0 1 18.75 21H5.25A3.25 3.25 0 0 1 2 17.75v-9.5c0-1.403.89-2.599 2.135-3.054L2.22 3.28a.75.75 0 0 1 0-1.06Zm11.602 12.663a3 3 0 0 1-4.206-4.206L8.55 9.612a4.5 4.5 0 0 0 6.34 6.34l-1.068-1.068ZM16.437 13.255a4.5 4.5 0 0 0-5.192-5.192l-3.59-3.59.55-.897a2.25 2.25 0 0 1 1.917-1.073h3.803a2.25 2.25 0 0 1 1.94 1.11L16.679 5h2.071A3.25 3.25 0 0 1 22 8.25v9.5c0 .324-.047.637-.136.933l-5.427-5.428Z"
              fill="#ffffff" />
          </svg>
        </button>

        <button class="rounded-full border-0 bg-red-600 hover:bg-red-400 transition-colors p-3 h-30 w-30">
          <svg xmlns="http://www.w3.org/2000/svg" width="46" viewBox="0 0 46 46" height="46"
            class="svg-icon fill-none hover:fill-white">
            <path stroke-width="2" stroke-linecap="round" stroke="#fff" fill-rule="evenodd"
              d="m14.5037 27.0715c.819-.634 1.7094-1.1699 2.653-1.597.7621-.3521 1.2557-1.1094 1.2699-1.9488-.0073-1.1346.7466-2.1517 1.8673-2.3279 1.7701-.2782 3.5728-.2785 5.3429-.0005 1.1206.1759 1.8744 1.193 1.8669 2.3274.0206.8307.5066 1.5791 1.257 1.9359.981.4173 1.9093.9489 2.7657 1.5838.8765.5876 2.0467.4715 2.791-.2769l2.2507-2.2507c.4294-.4283.6617-1.0157.6414-1.6219-.0308-.5985-.314-1.159-.7793-1.5337-2.5842-2.0976-5.6309-3.5496-8.888-4.2357-2.9976-.6659-6.1047-.6655-9.1023.0009-3.2453.7041-6.2835 2.1503-8.87655 4.2253l-.12568.1256c-.38501.38-.60996.8929-.62872 1.4334-.02687.6011.20148 1.1854.62847 1.6092l2.25008 2.2501c.7307.7914 1.9343.9202 2.8162.3015z"
              clip-rule="evenodd">
            </path>
          </svg>
        </button>

        <button class="rounded-full border-0 bg-none hover:bg-[#ffffff45] transition-colors p-2 h-10 w-10">
          <!-- <Icon icon="lucide:switch-camera" class="w-8 h-8" /> -->
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 7a1 1 0 0 1 .993.883L22 8v8.5a3.5 3.5 0 0 1-3.308 3.495L18.5 20H6.415l.292.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083-2-2-.018-.018a1.004 1.004 0 0 1-.062-.072l.08.09a1.011 1.011 0 0 1-.282-.559A.942.942 0 0 1 3 19.02v-.044c0-.022.002-.043.004-.064L3 19a1.009 1.009 0 0 1 .21-.613c.028-.035.054-.066.083-.094l2-2a1 1 0 0 1 1.497 1.32l-.083.094-.293.293H18.5a1.5 1.5 0 0 0 1.493-1.355L20 16.5V8a1 1 0 0 1 1-1Zm-2.387-4.79.094.083 2 2c.029.028.055.059.08.09l-.08-.09a1.025 1.025 0 0 1 .244.395 1.178 1.178 0 0 1 .038.164.985.985 0 0 1 .01.116L21 5v.025a1 1 0 0 1-.004.06L21 5a1.016 1.016 0 0 1-.146.52 1.08 1.08 0 0 1-.064.093c-.005.007-.007.01-.01.012l-.073.082-2 2a1 1 0 0 1-1.497-1.32l.083-.094.291-.293H5.5a1.5 1.5 0 0 0-1.493 1.356L4 7.5V16a1 1 0 0 1-1.993.117L2 16V7.5a3.5 3.5 0 0 1 3.308-3.495L5.5 4h12.085l-.292-.293a1 1 0 0 1-.083-1.32l.083-.094a1 1 0 0 1 1.32-.083ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"
              fill="#ffffff" />
          </svg>
        </button>
      </div>

    </Transition>

  </div>
</template>
