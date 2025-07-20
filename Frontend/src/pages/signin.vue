<template
    ><div id="webcrumbs">
        <div class="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-blue-200">
            <div class="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-xl">
                <div class="grid grid-cols-1 md:grid-cols-2">
                    <div class="flex items-center justify-center p-12"><h1 class="text-4xl font-bold">Taskify</h1></div>
                    <div class="p-12 border-l border-gray-200">
                        <div class="mb-8">
                            <h2 class="text-4xl font-bold mb-1">Welcome back</h2>
                            <p class="text-gray-600">Enter your credential to continue</p>
                        </div>
                        <form class="space-y-4" @submit="handleLogin">
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
                            <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
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
                                class="w-full py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-200"
                            >
                                Signin
                            </button>
                            <div class="text-center mt-4">
                                <p class="text-gray-600">
                                    Don&#x27;t have an account?
                                    <a href="#" class="text-black font-medium hover:underline">Sign Up</a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div></template
>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function handleLogin(e) {
  e.preventDefault()
  error.value = ''
  try {
    const res = await axios.post('http://localhost:3000/auth/login', {
      email: email.value,
      password: password.value
    })
    localStorage.setItem('token', res.data.access_token)
    router.push('/')
  } catch (err) {
    error.value = 'Invalid email or password.'
  }
}
</script>
