<script setup>
import { ref, onMounted } from 'vue'
import { getHistory, isChapterCached } from '../services/storage'
import LazyImage from '../components/LazyImage.vue'

const history = ref([])

onMounted(() => {
    history.value = getHistory()
})

const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric'
    })
}

const isCached = (chapterLink) => {
    return isChapterCached(chapterLink)
}
</script>

<template>
    <div class="space-y-10">
        <div class="flex items-center gap-3">
            <div class="w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
            <h1 class="text-2xl font-bold text-white">Reading History</h1>
            <span v-if="history.length > 0" class="ml-auto text-xs text-slate-500 font-medium bg-slate-800/50 px-3 py-1 rounded-full">{{ history.length }} entries</span>
        </div>

        <div v-if="history.length === 0" class="text-center py-16 bg-slate-900/50 backdrop-blur-sm rounded-2xl ring-1 ring-white/10">
            <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800/50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <p class="text-slate-400 text-lg">No reading history</p>
            <router-link to="/" class="inline-block mt-4 text-amber-500 hover:text-amber-400 font-medium">← Start Reading</router-link>
        </div>

        <div class="space-y-3">
            <div v-for="item in history" :key="item.link + item.lastChapter.link" 
                 class="group flex gap-4 p-4 bg-slate-900/50 backdrop-blur-sm rounded-2xl ring-1 ring-white/10 hover:ring-amber-500/20 transition-all duration-200">
                <router-link :to="'/manga/' + item.link" class="flex-shrink-0 w-20 md:w-24">
                    <div class="relative overflow-hidden rounded-xl">
                        <LazyImage 
                            v-if="item.img" 
                            :src="item.img" 
                            :alt="item.judul" 
                            aspectRatio="aspect-[3/4] rounded-xl" 
                        />
                        <div v-else class="w-full aspect-[3/4] bg-slate-800/50 rounded-xl flex items-center justify-center text-xs text-slate-500">
                            No Image
                        </div>
                        <!-- Offline Available Badge -->
                        <div v-if="isCached(item.lastChapter.link)" class="absolute top-1 right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg" title="Available offline">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </router-link>
                
                <div class="flex-1 flex flex-col justify-between py-1">
                    <div>
                        <router-link :to="'/manga/' + item.link" class="block">
                            <h3 class="font-semibold text-white text-base hover:text-amber-400 transition-colors line-clamp-1">{{ item.judul }}</h3>
                        </router-link>
                        <div class="flex items-center gap-2 mt-1.5">
                            <router-link 
                                :to="{
                                    path: '/chapter/' + item.lastChapter.link,
                                    query: { img: item.img, title: item.judul }
                                }" 
                                class="text-amber-500 hover:text-amber-400 font-medium text-sm"
                            >
                                {{ item.lastChapter.title }}
                            </router-link>
                            <span v-if="isCached(item.lastChapter.link)" class="text-[10px] text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full font-medium">
                                Offline
                            </span>
                        </div>
                    </div>
                    <div class="text-xs text-slate-500 mt-2">
                        {{ formatDate(item.readAt) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
