<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from './composables/useAuth.js'
import { usePWA } from './composables/usePWA.js'

const router = useRouter()
const route = useRoute()
const searchQuery = ref('')
const showSearch = ref(false)
const showUserMenu = ref(false)

const { user, isLoggedIn, logout } = useAuth()
usePWA() // Initialize PWA listeners globally

const handleSearch = () => {
    if (searchQuery.value.trim()) {
        router.push({ name: 'search', query: { q: searchQuery.value } })
        showSearch.value = false
        searchQuery.value = ''
    }
}

// Check if current route matches nav item
const isActive = (path) => {
    if (path === '/') return route.path === '/'
    return route.path.startsWith(path)
}

const handleLogout = async () => {
    await logout()
    showUserMenu.value = false
    router.push('/')
}

// Close user menu when clicking outside
const closeUserMenu = () => {
    showUserMenu.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100 font-sans selection:bg-amber-500/30 antialiased">
    <!-- Subtle Background Pattern -->
    <div class="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-50 pointer-events-none"></div>
    
    <div class="mx-auto max-w-7xl relative z-10 px-4 pt-4 pb-20 md:pb-6 md:pt-6">
      <!-- Mobile Header -->
      <header class="mb-6 md:mb-10">
        <!-- Desktop Header -->
        <div class="hidden md:flex items-center justify-between">
          <router-link to="/" class="flex items-center gap-3 group">
            <div class="relative">
              <div class="absolute -inset-2 bg-amber-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-amber-500 transition-all duration-300 group-hover:scale-110 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 class="text-3xl font-black tracking-tight text-white group-hover:text-amber-50 transition-colors">
              Komik<span class="text-amber-500">Cuy</span>
            </h1>
          </router-link>
          
          <div class="flex items-center gap-6">
            <nav class="flex items-center gap-8 text-sm font-medium">
                <router-link to="/favorites" active-class="!text-amber-500" class="text-slate-400 hover:text-white transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-amber-500 after:transition-all hover:after:w-full">Favorites</router-link>
                <router-link to="/history" active-class="!text-amber-500" class="text-slate-400 hover:text-white transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-amber-500 after:transition-all hover:after:w-full">History</router-link>
            </nav>

            <form @submit.prevent="handleSearch" class="relative group">
                <input 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="Search comics..." 
                    class="rounded-xl bg-slate-900/80 backdrop-blur-sm py-2.5 pl-4 pr-12 text-slate-100 placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 w-44 focus:w-72 transition-all duration-300"
                />
                <button type="submit" class="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg bg-amber-500/10 p-2 text-amber-500 hover:bg-amber-500 hover:text-black transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </form>

            <!-- Auth Section - Desktop -->
            <div v-if="isLoggedIn" class="relative">
                <button 
                    @click="showUserMenu = !showUserMenu"
                    class="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-all duration-200"
                >
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                        {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                    </div>
                    <span class="text-sm text-slate-300 max-w-24 truncate">{{ user?.name || 'User' }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                
                <!-- Dropdown Menu -->
                <transition name="dropdown">
                    <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
                        <div class="px-4 py-3 border-b border-slate-800">
                            <p class="text-sm font-medium text-white truncate">{{ user?.name }}</p>
                            <p class="text-xs text-slate-400 truncate">{{ user?.email }}</p>
                        </div>
                        <a 
                            href="#"
                            @click.prevent="handleLogout"
                            class="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-slate-800/50 transition-colors flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Keluar
                        </a>
                    </div>
                </transition>
            </div>
            <div v-else class="flex items-center gap-3">
                <router-link 
                    to="/login"
                    class="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                    Masuk
                </router-link>
                <router-link 
                    to="/register"
                    class="px-4 py-2 text-sm font-semibold text-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/25"
                >
                    Daftar
                </router-link>
            </div>
          </div>
        </div>

        <!-- Mobile Header -->
        <div class="flex md:hidden items-center justify-between">
          <router-link to="/" class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h1 class="text-xl font-black tracking-tight text-white">
              Komik<span class="text-amber-500">Cuy</span>
            </h1>
          </router-link>
          
          <div class="flex items-center gap-2">
            <!-- Mobile Auth -->
            <div v-if="isLoggedIn" class="relative">
                <button 
                    @click="showUserMenu = !showUserMenu"
                    class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm"
                >
                    {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                </button>
                
                <!-- Mobile Dropdown -->
                <transition name="dropdown">
                    <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
                        <div class="px-4 py-3 border-b border-slate-800">
                            <p class="text-sm font-medium text-white truncate">{{ user?.name }}</p>
                            <p class="text-xs text-slate-400 truncate">{{ user?.email }}</p>
                        </div>
                        <a 
                            href="#"
                            @click.prevent="handleLogout"
                            class="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-slate-800/50 transition-colors flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Keluar
                        </a>
                    </div>
                </transition>
            </div>
            <router-link 
                v-else
                to="/login"
                class="p-2.5 rounded-xl bg-slate-800/80 text-amber-500 hover:text-amber-400 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </router-link>
            
            <button 
              @click="showSearch = !showSearch"
              class="p-2.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Search Bar (Expandable) -->
        <transition name="slide">
          <form 
            v-if="showSearch" 
            @submit.prevent="handleSearch" 
            class="mt-4 md:hidden"
          >
            <div class="relative">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search comics..." 
                autofocus
                class="w-full rounded-xl bg-slate-900/80 backdrop-blur-sm py-3 pl-4 pr-12 text-slate-100 placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
              />
              <button type="submit" class="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg bg-amber-500 p-2.5 text-black">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </transition>
      </header>

      <!-- Main Content -->
      <main class="min-h-[80vh]">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      
      <!-- Desktop Footer -->
      <footer class="hidden md:block mt-16 py-8 border-t border-slate-800/50 text-center text-sm text-slate-500">
        <p>Made with <span class="text-amber-500">♥</span> for manga lovers</p>
      </footer>
    </div>
    
    <!-- Mobile Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50 safe-area-pb">
      <div class="flex items-center justify-around px-2 py-2">
        <router-link 
          to="/" 
          class="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200"
          :class="isActive('/') && !isActive('/favorites') && !isActive('/history') && !isActive('/comics') && !isActive('/login') && !isActive('/register') ? 'text-amber-500 bg-amber-500/10' : 'text-slate-400'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-[10px] font-medium">Home</span>
        </router-link>
        
        <router-link 
          to="/comics" 
          class="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200"
          :class="isActive('/comics') ? 'text-amber-500 bg-amber-500/10' : 'text-slate-400'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span class="text-[10px] font-medium">Browse</span>
        </router-link>
        
        <router-link 
          to="/favorites" 
          class="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200"
          :class="isActive('/favorites') ? 'text-amber-500 bg-amber-500/10' : 'text-slate-400'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span class="text-[10px] font-medium">Favorites</span>
        </router-link>
        
        <router-link 
          to="/history" 
          class="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200"
          :class="isActive('/history') ? 'text-amber-500 bg-amber-500/10' : 'text-slate-400'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-[10px] font-medium">History</span>
        </router-link>
      </div>
    </nav>
  </div>

  <!-- Overlay for closing user menu -->
  <div v-if="showUserMenu" @click="closeUserMenu" class="fixed inset-0 z-40"></div>
</template>

<style>
/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.25s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Search slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

/* Safe area for bottom nav */
.safe-area-pb {
  padding-bottom: env(safe-area-inset-bottom, 8px);
}

/* Hide scrollbar on mobile for cleaner look */
@media (max-width: 768px) {
  ::-webkit-scrollbar {
    display: none;
  }
  
  * {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
</style>
