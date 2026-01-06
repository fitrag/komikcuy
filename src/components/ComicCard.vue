<script setup>
import LazyImage from './LazyImage.vue'

defineProps({
  title: String,
  image: String,
  chapter: String,
  time: String,
  link: String,
})
</script>

<template>
  <div class="group relative overflow-hidden rounded-xl md:rounded-2xl bg-slate-900/50 backdrop-blur-sm shadow-lg ring-1 ring-white/10 transition-all duration-300 active:scale-[0.98] md:hover:-translate-y-2 md:hover:shadow-2xl md:hover:shadow-amber-500/10 md:hover:ring-amber-500/30 cursor-pointer">
    <!-- Image with Aspect Ratio -->
    <LazyImage 
        :src="image" 
        :alt="title" 
        aspect-ratio="aspect-[3/4] w-full"
    >
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-70 z-10"></div>
    </LazyImage>
    
    <!-- Content -->
    <div class="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-20">
      <h3 class="line-clamp-2 text-xs md:text-sm font-semibold text-white/95 drop-shadow-lg transition-colors duration-300 group-hover:text-amber-400 leading-tight">
        {{ title }}
      </h3>
      <div class="mt-1.5 md:mt-2 flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs">
        <span class="rounded-full bg-amber-500/20 px-2 py-0.5 md:px-2.5 md:py-1 text-amber-400 font-medium backdrop-blur-md ring-1 ring-amber-500/30 truncate max-w-[70%]">
          {{ chapter }}
        </span>
        <span class="text-slate-400 truncate">{{ time }}</span>
      </div>
    </div>
    
    <!-- Active State Overlay (Mobile) -->
    <div class="absolute inset-0 bg-white/5 opacity-0 active:opacity-100 transition-opacity duration-150 z-30 md:hidden pointer-events-none"></div>
    
    <!-- Hover Glow Effect (Desktop only) -->
    <div class="hidden md:block absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
      <div class="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-transparent to-amber-500/20 blur-xl"></div>
    </div>
  </div>
</template>

