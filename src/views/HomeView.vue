<script setup>
import { ref, onMounted } from 'vue'
import { fetchUpdates, fetchProjects } from '../services/api'
import { getContinueReading } from '../services/storage'
import { usePWA } from '../composables/usePWA'
import ComicCard from '../components/ComicCard.vue'

const comics = ref([])
const projects = ref([])
const history = ref([])
const loading = ref(true)

// PWA
const { canInstall, isOffline, install, dismissInstall } = usePWA()

onMounted(async () => {
    try {
        const [updatesData, projectsData] = await Promise.all([
            fetchUpdates(),
            fetchProjects()
        ])
        comics.value = updatesData
        projects.value = projectsData
        history.value = getContinueReading()
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div class="space-y-10 md:space-y-16">
        <!-- Offline Indicator -->
        <div v-if="isOffline" class="fixed top-16 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md z-50">
            <div class="flex items-center gap-3 p-3 bg-slate-800/95 backdrop-blur-xl rounded-xl ring-1 ring-white/10 shadow-xl">
                <div class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                <span class="text-sm text-slate-300">You're offline. Some content may be unavailable.</span>
            </div>
        </div>
        
        <!-- PWA Install Banner -->
        <section v-if="canInstall" class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-transparent p-5 md:p-6 ring-1 ring-amber-500/30">
            <div class="flex flex-col md:flex-row items-start md:items-center gap-4 relative z-10">
                <div class="flex items-center gap-4 flex-1">
                    <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div class="space-y-1">
                        <h3 class="text-lg font-bold text-white">Install KomikCuy</h3>
                        <p class="text-sm text-slate-400">Get the app for faster access & offline reading</p>
                    </div>
                </div>
                <div class="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        @click="dismissInstall"
                        class="flex-1 md:flex-none px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    >
                        Not now
                    </button>
                    <button 
                        @click="install"
                        class="flex-1 md:flex-none px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-amber-500/20"
                    >
                        Install
                    </button>
                </div>
            </div>
            
            <!-- Decorative elements -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 left-1/2 w-48 h-24 bg-amber-600/10 rounded-full blur-3xl"></div>
        </section>
        
        <!-- Continue Reading Section -->
        <section v-if="history.length > 0" class="animate-fade-in">
            <div class="flex items-center gap-3 mb-6 md:mb-8">
                <div class="w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
                <h2 class="text-xl md:text-2xl font-bold text-white">Continue Reading</h2>
            </div>
            
            <div class="grid grid-cols-2 gap-4 md:gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                <router-link 
                    v-for="comic in history" 
                    :key="comic.link" 
                    :to="'/chapter/' + comic.lastChapter.link"
                    class="block"
                >
                    <div class="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-900/50 backdrop-blur-sm shadow-lg ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 hover:ring-amber-500/30">
                        <img 
                            v-if="comic.img"
                            :src="comic.img" 
                            :alt="comic.title" 
                            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div v-else class="h-full w-full bg-slate-800 flex items-center justify-center text-slate-500">
                             No Image
                        </div>
                        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                        
                        <div class="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                            <h3 class="mb-1 text-sm font-semibold text-white/90 line-clamp-2">
                                {{ comic.judul }}
                            </h3>
                            <p class="text-xs text-amber-400 line-clamp-1 font-medium">
                                {{ comic.lastChapter.title }}
                            </p>
                        </div>
                    </div>
                </router-link>
            </div>
        </section>

        <!-- Project Comics Section -->
        <section v-if="loading || projects.length > 0">
            <div class="flex items-center gap-3 mb-6 md:mb-8">
                <div class="w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
                <h2 class="text-xl md:text-2xl font-bold text-white">Project Comics</h2>
                <span class="ml-auto text-xs text-slate-500 font-medium bg-slate-800/50 px-3 py-1 rounded-full">Original</span>
            </div>
            
            <div v-if="loading" class="grid grid-cols-2 gap-4 md:gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                <div v-for="n in 6" :key="'p'+n" class="animate-pulse">
                    <div class="aspect-[3/4] w-full rounded-2xl bg-slate-800/50 mb-3"></div>
                    <div class="h-4 w-3/4 rounded bg-slate-800/50 mb-2"></div>
                </div>
            </div>

            <div v-else class="grid grid-cols-2 gap-4 md:gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                <router-link 
                    v-for="comic in projects" 
                    :key="comic.link" 
                    :to="'/manga/' + comic.link"
                    class="block"
                >
                    <ComicCard 
                        :title="comic.judul"
                        :image="comic.img"
                        :chapter="comic.chapter"
                        :time="comic.chapter_update"
                        :link="comic.link"
                    />
                </router-link>
            </div>
        </section>

        <!-- Latest Updates Section -->
        <section>
            <div class="flex items-center gap-3 mb-6 md:mb-8">
                <div class="w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
                <h2 class="text-xl md:text-2xl font-bold text-white">Latest Updates</h2>
                <span class="ml-auto text-xs text-slate-500 font-medium bg-slate-800/50 px-3 py-1 rounded-full">New</span>
            </div>

            <div v-if="loading" class="grid grid-cols-2 gap-4 md:gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              <div v-for="n in 12" :key="n" class="animate-pulse">
                  <div class="aspect-[3/4] w-full rounded-2xl bg-slate-800/50 mb-3"></div>
                  <div class="h-4 w-3/4 rounded bg-slate-800/50 mb-2"></div>
                  <div class="h-3 w-1/2 rounded bg-slate-800/50"></div>
              </div>
            </div>

            <div v-else class="grid grid-cols-2 gap-4 md:gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              <router-link 
                v-for="comic in comics" 
                :key="comic.link" 
                :to="'/manga/' + comic.link"
                class="block"
              >
                <ComicCard 
                    :title="comic.judul"
                    :image="comic.img"
                    :chapter="comic.chapter"
                    :time="comic.chapter_update"
                    :link="comic.link"
                />
              </router-link>
            </div>
            
            <div class="mt-10 md:mt-12 flex justify-center">
                <router-link 
                    to="/comics" 
                    class="group relative px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:scale-95"
                >
                    <span class="relative z-10">See All Comics</span>
                    <div class="absolute inset-0 rounded-xl bg-amber-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </router-link>
            </div>
        </section>
    </div>
</template>
