<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50"
    @click.self="$emit('close')"
    style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; padding: 0.5rem; z-index: 50;"
  >
    <!-- Mobile -->
    <div v-if="isMobile" class="bg-white rounded-lg p-4 w-full max-w-xs" style="background-color: white; border-radius: 0.5rem; padding: 1rem; width: 100%; max-width: 20rem;">
      <h2 class="text-lg font-semibold text-center mb-3">Create New Task</h2>
      <p class="text-gray-600 text-center mb-4 text-sm">
        Organize your productivity effortlessly by creating a new task. Name it whatever helps you stay on top of your game!
      </p>
      <input
        v-model="taskName"
        placeholder="Task name"
        class="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-base mb-3"
        @keypress.enter="createTask"
        style="padding: 0.75rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; outline: none;"
      />
      <button
        @click="createTask"
        :disabled="!taskName.trim()"
        class="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-md transition-colors text-base"
        style="background-color: #ec4899; color: white; border-radius: 0.375rem; border: none; cursor: pointer;"
        :style="!taskName.trim() ? 'opacity: 0.5; cursor: not-allowed;' : ''"
      >
        Create Task
      </button>
    </div>
    <!-- Desktop -->
    <div v-else class="bg-white rounded-lg p-6 w-full max-w-md" style="background-color: white; border-radius: 0.5rem; padding: 1.5rem; width: 100%; max-width: 28rem;">
      <h2 class="text-xl font-semibold text-center mb-4">Create New Task</h2>
      <p class="text-gray-600 text-center mb-6">
        Organize your productivity effortlessly by creating a new task. Name it whatever helps you stay on top of your game!
      </p>
      <div class="flex space-x-3">
        <input
          v-model="taskName"
          placeholder="Task name"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          @keypress.enter="createTask"
          style="flex: 1; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; outline: none;"
        />
        <button
          @click="createTask"
          :disabled="!taskName.trim()"
          class="bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors"
          style="background-color: #ec4899; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; border: none; cursor: pointer;"
          :style="!taskName.trim() ? 'opacity: 0.5; cursor: not-allowed;' : ''"
        >
          Create Task
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
const emit = defineEmits(['create', 'close'])
const taskName = ref('')
const { isMobile } = useIsMobile()

watch(() => props.show, (val) => {
  if (!val) taskName.value = ''
})

function createTask() {
  if (taskName.value.trim()) {
    emit('create', taskName.value.trim())
    taskName.value = ''
  }
}
</script> 