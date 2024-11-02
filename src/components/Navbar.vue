<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { Button } from './ui/button'
import { Icon } from '@iconify/vue'
import ColorToggle from '@/components/ColorToggle.vue'

const route = useRoute()
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

</script>

<template>
  <section class="mx-auto backdrop-blur fixed top-0 w-full z-50">
    <nav class="flex flex-wrap items-center justify-between w-full">
      <div class="px-5 xl:px-12 py-6 flex w-full items-center justify-between">
        <!-- Logo -->
        <RouterLink @click="closeMobileMenu" class="text-3xl font-bold font-heading" to="/">
          <img class="h-9 inline-block align-bottom" src="/converge_icon.png" alt="logo">
          Converge
        </RouterLink>

        <button @click="toggleMobileMenu" class="md:hidden flex items-center" aria-label="Toggle Menu">
          <Icon icon="radix-icons:cross-1" class="w-6 h-6"
            :class="isMobileMenuOpen ? 'rotate-0 scale-100 transition-all' : '-rotate-90 scale-0 transition-all'" />
          <Icon icon="radix-icons:hamburger-menu" class="absolute w-6 h-6"
            :class="isMobileMenuOpen ? 'rotate-90 scale-0 transition-all' : 'rotate-0 scale-100 transition-all'" />
        </button>

        <ul class="hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12">
          <li>
            <RouterLink class="" to="/works">How it Works</RouterLink>
          </li>
          <li>
            <RouterLink class="" to="/about">About Us</RouterLink>
          </li>
        </ul>

        <div class="hidden md:flex space-x-5 items-center">
          <RouterLink to="/call" v-if="route.path === '/'">
            <Button>
              <Icon icon="radix-icons:play" class="h-4 w-2" />
              Start Video Call
            </Button>
          </RouterLink>
          <ColorToggle />
        </div>
      </div>

      <Transition enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-4 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in" leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-4 opacity-0">

        <div v-show="isMobileMenuOpen" class="md:hidden w-full">
          <ul class="px-5 pt-2 pb-4 space-y-3">
            <li>
              <RouterLink @click="closeMobileMenu" class="block" to="/works">
                How it Works
              </RouterLink>
            </li>
            <li>
              <RouterLink @click="closeMobileMenu" class="block" to="/about">
                About Us
              </RouterLink>
            </li>
            <li v-if="route.path === '/'">
              <RouterLink @click="closeMobileMenu" to="/call" class="block">
                <Button class="w-half">
                  <Icon icon="radix-icons:play" class="h-4 w-2" />
                  Start Video Call
                </Button>
              </RouterLink>
            </li>
            <li>
              <ColorToggle />
            </li>
          </ul>
        </div>
      </Transition>
    </nav>

  </section>
</template>
