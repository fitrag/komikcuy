<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { register, loading, error, clearError } = useAuth()

const form = ref({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
})

const validationErrors = ref({})
const successMessage = ref('')

const isFormValid = computed(() => {
    return form.value.name.trim() && 
           form.value.email.trim() && 
           form.value.password.length >= 6 &&
           form.value.password === form.value.password_confirmation
})

const passwordsMatch = computed(() => {
    if (!form.value.password_confirmation) return true
    return form.value.password === form.value.password_confirmation
})

async function handleSubmit() {
    clearError()
    validationErrors.value = {}
    successMessage.value = ''

    // Client-side validation
    if (!form.value.name.trim()) {
        validationErrors.value.name = ['Name is required']
        return
    }
    if (!form.value.email.trim()) {
        validationErrors.value.email = ['Email is required']
        return
    }
    if (form.value.password.length < 6) {
        validationErrors.value.password = ['Password must be at least 6 characters']
        return
    }
    if (!passwordsMatch.value) {
        validationErrors.value.password_confirmation = ['Passwords do not match']
        return
    }

    const result = await register(
        form.value.name,
        form.value.email,
        form.value.password,
        form.value.password_confirmation
    )

    if (result.success) {
        successMessage.value = 'Registration successful! Redirecting to login...'
        setTimeout(() => {
            router.push('/login')
        }, 1500)
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                </div>
                <h1 class="text-2xl font-bold text-white mb-2">Buat Akun Baru</h1>
                <p class="text-slate-400">Daftar untuk menyimpan komik favoritmu</p>
            </div>

            <!-- Form Card -->
            <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-xl">
                <!-- Success Message -->
                <div v-if="successMessage" class="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
                    {{ successMessage }}
                </div>

                <!-- Error Message -->
                <div v-if="error" class="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    {{ error }}
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <!-- Name -->
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Nama</label>
                        <input 
                            v-model="form.name"
                            type="text"
                            placeholder="Nama lengkap"
                            class="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
                            :class="{ 'border-red-500/50': validationErrors.name }"
                        />
                        <p v-if="validationErrors.name" class="mt-1 text-xs text-red-400">{{ validationErrors.name[0] }}</p>
                    </div>

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
                            placeholder="Minimal 6 karakter"
                            class="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
                            :class="{ 'border-red-500/50': validationErrors.password }"
                        />
                        <p v-if="validationErrors.password" class="mt-1 text-xs text-red-400">{{ validationErrors.password[0] }}</p>
                    </div>

                    <!-- Confirm Password -->
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Konfirmasi Password</label>
                        <input 
                            v-model="form.password_confirmation"
                            type="password"
                            placeholder="Ulangi password"
                            class="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
                            :class="{ 'border-red-500/50': validationErrors.password_confirmation || !passwordsMatch }"
                        />
                        <p v-if="validationErrors.password_confirmation" class="mt-1 text-xs text-red-400">{{ validationErrors.password_confirmation[0] }}</p>
                        <p v-else-if="!passwordsMatch" class="mt-1 text-xs text-red-400">Password tidak cocok</p>
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
                            Mendaftar...
                        </span>
                        <span v-else>Daftar Sekarang</span>
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

                <!-- Login Link -->
                <p class="text-center text-slate-400">
                    Sudah punya akun?
                    <router-link to="/login" class="text-amber-500 hover:text-amber-400 font-medium transition-colors">
                        Masuk di sini
                    </router-link>
                </p>
            </div>
        </div>
    </div>
</template>
