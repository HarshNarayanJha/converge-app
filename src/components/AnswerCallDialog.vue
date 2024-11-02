<script lang="ts" setup>
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'
import { ref } from 'vue'

const { onSubmit } = defineProps<{
  onSubmit: (callId: string | undefined) => void
}>()

const [UseTemplate, GridForm] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 768px)')

const isOpen = ref(false)

const handleSubmit = (e: Event) => {
  const formData = new FormData(e.target as HTMLFormElement)
  const callId = formData.get('callid')
  onSubmit(callId?.toString())
  isOpen.value = false
}
</script>

<template>
  <UseTemplate>
    <form class="grid items-start gap-4 px-4" @submit.prevent="handleSubmit">
      <div class="grid gap-2">
        <Label html-for="callid">Call ID</Label>
        <Input id="callid" name="callid" ref="callid" type="text" required />
      </div>
      <Button type="submit">
        Answer
      </Button>
    </form>
  </UseTemplate>

  <Dialog v-if="isDesktop" v-model:open="isOpen">
    <DialogTrigger as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Answer a Call</DialogTitle>
        <DialogDescription>
          Paste the Call ID you recieved from your friend here
        </DialogDescription>
      </DialogHeader>
      <GridForm />
    </DialogContent>
  </Dialog>

  <Drawer v-else v-model:open="isOpen">
    <DrawerTrigger as-child>
      <slot name="trigger" />
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader class="text-left">
        <DrawerTitle>Answer a Call</DrawerTitle>
        <DrawerDescription>
          Paste the Call ID you recieved from your friend here
        </DrawerDescription>
      </DrawerHeader>
      <GridForm />
      <DrawerFooter class="pt-2">
        <DrawerClose as-child>
          <Button variant="outline">
            Cancel
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>
