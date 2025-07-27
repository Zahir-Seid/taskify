import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useIsMobile(): { isMobile: Ref<boolean> } {
  const isMobile = ref<boolean>(window.innerWidth <= 640)

  function checkMobile(): void {
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
