import { ref, onMounted, onUnmounted } from 'vue'

export function useIsMobile() {
  const isMobile = ref(window.innerWidth <= 640)

  function checkMobile() {
    isMobile.value = window.innerWidth <= 640
  }

  onMounted(() => {
    window.addEventListener('resize', checkMobile)
    checkMobile()
  })
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })

  return { isMobile }
} 