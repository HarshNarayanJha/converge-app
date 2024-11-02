<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { useColorMode } from '@vueuse/core'

const mode = useColorMode({ disableTransition: false })

document.addEventListener('keydown', e => {
  if (e.shiftKey && e.key === 'D') {
    if (mode.value === 'light')
      mode.value = 'dark'
    else
      mode.value = 'light'
  }
})
</script>

<template>
  <Navbar />
  <RouterView class="mt-24" />
  <Toaster />
</template>
