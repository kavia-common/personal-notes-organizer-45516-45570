<template>
  <div>
    <!-- Mobile Layout -->
    <div class="md:hidden mobile-layout">
      <!-- Mobile Header -->
      <div class="mobile-header">
        <button
          @click="toggleSidebar"
          class="mobile-toggle"
        >
          <Icon name="heroicons:bars-3" class="w-5 h-5" />
        </button>
        
        <div class="flex items-center space-x-2">
          <Icon name="heroicons:document-text" class="w-5 h-5 text-primary" />
          <span class="font-semibold text-gray-800">Personal Notes</span>
        </div>
        
        <button
          v-if="currentNote"
          @click="createNewNote"
          class="mobile-toggle"
        >
          <Icon name="heroicons:plus" class="w-5 h-5" />
        </button>
      </div>
      
      <!-- Mobile Content -->
      <div class="flex-1">
        <NoteEditor />
      </div>
      
      <!-- Mobile Sidebar Overlay -->
      <Transition name="fade">
        <div
          v-if="showMobileSidebar"
          class="mobile-overlay"
          @click="closeSidebar"
        />
      </Transition>
      
      <!-- Mobile Sidebar -->
      <Transition name="slide">
        <div
          v-if="showMobileSidebar"
          class="mobile-sidebar"
        >
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 class="font-semibold text-gray-800">Notes</h2>
            <button
              @click="closeSidebar"
              class="p-1 hover:bg-gray-100 rounded"
            >
              <Icon name="heroicons:x-mark" class="w-5 h-5" />
            </button>
          </div>
          <SidebarNoteList @note-selected="handleNoteSelected" />
        </div>
      </Transition>
    </div>
    
    <!-- Desktop Layout -->
    <div class="hidden md:flex desktop-layout">
      <!-- Desktop Sidebar -->
      <div class="w-80 border-r border-gray-200 bg-white">
        <SidebarNoteList />
      </div>
      
      <!-- Desktop Content -->
      <div class="flex-1">
        <NoteEditor />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotesStore } from '~/stores/notes'

const notesStore = useNotesStore()
const { currentNote } = storeToRefs(notesStore)

// Mobile sidebar state
const showMobileSidebar = ref(false)

const toggleSidebar = () => {
  showMobileSidebar.value = !showMobileSidebar.value
}

const closeSidebar = () => {
  showMobileSidebar.value = false
}

const handleNoteSelected = () => {
  // Close sidebar when note is selected on mobile
  showMobileSidebar.value = false
}

const createNewNote = () => {
  notesStore.createNote()
  showMobileSidebar.value = true
}

// Close sidebar on escape key
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && showMobileSidebar.value) {
      closeSidebar()
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>
