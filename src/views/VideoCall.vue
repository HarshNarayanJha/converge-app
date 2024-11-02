<script setup lang="ts">

import { h, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useClipboard, useShare } from '@vueuse/core'
import { useToast } from '@/components/ui/toast/use-toast'
import AnswerCallDialog from '@/components/AnswerCallDialog.vue'
import VideoStreams from '@/components/partials/VideoStreams.vue'

import { useVideoCall } from '@/composables/useVideoCall'

const copy = useClipboard()
const share = useShare()
const { toast } = useToast()

const {
  callId,
  callStarted,
  callJoined,
  localStream,
  remoteStream,
  setupLocalCamera,
  setupRemoteStream,
  createCall,
  joinCall,
  cleanup
} = useVideoCall()

const startCall = async () => {
  callStarted.value = true

  await setupLocalCamera()
  setupRemoteStream()
  await createCall()

  if (!callJoined.value) {
    toast({
      title: 'Error',
      description: 'Unable to Start a Video Call',
      variant: 'destructive'
    })

    return
  }

  if (copy.isSupported.value) {
    copy.copy(callId.value)

    toast({
      title: 'Call ID copied to Clipboard!',
      description: 'Share the ID for the other person to join',
      action: h(Button, {
        onClick: () => {
          if (share.isSupported.value) {
            share.share({ title: 'Join my Video Call on Converge', text: callId.value, url: location.origin })
          } else {
            console.log("Cannot Share")
            toast({ description: 'Share is not supported in your browser. Please share the Call ID manually' })
          }
        }
      }, {
        default: () => 'Share'
      })
    })
  } else {
    toast({ description: 'Copy is not supported in your browser. Please copy the ID manually' })
  }
}

const answerCall = async (answerCallId: string | undefined) => {
  if (!answerCallId) return

  callId.value = answerCallId
  callStarted.value = true

  await setupLocalCamera()
  setupRemoteStream()
  await joinCall()

  if (!callJoined.value) {
    toast({
      title: 'Error',
      description: 'Unable to Start a Video Call',
      variant: 'destructive'
    })

    return
  }

  toast({
    title: 'Call Connected!',
    description: 'Connected to the person who sent you the Call ID'
  })
}

// perform cleanup before unmount
onUnmounted(async () => {
  await cleanup()
})

</script>

<template>
  <main class="h-svh flex flex-col justify-start items-center px-8">
    <p class="place-self-start font-bold" v-if="callId" @click="() => {
      if (copy.isSupported.value) {
        copy.copy(callId)
        toast({ description: 'Copied!' })
      } else {
        toast({ description: 'Copy is not supported in your browser. Please copy the ID manually' })
      }
    }">
      Call ID: <Badge>{{ callId }}</Badge>
    </p>

    <VideoStreams :localStream="localStream" :remoteStream="remoteStream" />

    <div class="flex justify-center items-center space-x-3 mt-4">
      <Button v-if="!callStarted" @click="startCall" class="py-2 px-4 rounded-lg">Start Video Call</Button>

      <AnswerCallDialog :onSubmit="answerCall">
        <template #trigger>
          <Button v-if="!callStarted" class="py-2 px-4 rounded-lg">Answer Video Call</Button>
        </template>
      </AnswerCallDialog>
    </div>
  </main>
</template>
