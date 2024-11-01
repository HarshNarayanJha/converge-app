<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
</script>

<template>
  <main class="h-svh flex flex-col justify-start items-center py-32 px-8">
    <img class="h-40 mb-8" src="/converge_icon.png" alt="logo">
    <h1 class="text-4xl font-extrabold lg:text-5xl scroll-m-20">Converge</h1>

    <p class="text-2xl leading-5 mt-6">Connect Anytime, Anywhere</p>
    <p class="text-xl text-muted-foreground mt-4 text-center">
      Experience seamless video calls with Converge—your gateway to limitless conversations.
    </p>

    <RouterLink to="/call">
      <Button class="mt-12">
        <Icon icon="radix-icons:play" class="h-4 w-2" />
        Start Video Call
      </Button>
    </RouterLink>
  </main>
</template>
