<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Toaster from '@/components/ui/toast/Toaster.vue'
</script>

<template>
  <Navbar />
  <RouterView class="mt-24" />
  <Toaster />
</template>
