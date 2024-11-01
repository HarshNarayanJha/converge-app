<script setup lang="ts">
import ColorToggle from '@/components/ColorToggle.vue';
</script>

<template>
  <section class="mx-auto backdrop-blur fixed top-0">
    <nav class="flex justify-between w-screen">
      <div class="px-5 xl:px-12 py-6 flex w-full items-center">
        <a class="text-3xl font-bold font-heading" href="#">
          <img class="h-9 inline-block align-bottom" src="/converge_icon.png" alt="logo">
          Converge
        </a>
        <ul class="hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12">
          <li><a class="" href="#">How it Works</a></li>
          <li><a class="" href="#">About Us</a></li>
        </ul>
        <div class="hidden xl:flex space-x-5 items-center">
          <ColorToggle />
        </div>
      </div>
    </nav>

  </section>
</template>
