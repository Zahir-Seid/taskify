<template
    ><div id="webcrumbs">
        <div class="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4">
            <div
                class="bg-white rounded-3xl shadow-lg w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden"
            >
                <div class="flex items-center justify-center p-8"><h1 class="text-4xl font-bold">Taskify</h1></div>
                <div class="p-8 border-l border-gray-200">
                    <h2 class="text-3xl font-bold mb-2">Welcome</h2>
                    <p class="text-gray-600 mb-6">Enter your info to get started with taskify.</p>
                    <form class="space-y-4" @submit="handleRegister">
                        <div>
                            <input
                                type="text"
                                placeholder="Name"
                                v-model="name"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                v-model="email"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                v-model="password"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
                            />
                        </div>
                        <div class="flex items-center">
                            <input
                                type="checkbox"
                                id="showPassword"
                                class="mr-2 h-4 w-4 text-primary-500 focus:ring-primary-400 border-gray-300 rounded"
                            />
                            <label for="showPassword" class="text-gray-700">Show password</label>
                        </div>
                        <button
                            type="submit"
                            class="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                        >
                            Signup
                        </button>
                        <div class="text-center text-gray-600">
                            Don&#x27;t have an account? <a href="#" class="text-gray-800 hover:underline">signin</a>
                        </div>
                        <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
                    </form>
                </div>
            </div>
        </div>
    </div></template
>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function handleRegister(e) {
  e.preventDefault()
  error.value = ''
  try {
    const res = await axios.post('http://localhost:3000/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value
    })
    localStorage.setItem('token', res.data.access_token)
    router.push('/')
  } catch (err) {
    error.value = 'Registration failed.'
  }
}
</script>
