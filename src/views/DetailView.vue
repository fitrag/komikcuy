<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchDetail } from '../services/api'
import { isFavorite, toggleFavorite } from '../services/storage'
import LazyImage from '../components/LazyImage.vue'

const route = useRoute()
const comic = ref(null)
const loading = ref(true)
const isFav = ref(false)

const handleFavorite = () => {
    if (comic.value) {
        const added = toggleFavorite({
            link: route.params.slug, // store slug as link match
            judul: comic.value.title,
            img: comic.value.img,
            type: comic.value.type
        })
        isFav.value = added
    }
}

onMounted(async () => {
    try {
        const slug = route.params.slug
        if (slug) {
            comic.value = await fetchDetail(slug)
            isFav.value = isFavorite(slug)
        }
    } finally {
        loading.value = false
    }
})

// Compute genres as array if string, helper
const genresList = computed(() => {
    if (!comic.value?.genres) return []
    // API might return "Action, Adventure" string or an array of objects
    if (Array.isArray(comic.value.genres)) {
        return comic.value.genres.map(g => g.genre);
    }
    return comic.value.genres.split(',').map(g => g.trim())
})

const router = useRouter()
const readFirstChapter = () => {
    if (comic.value && comic.value.chapter_list && comic.value.chapter_list.length > 0) {
        // Usually, the list is descending (latest first). So first chapter is the last item.
        // Let's verify if there is any logic needed. Assuming simple list.
        const firstChapter = comic.value.chapter_list[comic.value.chapter_list.length - 1]
        router.push({
            path: `/chapter/${firstChapter.chapter_link}`,
            query: { 
                img: comic.value.img,
                title: comic.value.title
            }
        })
    }
}
</script>

<template>
  <div v-if="loading" class="animate-pulse space-y-6">
    <div class="h-64 md:h-80 w-full bg-slate-800/50 rounded-2xl md:rounded-3xl"></div>
    <div class="h-6 w-2/3 bg-slate-800/50 rounded-lg"></div>
    <div class="h-4 w-full bg-slate-800/50 rounded"></div>
  </div>

  <div v-else-if="comic" class="space-y-6 md:space-y-10 -mx-4 md:mx-0">
     <!-- Hero Section - Mobile Optimized -->
     <div class="relative overflow-hidden md:rounded-3xl bg-slate-900/80 backdrop-blur-sm">
         <!-- Mobile: Cover Image as Background -->
         <div class="md:hidden relative">
             <img 
                 :src="comic.img" 
                 :alt="comic.title" 
                 class="w-full aspect-[4/5] object-cover"
             />
             <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
             
             <!-- Mobile: Overlay Content -->
             <div class="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                 <div class="space-y-1">
                     <h1 class="text-2xl font-black text-white leading-tight">{{ comic.title }}</h1>
                     <p class="text-amber-500 text-sm font-medium">{{ comic.type }}</p>
                 </div>
                 
                 <div class="flex flex-wrap gap-1.5">
                     <span v-for="genre in genresList.slice(0, 4)" :key="genre" 
                           class="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs text-white/80 font-medium">
                         {{ genre }}
                     </span>
                     <span v-if="genresList.length > 4" class="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs text-white/60">
                         +{{ genresList.length - 4 }}
                     </span>
                 </div>
             </div>
         </div>
         
         <!-- Desktop: Original Side-by-Side Layout -->
         <div class="hidden md:block p-6 md:p-10 ring-1 ring-white/10 rounded-3xl">
             <div class="flex flex-col md:flex-row gap-8 relative z-10">
                 <!-- Cover Image -->
                 <div class="w-full md:w-72 flex-shrink-0">
                     <div class="relative group">
                         <div class="absolute -inset-1 bg-gradient-to-r from-amber-500/30 to-amber-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                         <img 
                             :src="comic.img" 
                             :alt="comic.title" 
                             class="relative w-full rounded-2xl shadow-2xl object-cover aspect-[3/4] ring-1 ring-white/10"
                         />
                     </div>
                 </div>

                 <!-- Info -->
                 <div class="flex-1 space-y-5">
                     <div class="space-y-2">
                         <h1 class="text-3xl md:text-4xl font-black text-white tracking-tight">{{ comic.title }}</h1>
                         <p class="text-slate-400 text-lg font-medium">{{ comic.type }}</p>
                     </div>

                     <div class="flex flex-wrap gap-2">
                         <span v-for="genre in genresList" :key="genre" 
                               class="px-3 py-1.5 rounded-xl bg-slate-800/80 text-sm text-slate-300 font-medium ring-1 ring-white/5 hover:ring-amber-500/30 transition-all cursor-default">
                             {{ genre }}
                         </span>
                     </div>

                     <div class="flex flex-wrap gap-3 pt-2">
                         <button 
                             @click="readFirstChapter"
                             class="group relative px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5"
                         >
                             <span class="relative z-10 flex items-center gap-2">
                                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                 </svg>
                                 Start Reading
                             </span>
                         </button>
                         <button 
                             @click="handleFavorite"
                             class="px-5 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-white font-bold rounded-xl transition-all duration-200 ring-1 ring-white/10 hover:ring-amber-500/30 flex items-center gap-2"
                         >
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-colors" :class="isFav ? 'text-red-500 fill-red-500' : 'text-slate-400'" viewBox="0 0 24 24" stroke="currentColor">
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                             </svg>
                             {{ isFav ? 'Saved' : 'Save' }}
                         </button>
                     </div>

                     <div class="pt-4">
                         <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Synopsis</h3>
                         <p class="text-slate-300 leading-relaxed">{{ comic.sinopsis }}</p>
                     </div>
                 </div>
             </div>
             
             <!-- Background Blur -->
             <div class="absolute inset-0 z-0 opacity-30 pointer-events-none" 
                  :style="`background-image: url(${comic.img}); background-size: cover; filter: blur(60px) saturate(150%);`">
             </div>
         </div>
     </div>
     
     <!-- Mobile: Synopsis Section -->
     <div class="md:hidden px-4 space-y-3">
         <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider">Synopsis</h3>
         <p class="text-slate-300 text-sm leading-relaxed">{{ comic.sinopsis }}</p>
     </div>

     <!-- Chapter List -->
     <div class="bg-slate-900/50 backdrop-blur-sm md:rounded-2xl p-4 md:p-8 md:ring-1 md:ring-white/10">
        <div class="flex items-center gap-3 mb-4 md:mb-6">
            <div class="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
            <h3 class="text-lg md:text-xl font-bold text-white">Chapters</h3>
            <span class="ml-auto text-xs text-slate-500 font-medium bg-slate-800/50 px-3 py-1 rounded-full">{{ comic.chapter_list?.length || 0 }}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3">
             <router-link 
                v-for="chapter in comic.chapter_list" 
                :key="chapter.chapter_link" 
                :to="{
                    path: '/chapter/' + chapter.chapter_link,
                    query: { img: comic.img, title: comic.title }
                }"
                class="group flex items-center justify-between p-3.5 md:p-4 rounded-xl bg-slate-800/30 active:bg-amber-500/20 md:hover:bg-amber-500/10 ring-1 ring-white/5 md:hover:ring-amber-500/30 transition-all duration-200"
             >
                <span class="font-medium text-slate-200 group-hover:text-amber-400 transition-colors text-sm">{{ chapter.chapter_name }}</span>
                <span class="text-xs text-slate-500">{{ chapter.chapter_up }}</span>
             </router-link>
        </div>
     </div>
     
     <!-- Mobile: Fixed Bottom Action Bar -->
     <div class="md:hidden fixed bottom-20 left-0 right-0 z-30 px-4 safe-area-inset">
         <div class="flex items-center gap-3 p-3 bg-slate-900/95 backdrop-blur-xl rounded-2xl ring-1 ring-white/10 shadow-2xl">
             <button 
                 @click="handleFavorite"
                 class="p-3.5 rounded-xl transition-all active:scale-95"
                 :class="isFav ? 'bg-red-500/20 text-red-500' : 'bg-slate-800/80 text-slate-400'"
             >
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="isFav ? 'fill-red-500' : ''" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                 </svg>
             </button>
             <button 
                 @click="readFirstChapter"
                 class="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-xl active:from-amber-600 active:to-amber-700 transition-all"
             >
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 Start Reading
             </button>
         </div>
     </div>
  </div>
</template>

<style scoped>
.safe-area-inset {
    padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
