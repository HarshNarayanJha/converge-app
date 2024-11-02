<script setup lang="ts">

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useClipboard } from '@vueuse/core'
import { useToast } from '@/components/ui/toast/use-toast'
import AnswerCallDialog from '@/components/AnswerCallDialog.vue'
import VideoStreams from '@/components/partials/VideoStreams.vue'

import { useVideoCall } from '@/composables/useVideoCall'

const copy = useClipboard()
const { toast } = useToast()

const {
  callId,
  callStarted,
  localStream,
  remoteStream,
  startCall,
  answerCall
} = useVideoCall()

</script>

<template>
  <main class="h-svh flex flex-col justify-start items-center px-8">
    <p class="place-self-start font-bold" v-if="callId" @click="() => {
      copy.isSupported && copy.copy(callId)
      toast({ description: 'Copied!' })
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
