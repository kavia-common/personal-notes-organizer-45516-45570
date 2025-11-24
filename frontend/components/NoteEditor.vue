<template>
  <div class="flex flex-col h-full bg-white">
    <!-- Editor Header -->
    <div v-if="currentNote" class="border-b border-gray-200 p-4">
      <div class="flex items-center justify-between mb-3">
        <input
          v-model="localTitle"
          @input="handleTitleChange"
          placeholder="Note title..."
          class="text-xl font-bold bg-transparent border-none outline-none flex-1 text-gray-800 placeholder-gray-400"
        />
        <div class="flex items-center space-x-2">
          <span 
            v-if="isAutoSaving"
            class="text-xs text-gray-500 flex items-center"
          >
            <Icon name="heroicons:cloud-arrow-up" class="w-4 h-4 mr-1 animate-pulse" />
            Saving...
          </span>
          <span 
            v-else-if="lastSaved"
            class="text-xs text-gray-500"
          >
            Saved {{ formatLastSaved(lastSaved) }}
          </span>
          <button
            @click="manualSave"
            class="btn btn-ghost text-sm"
            title="Save (Ctrl/Cmd + S)"
          >
            <Icon name="heroicons:document-arrow-down" class="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <!-- Tags Editor -->
      <div class="flex items-center space-x-2">
        <Icon name="heroicons:tag" class="w-4 h-4 text-gray-400" />
        <div class="flex flex-wrap gap-1 flex-1">
          <span
            v-for="(tag, index) in localTags"
            :key="index"
            class="inline-flex items-center px-2 py-1 text-xs bg-secondary bg-opacity-20 text-secondary rounded-full"
          >
            {{ tag }}
            <button
              @click="removeTag(index)"
              class="ml-1 hover:text-red-500"
            >
              <Icon name="heroicons:x-mark" class="w-3 h-3" />
            </button>
          </span>
          <input
            v-model="newTag"
            @keydown.enter="addTag"
            @keydown.comma.prevent="addTag"
            @blur="addTag"
            placeholder="Add tag..."
            class="text-xs bg-transparent outline-none placeholder-gray-400 min-w-0 flex-1"
            style="min-width: 60px;"
          />
        </div>
      </div>
      
      <!-- Note Metadata -->
      <div class="flex items-center justify-between text-xs text-gray-500 mt-2">
        <div>
          Created: {{ formatDate(currentNote.createdAt) }}
        </div>
        <div>
          Modified: {{ formatDate(currentNote.updatedAt) }}
        </div>
      </div>
    </div>
    
    <!-- Editor Content -->
    <div v-if="currentNote" class="flex-1 flex">
      <!-- Text Editor -->
      <div class="flex-1 flex flex-col">
        <div class="flex items-center justify-between border-b border-gray-100 px-4 py-2 bg-gray-50">
          <div class="flex items-center space-x-2">
            <button
              @click="showPreview = !showPreview"
              :class="[
                'text-xs px-3 py-1 rounded',
                showPreview 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              ]"
            >
              {{ showPreview ? 'Edit' : 'Preview' }}
            </button>
            <span class="text-xs text-gray-500">
              {{ wordCount }} words, {{ charCount }} characters
            </span>
          </div>
          
          <div class="text-xs text-gray-500">
            Supports Markdown
          </div>
        </div>
        
        <div class="flex-1 relative">
          <!-- Editor -->
          <textarea
            v-if="!showPreview"
            v-model="localContent"
            @input="handleContentChange"
            placeholder="Start writing your note..."
            class="w-full h-full p-4 resize-none border-none outline-none bg-white text-gray-800 placeholder-gray-400 custom-scrollbar"
          ></textarea>
          
          <!-- Preview -->
          <div
            v-else
            class="w-full h-full p-4 overflow-y-auto custom-scrollbar bg-white"
            v-html="renderedMarkdown"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <Icon name="heroicons:document-text" class="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 class="text-lg font-medium text-gray-600 mb-2">No note selected</h3>
        <p class="text-gray-500 mb-4">Select a note from the sidebar or create a new one</p>
        <button
          @click="createNewNote"
          class="btn btn-primary"
        >
          <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
          Create New Note
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotesStore } from '~/stores/notes'
import type { Note } from '~/types/note'

const notesStore = useNotesStore()
const { currentNote } = storeToRefs(notesStore)

// Local reactive state
const localTitle = ref('')
const localContent = ref('')
const localTags = ref<string[]>([])
const newTag = ref('')
const showPreview = ref(false)
const isAutoSaving = ref(false)
const lastSaved = ref<Date | null>(null)

// Computed properties
const wordCount = computed(() => {
  return localContent.value.trim().split(/\s+/).filter(word => word.length > 0).length
})

const charCount = computed(() => {
  return localContent.value.length
})

const renderedMarkdown = computed(() => {
  return renderMarkdown(localContent.value)
})

// Watch for note changes
watch(currentNote, (note) => {
  if (note) {
    localTitle.value = note.title
    localContent.value = note.content
    localTags.value = [...note.tags]
  }
}, { immediate: true })

// Auto-save handlers
const handleTitleChange = () => {
  if (currentNote.value) {
    isAutoSaving.value = true
    notesStore.autoSave(currentNote.value.id, { title: localTitle.value })
    setTimeout(() => {
      isAutoSaving.value = false
      lastSaved.value = new Date()
    }, 500)
  }
}

const handleContentChange = () => {
  if (currentNote.value) {
    isAutoSaving.value = true
    notesStore.autoSave(currentNote.value.id, { content: localContent.value })
    setTimeout(() => {
      isAutoSaving.value = false
      lastSaved.value = new Date()
    }, 500)
  }
}

// Tag management
const addTag = () => {
  const tag = newTag.value.trim().replace(',', '')
  if (tag && !localTags.value.includes(tag)) {
    localTags.value.push(tag)
    newTag.value = ''
    saveTags()
  } else {
    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  localTags.value.splice(index, 1)
  saveTags()
}

const saveTags = () => {
  if (currentNote.value) {
    notesStore.updateNote(currentNote.value.id, { tags: localTags.value })
    lastSaved.value = new Date()
  }
}

// Methods
const manualSave = () => {
  if (currentNote.value) {
    notesStore.updateNote(currentNote.value.id, {
      title: localTitle.value,
      content: localContent.value,
      tags: localTags.value
    })
    lastSaved.value = new Date()
  }
}

const createNewNote = () => {
  notesStore.createNote()
}

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatLastSaved = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  
  if (diffSeconds < 60) {
    return 'just now'
  } else if (diffSeconds < 3600) {
    const minutes = Math.floor(diffSeconds / 60)
    return `${minutes}m ago`
  } else {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
}

// Simple markdown renderer
const renderMarkdown = (text: string): string => {
  return text
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    
    // Code
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    
    // Links (basic)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener">$1</a>')
    
    // Line breaks
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/\n/g, '<br>')
    
    // Wrap in paragraph
    .replace(/^(.*)$/gim, '<p class="mb-2">$1</p>')
    
    // Lists (basic)
    .replace(/^\- (.*$)/gim, '<li class="ml-4">• $1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4">$1. $2</li>')
}

// Keyboard shortcuts
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      manualSave()
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style scoped>
/* Markdown preview styles */
:deep(h1), :deep(h2), :deep(h3) {
  color: #1f2937;
}

:deep(code) {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
}

:deep(p:last-child) {
  margin-bottom: 0;
}
</style>
