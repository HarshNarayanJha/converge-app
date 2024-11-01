<script setup lang="ts">
import { useRoute, RouterLink } from 'vue-router'

import { Button } from './ui/button'
import { Icon } from '@iconify/vue'
import ColorToggle from '@/components/ColorToggle.vue'

const route = useRoute()
</script>

<template>
  <section class="mx-auto backdrop-blur fixed top-0">
    <nav class="flex justify-between w-screen">
      <div class="px-5 xl:px-12 py-6 flex w-full items-center">
        <RouterLink class="text-3xl font-bold font-heading" to="/">
          <img class="h-9 inline-block align-bottom" src="/converge_icon.png" alt="logo">
          Converge
        </RouterLink>
        <ul class="hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12">
          <li><a class="" href="#">How it Works</a></li>
          <li><a class="" href="#">About Us</a></li>
        </ul>
        <div class="hidden xl:flex space-x-5 items-center">
          <RouterLink to="/call" v-if="route.path === '/'">
            <Button>
              <Icon icon="radix-icons:play" class="h-4 w-2" />
              Start Video Call
            </Button>
          </RouterLink>
          <ColorToggle />
        </div>
      </div>
    </nav>

  </section>
</template>
