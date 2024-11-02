<script setup lang="ts">

import { onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useClipboard } from '@vueuse/core'
import { useToast } from '@/components/ui/toast/use-toast'
import AnswerCallDialog from '@/components/AnswerCallDialog.vue'
import VideoStreams from '@/components/partials/VideoStreams.vue'

import { useVideoCall } from '@/composables/useVideoCall'

const copy = useClipboard()
const { toast } = useToast()

const route = useRoute()

const {
  callId,
  callUrl,
  callStarted,
  callJoined,
  localStream,
  remoteStream,
  setupLocalCamera,
  setupRemoteStream,
  createCall,
  joinCall,
  toastData,
  cleanup
} = useVideoCall()

const startCall = async () => {
  callStarted.value = true

  await setupLocalCamera()
  setupRemoteStream()
  await createCall()

  if (!callJoined.value) {
    toast({...toastData.callStartErrorData, variant: 'destructive'})
    return
  }

  if (copy.isSupported.value) {
    copy.copy(callUrl.value)
    toast(toastData.callStartToastData())
  } else {
    toast({...toastData.copyErrorData, variant: 'destructive'})
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
    toast({...toastData.callAnswerErrorData, variant: 'destructive'})
    return
  }

  toast(toastData.callConnectedData)
}

// perform cleanup before unmount
onUnmounted(async () => {
  await cleanup()
})

if (route.query.callid && typeof route.query.callid === 'string') {
  answerCall(route.query.callid)
}

</script>

<template>
  <main class="h-svh flex flex-col justify-start items-center px-8 space-y-10">
    <p class="place-self-start font-bold" v-show="callId" @click="() => {
      if (copy.isSupported.value) {
        copy.copy(callUrl)
        toast({ description: 'Copied!' })
      } else {
        toast({...toastData.copyErrorData, variant: 'destructive'})
      }
    }">
      Call: <Badge>{{ callUrl }}</Badge>
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
