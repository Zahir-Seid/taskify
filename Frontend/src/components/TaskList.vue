<script setup>
import { useIsMobile } from './useIsMobile'
const props = defineProps({
  tasks: Array,
  getStatusColor: Function,
  getStatusStyle: Function
})
const { isMobile } = useIsMobile()
</script>

<template>
  <!-- Mobile -->
  <div v-if="isMobile" class="space-y-3 mb-6">
    <div
      v-for="task in tasks"
      :key="task.id"
      class="flex flex-col bg-white p-3 rounded-lg border hover:shadow-sm transition-shadow"
      style="background-color: white; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #e5e7eb; margin-bottom: 0.75rem;"
    >
      <div class="flex items-center space-x-2 mb-2">
        <div class="w-2 h-2 bg-pink-500 rounded-full"></div>
        <span class="text-gray-900 text-base">{{ task.name }}</span>
      </div>
      <div class="flex items-center space-x-2 w-full">
        <select
          :value="task.status"
          @change="$emit('status-change', task.id, $event.target.value)"
          :class="[
            'appearance-none border-none shadow-none px-3 py-2 rounded-md text-base font-medium cursor-pointer w-full',
            getStatusColor(task.status)
          ]"
          :style="getStatusStyle(task.status)"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button
          @click="$emit('delete', task.id)"
          class="text-pink-500 hover:text-pink-600 hover:bg-pink-50 p-2 rounded transition-colors"
          style="color: #ec4899; padding: 0.5rem; border-radius: 0.25rem; border: none; cursor: pointer; background: transparent;"
        >
          <slot name="delete-icon" />
        </button>
      </div>
    </div>
  </div>
  <!-- Desktop -->
  <div v-else class="space-y-4 mb-8">
    <div
      v-for="task in tasks"
      :key="task.id"
      class="flex items-center justify-between bg-white p-4 rounded-lg border hover:shadow-sm transition-shadow"
      style="display: flex; align-items: center; justify-content: space-between; background-color: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e5e7eb; margin-bottom: 1rem;"
    >
      <div class="flex items-center space-x-3">
        <div class="w-2 h-2 bg-pink-500 rounded-full"></div>
        <span class="text-gray-900">{{ task.name }}</span>
      </div>
      <div class="flex items-center space-x-3">
        <div class="relative">
          <select
            :value="task.status"
            @change="$emit('status-change', task.id, $event.target.value)"
            :class="[
              'appearance-none border-none shadow-none px-3 py-1 rounded-md text-sm font-medium cursor-pointer',
              getStatusColor(task.status)
            ]"
            :style="getStatusStyle(task.status)"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button
          @click="$emit('delete', task.id)"
          class="text-pink-500 hover:text-pink-600 hover:bg-pink-50 p-1 rounded transition-colors"
          style="color: #ec4899; padding: 0.25rem; border-radius: 0.25rem; border: none; cursor: pointer; background: transparent;"
        >
          <slot name="delete-icon" />
        </button>
      </div>
    </div>
  </div>
</template> 