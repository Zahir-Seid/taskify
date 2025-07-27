<script setup>
import { ref, computed, onMounted } from 'vue'
import TaskCreate from '@/components/TaskCreate.vue'
import TaskList from '@/components/TaskList.vue'
import TaskDelete from '@/components/TaskDelete.vue'
import { Search, Plus, Trash2, X, ChevronDown } from 'lucide-vue-next'
import axios from 'axios'
import { useRouter } from 'vue-router'

const tasks = ref([])
const loading = ref(false)
const error = ref('')
const activeTab = ref('pending')
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const taskToDelete = ref(null)
const searchQuery = ref('')
const router = useRouter()
const userName = ref('')
const page = ref(1)
const limit = ref(6)
const total = ref(0)
const backend = "https://taskify-p69x.onrender.com"

function getAuthHeader() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function fetchTasks() {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.get(`${backend}/tasks`, {
      headers: getAuthHeader(),
      params: {
        search: searchQuery.value || undefined,
        page: page.value,
        limit: limit.value
      }
    })
    tasks.value = res.data.tasks
    total.value = res.data.total
  } catch (err) {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    } else {
      error.value = 'Failed to load tasks.'
    }
  } finally {
    loading.value = false
  }
}

function nextPage() {
  if (page.value * limit.value < total.value) {
    page.value++
    fetchTasks()
  }
}

function prevPage() {
  if (page.value > 1) {
    page.value--
    fetchTasks()
  }
}

function setTab(tab) {
  activeTab.value = tab
  page.value = 1
  fetchTasks()
}

onMounted(() => {
  if (!localStorage.getItem('token')) {
    router.push('/login')
    return
  }
  fetchProfile()
  fetchTasks()
})

async function fetchProfile() {
  try {
    const res = await axios.get(`${backend}/profile`, { headers: getAuthHeader() })
    userName.value = res.data.name
  } catch (err) {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    } else {
      userName.value = ''
    }
  }
}

const pendingTasks = computed(() => tasks.value.filter(task => task.status !== 'completed'))
const completedTasks = computed(() => tasks.value.filter(task => task.status === 'completed'))
const currentTasks = computed(() => activeTab.value === 'pending' ? pendingTasks.value : completedTasks.value)

async function handleCreateTask(name) {
  if (name.trim()) {
    try {
      await axios.post(`${backend}/tasks`, { name }, { headers: getAuthHeader() })
      showCreateModal.value = false
      fetchTasks()
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token')
        router.push('/login')
      } else {
        error.value = 'Failed to create task.'
      }
    }
  }
}

async function handleDeleteTask() {
  if (taskToDelete.value) {
    try {
      await axios.delete(`${backend}/tasks/${taskToDelete.value}`, { headers: getAuthHeader() })
      showDeleteModal.value = false
      taskToDelete.value = null
      fetchTasks()
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token')
        router.push('/login')
      } else {
        error.value = 'Failed to delete task.'
      }
    }
  }
}

async function handleStatusChange(taskId, newStatus) {
  try {
    await axios.patch(`${backend}/tasks/${taskId}`, { status: newStatus }, { headers: getAuthHeader() })
    fetchTasks()
  } catch (err) {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    } else {
      error.value = 'Failed to update task.'
    }
  }
}

function openDeleteModal(taskId) {
  taskToDelete.value = taskId
  showDeleteModal.value = true
}

function getStatusColor(status) {
  switch (status) {
    case 'pending':
      return 'text-pink-500 bg-pink-50'
    case 'in-progress':
      return 'text-blue-500 bg-blue-50'
    case 'completed':
      return 'text-green-500 bg-green-50'
    default:
      return 'text-gray-500 bg-gray-50'
  }
}

function getStatusStyle(status) {
  switch (status) {
    case 'pending':
      return 'color: #ec4899; background-color: #fdf2f8; padding: 0.25rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500; border: none;'
    case 'in-progress':
      return 'color: #3b82f6; background-color: #eff6ff; padding: 0.25rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500; border: none;'
    case 'completed':
      return 'color: #22c55e; background-color: #f0fdf4; padding: 0.25rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500; border: none;'
    default:
      return 'color: #6b7280; background-color: #f9fafb; padding: 0.25rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500; border: none;'
  }
}

function logout() {
  localStorage.removeItem('token')
  router.push('/login')
}

function handleSearch() {
  page.value = 1
  fetchTasks()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50" style="min-height: 100vh; background-color: #f9fafb;">
    <!-- Header -->
    <div class="bg-white border-b px-6 py-4" style="background-color: white; border-bottom: 1px solid #e5e7eb; padding: 1rem 1.5rem;">
      <div class="flex items-center justify-between max-w-7xl mx-auto" style="display: flex; align-items: center; justify-content: space-between; max-width: 80rem; margin: 0 auto;">
        <div class="flex items-center space-x-4 flex-1 max-w-md" style="display: flex; align-items: center; gap: 1rem; flex: 1; max-width: 28rem;">
          <Search class="w-5 h-5 text-gray-400" style="width: 1.25rem; height: 1.25rem; color: #9ca3af;" />
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            placeholder="Search for tasks"
            class="border-none outline-none text-base flex-1 bg-transparent"
            style="border: none; outline: none; font-size: 1rem; flex: 1; background: transparent;"
          />
          <button @click="handleSearch" class="ml-2 px-2 py-1 bg-pink-500 text-white rounded">Search</button>
        </div>
        <div class="flex items-center space-x-4" style="display: flex; align-items: center; gap: 1rem;">
          <span class="text-gray-900 font-medium" style="color: #111827; font-weight: 500;">{{ userName }}</span>
          <button class="p-1 hover:bg-gray-100 rounded" aria-label="Logout" @click="logout">
            <span class="material-symbols-outlined" style="font-size: 1rem;">logout</span>
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8" style="max-width: 80rem; margin: 0 auto; padding: 2rem 1.5rem;">
      <!-- Tabs -->
      <div class="flex space-x-1 mb-8" style="display: flex; gap: 0.25rem; margin-bottom: 2rem;">
        <button
          @click="setTab('pending')"
          :class="[
            'px-4 py-2 rounded-md font-medium transition-colors',
            activeTab === 'pending'
              ? 'bg-pink-500 text-white hover:bg-pink-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          ]"
          :style="activeTab === 'pending' 
            ? 'background-color: #ec4899; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500;'
            : 'color: #4b5563; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500;'"
        >
          Pending
        </button>
        <button
          @click="setTab('completed')"
          :class="[
            'px-4 py-2 rounded-md font-medium transition-colors',
            activeTab === 'completed'
              ? 'bg-pink-500 text-white hover:bg-pink-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          ]"
          :style="activeTab === 'completed' 
            ? 'background-color: #ec4899; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500;'
            : 'color: #4b5563; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500;'"
        >
          Completed
        </button>
      </div>

      <!-- Content -->
      <div v-if="loading" class="text-center py-8 text-gray-500">Loading tasks...</div>
      <div v-if="error" class="text-center py-8 text-red-500">{{ error }}</div>
      <div v-else>
        <!-- Task Summary -->
        <div class="flex items-center justify-between mb-8" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900" style="font-size: 1.5rem; font-weight: 600; color: #111827;">
              <span v-if="activeTab === 'pending'">
                You've got <span class="text-pink-500" style="color: #ec4899;">{{ pendingTasks.length }} task</span> today
              </span>
              <span v-else>
                Completed <span class="text-pink-300 ml-4" style="color: #f9a8d4; margin-left: 1rem;">Inactive</span>
              </span>
            </h2>
          </div>
          <button
            v-if="activeTab === 'pending'"
            @click="showCreateModal = true"
            class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            style="background-color: #ec4899; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; display: flex; align-items: center; gap: 0.5rem; border: none; cursor: pointer;"
          >
            <Plus class="w-4 h-4" style="width: 1rem; height: 1rem;" />
            <span>Add New</span>
          </button>
        </div>

        <!-- Tasks Section -->
        <div v-if="activeTab === 'pending'" class="mb-8" style="margin-bottom: 2rem;">
          <h3 class="text-lg font-semibold text-gray-900 mb-4" style="font-size: 1.125rem; font-weight: 600; color: #111827; margin-bottom: 1rem;">On Hold</h3>
        </div>

        <!-- Task List -->
        <TaskList
          :tasks="currentTasks"
          :getStatusColor="getStatusColor"
          :getStatusStyle="getStatusStyle"
          @status-change="handleStatusChange"
          @delete="openDeleteModal"
        >
          <template #delete-icon>
            <Trash2 class="w-4 h-4" style="width: 1rem; height: 1rem;" />
          </template>
        </TaskList>

        <!-- Pagination (static, as before) -->
        <div class="flex items-center justify-between" style="display: flex; align-items: center; justify-content: space-between;">
          <span class="text-sm text-gray-500" style="font-size: 0.875rem; color: #6b7280;">
            Showing {{ (total === 0 ? 0 : ((page - 1) * limit + 1)) }} to {{ Math.min(page * limit, total) }} of {{ total }} entries
          </span>
          <div class="flex items-center space-x-2" style="display: flex; align-items: center; gap: 0.5rem;">
            <button :disabled="page.value === 1" @click="prevPage" class="text-pink-500 px-3 py-1 rounded hover:bg-pink-50 transition-colors" style="color: #ec4899; padding: 0.25rem 0.75rem; border-radius: 0.25rem; border: none; cursor: pointer; background: transparent;">
              Previous
            </button>
            <button class="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600 transition-colors" style="background-color: #ec4899; color: white; padding: 0.25rem 0.75rem; border-radius: 0.25rem; border: none; cursor: pointer;">
              {{ page.value }}
            </button>
            <button :disabled="page.value * limit.value >= total.value" @click="nextPage" class="text-pink-500 px-3 py-1 rounded hover:bg-pink-50 transition-colors" style="color: #ec4899; padding: 0.25rem 0.75rem; border-radius: 0.25rem; border: none; cursor: pointer; background: transparent;">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Task Modal -->
    <TaskCreate :show="showCreateModal" @create="handleCreateTask" @close="showCreateModal = false" />

    <!-- Delete Task Modal -->
    <TaskDelete :show="showDeleteModal" @delete="handleDeleteTask" @close="showDeleteModal = false">
      <template #close-icon>
        <X class="w-4 h-4" style="width: 1rem; height: 1rem;" />
      </template>
    </TaskDelete>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&family=Lato:wght@300;400;700;900&display=swap');
body {
  font-family: 'Open Sans', sans-serif;
}
select {
  background-image: none;
}
button, select, input {
  transition: all 0.2s ease-in-out;
}
button:hover {
  transform: translateY(-1px);
}
</style> 