<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { login, loading, error, clearError } = useAuth()

const form = ref({
    email: '',
    password: ''
})

const validationErrors = ref({})

const isFormValid = computed(() => {
    return form.value.email.trim() && form.value.password.length >= 1
})

async function handleSubmit() {
    clearError()
    validationErrors.value = {}

    // Client-side validation
    if (!form.value.email.trim()) {
        validationErrors.value.email = ['Email is required']
        return
    }
    if (!form.value.password) {
        validationErrors.value.password = ['Password is required']
        return
    }

    const result = await login(form.value.email, form.value.password)

    if (result.success) {
        router.push('/')
    } else if (result.error?.errors) {
        validationErrors.value = result.error.errors
    }
}
</script>

<template>
    <div class="min-h-[80vh] flex items-center justify-center px-4">
        <div class="w-full max-w-md">
            <!-- Header -->
            <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4 shadow-lg shadow-amber-500/25">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                </div>
                <h1 class="text-2xl font-bold text-white mb-2">Selamat Datang Kembali</h1>
                <p class="text-slate-400">Masuk untuk melanjutkan membaca</p>
            </div>

            <!-- Form Card -->
            <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-xl">
                <!-- Error Message -->
                <div v-if="error" class="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    {{ error }}
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <!-- Email -->
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <input 
                            v-model="form.email"
                            type="email"
                            placeholder="email@example.com"
                            class="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
                            :class="{ 'border-red-500/50': validationErrors.email }"
                        />
                        <p v-if="validationErrors.email" class="mt-1 text-xs text-red-400">{{ validationErrors.email[0] }}</p>
                    </div>

                    <!-- Password -->
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input 
                            v-model="form.password"
                            type="password"
                            placeholder="Masukkan password"
                            class="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
                            :class="{ 'border-red-500/50': validationErrors.password }"
                        />
                        <p v-if="validationErrors.password" class="mt-1 text-xs text-red-400">{{ validationErrors.password[0] }}</p>
                    </div>

                    <!-- Submit Button -->
                    <button 
                        type="submit"
                        :disabled="loading || !isFormValid"
                        class="w-full py-3 px-4 rounded-xl font-semibold text-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-amber-500/25"
                    >
                        <span v-if="loading" class="flex items-center justify-center gap-2">
                            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Masuk...
                        </span>
                        <span v-else>Masuk</span>
                    </button>
                </form>

                <!-- Divider -->
                <div class="relative my-6">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-slate-700/50"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-4 bg-slate-900/50 text-slate-500">atau</span>
                    </div>
                </div>

                <!-- Register Link -->
                <p class="text-center text-slate-400">
                    Belum punya akun?
                    <router-link to="/register" class="text-amber-500 hover:text-amber-400 font-medium transition-colors">
                        Daftar sekarang
                    </router-link>
                </p>
            </div>
        </div>
    </div>
</template>
