<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50"
    @click.self="$emit('close')"
    style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; padding: 0.5rem; z-index: 50;"
  >
    <!-- Mobile -->
    <div v-if="isMobile" class="bg-white rounded-lg p-4 w-full max-w-xs" style="background-color: white; border-radius: 0.5rem; padding: 1rem; width: 100%; max-width: 20rem;">
      <div class="flex justify-between items-start mb-3">
        <h2 class="text-lg font-semibold">Delete Task</h2>
        <button
          @click="$emit('close')"
          class="text-pink-500 hover:text-pink-600 p-1 rounded transition-colors"
          style="color: #ec4899; padding: 0.25rem; border-radius: 0.25rem; border: none; cursor: pointer; background: transparent;"
        >
          <slot name="close-icon" />
        </button>
      </div>
      <p class="text-gray-600 mb-4 text-sm">
        This action can't be undone. Enter the word "delete" in the given field below to delete task
      </p>
      <input
        v-model="confirmText"
        placeholder="Type delete in here"
        class="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-base mb-3"
        style="padding: 0.75rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; outline: none;"
      />
      <button
        @click="deleteTask"
        :disabled="confirmText !== 'delete'"
        class="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-md transition-colors text-base"
        style="background-color: #ec4899; color: white; border-radius: 0.375rem; border: none; cursor: pointer;"
        :style="confirmText !== 'delete' ? 'opacity: 0.5; cursor: not-allowed;' : ''"
      >
        Delete Task
      </button>
    </div>
    <!-- Desktop -->
    <div v-else class="bg-white rounded-lg p-6 w-full max-w-md" style="background-color: white; border-radius: 0.5rem; padding: 1.5rem; width: 100%; max-width: 28rem;">
      <div class="flex justify-between items-start mb-4">
        <h2 class="text-xl font-semibold">Delete Task</h2>
        <button
          @click="$emit('close')"
          class="text-pink-500 hover:text-pink-600 p-1 rounded transition-colors"
          style="color: #ec4899; padding: 0.25rem; border-radius: 0.25rem; border: none; cursor: pointer; background: transparent;"
        >
          <slot name="close-icon" />
        </button>
      </div>
      <p class="text-gray-600 mb-6">
        This action can't be undone. Enter the word "delete" in the given field below to delete task
      </p>
      <div class="flex space-x-3">
        <input
          v-model="confirmText"
          placeholder="Type delete in here"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          style="flex: 1; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; outline: none;"
        />
        <button
          @click="deleteTask"
          :disabled="confirmText !== 'delete'"
          class="bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors"
          style="background-color: #ec4899; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; border: none; cursor: pointer;"
          :style="confirmText !== 'delete' ? 'opacity: 0.5; cursor: not-allowed;' : ''"
        >
          Delete Task
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useIsMobile } from './useIsMobile'
const props = defineProps({
  show: Boolean
})
const emit = defineEmits(['delete', 'close'])
const confirmText = ref('')
const { isMobile } = useIsMobile()

watch(() => props.show, (val) => {
  if (!val) confirmText.value = ''
})

function deleteTask() {
  if (confirmText.value === 'delete') {
    emit('delete')
    confirmText.value = ''
  }
}
</script> 