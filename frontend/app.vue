<template>
  <div id="app" class="h-screen bg-background">
    <!-- App Header -->
    <header class="bg-white border-b border-gray-200 shadow-sm">
      <div class="flex items-center justify-between px-6 py-3">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-ocean-gradient rounded-lg flex items-center justify-center">
            <Icon name="heroicons:document-text" class="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 class="text-lg font-bold text-gray-800">Personal Notes</h1>
            <p class="text-xs text-gray-500">Organize your thoughts</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <!-- Quick Stats -->
          <div class="hidden md:flex items-center space-x-4 text-sm text-gray-600">
            <span>{{ notes.length }} notes</span>
            <span v-if="currentNote">{{ formatFileSize(currentNote.content.length) }}</span>
          </div>
          
          <!-- Settings/Info -->
          <button
            @click="showInfo = !showInfo"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="App Information"
          >
            <Icon name="heroicons:information-circle" class="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Layout -->
    <div class="h-[calc(100vh-64px)]">
      <AppLayout />
    </div>
    
    <!-- Info Modal -->
    <Transition name="fade">
      <div
        v-if="showInfo"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="showInfo = false"
      >
        <div
          class="bg-white rounded-xl shadow-2xl max-w-md mx-4 p-6"
          @click.stop
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">About Personal Notes</h3>
            <button
              @click="showInfo = false"
              class="p-1 hover:bg-gray-100 rounded"
            >
              <Icon name="heroicons:x-mark" class="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div class="space-y-3 text-sm text-gray-600">
            <p>A simple, elegant note-taking app built with Nuxt 3 and Vue 3.</p>
            
            <div>
              <strong class="text-gray-800">Features:</strong>
              <ul class="mt-1 space-y-1 ml-4">
                <li>• Create, edit, and organize notes</li>
                <li>• Search and filter functionality</li>
                <li>• Tag organization system</li>
                <li>• Auto-save with local storage</li>
                <li>• Markdown preview support</li>
                <li>• Responsive design</li>
              </ul>
            </div>
            
            <div>
              <strong class="text-gray-800">Keyboard Shortcuts:</strong>
              <ul class="mt-1 space-y-1 ml-4">
                <li>• <kbd class="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl/Cmd + N</kbd> New note</li>
                <li>• <kbd class="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl/Cmd + S</kbd> Save note</li>
              </ul>
            </div>
            
            <div class="pt-2 border-t border-gray-200 text-xs text-gray-500">
              <p>Data is stored locally in your browser. Export functionality coming soon!</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useNotesStore } from '~/stores/notes'

// Page metadata
useHead({
  title: 'Personal Notes Organizer',
  meta: [
    { name: 'description', content: 'A personal notes organizer for managing your thoughts and ideas' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})

// Store
const notesStore = useNotesStore()
const { notes, currentNote } = storeToRefs(notesStore)

// Local state
const showInfo = ref(false)

// Load notes on app start
onMounted(() => {
  notesStore.loadNotes()
  
  // Select first note if none selected
  if (!currentNote.value && notes.value.length > 0) {
    notesStore.selectNote(notes.value[0])
  }
})

// Utility methods
const formatFileSize = (length: number): string => {
  if (length < 1024) {
    return `${length} chars`
  } else {
    return `${Math.round(length / 1024 * 10) / 10}k chars`
  }
}

// Handle responsive sidebar on mobile
const isMobile = ref(false)

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
  }
  
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })
})
</script>

<style scoped>
kbd {
  font-family: inherit;
  font-size: inherit;
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .w-80 {
    width: 100%;
    position: absolute;
    z-index: 10;
    height: 100%;
  }
}
</style>
