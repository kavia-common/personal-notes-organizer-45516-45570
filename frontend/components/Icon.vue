<template>
  <component
    :is="iconComponent"
    :class="className"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import {
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
  TagIcon,
  XMarkIcon,
  DocumentArrowDownIcon,
  CloudArrowUpIcon,
  InformationCircleIcon,
  Bars3Icon
} from '@heroicons/vue/24/outline'

interface Props {
  name: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: ''
})

const className = computed(() => props.class)

const iconMap = {
  'heroicons:document-text': DocumentTextIcon,
  'heroicons:plus': PlusIcon,
  'heroicons:magnifying-glass': MagnifyingGlassIcon,
  'heroicons:chevron-down': ChevronDownIcon,
  'heroicons:chevron-up': ChevronUpIcon,
  'heroicons:trash': TrashIcon,
  'heroicons:tag': TagIcon,
  'heroicons:x-mark': XMarkIcon,
  'heroicons:document-arrow-down': DocumentArrowDownIcon,
  'heroicons:cloud-arrow-up': CloudArrowUpIcon,
  'heroicons:information-circle': InformationCircleIcon,
  'heroicons:bars-3': Bars3Icon
}

const iconComponent = computed(() => {
  return iconMap[props.name as keyof typeof iconMap] || DocumentTextIcon
})
</script>
