import { defineStore } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import blackDustIcon from '~/assets/art/black_dust.png'
import blueDustIcon from '~/assets/art/blue_dust.png'
import greenDustIcon from '~/assets/art/green_dust.png'
import orangeDustIcon from '~/assets/art/orange_dust.png'
import purpleDustIcon from '~/assets/art/purple_dust.png'

import blackOrbIcon from '~/assets/art/black_orb.png'
import blueOrbIcon from '~/assets/art/blue_orb.png'
import greenOrbIcon from '~/assets/art/green_orb.png'
import orangeOrbIcon from '~/assets/art/orange_orb.png'
import purpleOrbIcon from '~/assets/art/purple_orb.png'

interface Resource {
  id: number
  name: string
  count: number
  icon: string
  cost: number
}

const defaultDust = [
  { id: 1, name: 'Black', cost: 1, count: 0, icon: blackDustIcon },
  { id: 2, name: 'Blue', cost: 10, count: 0, icon: blueDustIcon },
  { id: 3, name: 'Green', cost: 25, count: 0, icon: greenDustIcon },
  { id: 4, name: 'Orange', cost: 50, count: 0, icon: orangeDustIcon },
  { id: 5, name: 'Purple', cost: 100, count: 0, icon: purpleDustIcon },
]

const defaultOrbs = [
  { id: 1, name: 'Black', cost: 1, count: 0, icon: blackOrbIcon },
  { id: 2, name: 'Blue', cost: 10, count: 0, icon: blueOrbIcon },
  { id: 3, name: 'Green', cost: 25, count: 0, icon: greenOrbIcon },
  { id: 4, name: 'Orange', cost: 50, count: 0, icon: orangeOrbIcon },
  { id: 5, name: 'Purple', cost: 100, count: 0, icon: purpleOrbIcon },
]

export const useOrbsStore = defineStore('orbs', () => {
  const dust = ref<Resource[]>([])
  const orbs = ref<Resource[]>([])
  const progress = ref(0)
  const fillCounter = ref(0)
  const initialTickTime = 10000 // Initial tick time in milliseconds
  const tickTime = ref(initialTickTime) // 10 seconds
  const isManual = ref(false)
  const maxReduction = ref(3000) // Maximum reduction of 3 seconds in milliseconds
  let intervalId: number | null = null
  let manualIntervalId: number | null = null

  const saveState = () => {
    if (process.client) {
      localStorage.setItem('dust', JSON.stringify(dust.value))
      localStorage.setItem('orbs', JSON.stringify(orbs.value))
      localStorage.setItem('progress', JSON.stringify(progress.value))
      localStorage.setItem('fillCounter', JSON.stringify(fillCounter.value))
      localStorage.setItem('tickTime', JSON.stringify(tickTime.value))
      localStorage.setItem('isManual', JSON.stringify(isManual.value))
      console.log('State saved', {
        dust: dust.value,
        orbs: orbs.value,
        progress: progress.value,
        fillCounter: fillCounter.value,
        tickTime: tickTime.value,
        isManual: isManual.value,
      })
    }
  }

  const loadState = () => {
    if (process.client) {
      const savedDust = localStorage.getItem('dust')
      const savedOrbs = localStorage.getItem('orbs')
      const savedProgress = localStorage.getItem('progress')
      const savedFillCounter = localStorage.getItem('fillCounter')
      const savedTickTime = localStorage.getItem('tickTime')
      const savedIsManual = localStorage.getItem('isManual')

      dust.value = savedDust ? JSON.parse(savedDust) : []
      orbs.value = savedOrbs ? JSON.parse(savedOrbs) : []
      progress.value = savedProgress !== null ? JSON.parse(savedProgress) : 0
      fillCounter.value = savedFillCounter !== null ? JSON.parse(savedFillCounter) : 0
      tickTime.value = savedTickTime !== null ? JSON.parse(savedTickTime) : initialTickTime
      isManual.value = savedIsManual !== null ? JSON.parse(savedIsManual) : false

      console.log('State loaded', {
        dust: dust.value,
        orbs: orbs.value,
        progress: progress.value,
        fillCounter: fillCounter.value,
        tickTime: tickTime.value,
        isManual: isManual.value,
      })
    }
  }

  const initData = () => {
    if (dust.value.length === 0)
      dust.value = defaultDust

    if (orbs.value.length === 0)
      orbs.value = defaultOrbs

    saveState() // Save the initialized data to localStorage
  }

  const getResource = (resourceId: number, resourceList: Resource[]) => {
    return resourceList.find(r => r.id === resourceId)
  }

  const incrementResource = (resourceId: number, resourceList: Resource[]) => {
    const resource = getResource(resourceId, resourceList)
    if (resource) {
      resource.count++
      saveState() // Save state after incrementing
    }
  }

  const decrementResource = (resourceId: number, resourceList: Resource[]) => {
    const resource = getResource(resourceId, resourceList)
    if (resource && resource.count > 0) {
      resource.count--
      saveState() // Save state after decrementing
    }
  }

  const setProgress = (newProgress: number) => {
    progress.value = newProgress
    saveState() // Save state after setting progress
  }

  const completeTick = () => {
    fillCounter.value += 1
    progress.value = 0
    saveState() // Save state after completing tick
  }

  const startAutoProgress = () => {
    if (process.client && intervalId === null && !isManual.value) {
      const increment = 100 / (tickTime.value / 100) // Calculate increment to complete in tickTime
      intervalId = window.setInterval(() => {
        if (progress.value < 100)
          progress.value += increment
        else
          completeTick()
      }, 100) // Update every 100 milliseconds
    }
  }

  const stopAutoProgress = () => {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  const startManualProgress = () => {
    if (manualIntervalId === null) {
      const increment = 100 / (tickTime.value / 100) // Calculate increment to complete in tickTime
      manualIntervalId = window.setInterval(() => {
        if (progress.value < 100) {
          progress.value += increment
        }
        else {
          completeTick()
          // Reduce tickTime by 1 second up to a maximum reduction of maxReduction
          const newTickTime = tickTime.value - 1000
          tickTime.value = Math.max(newTickTime, initialTickTime - maxReduction.value)
          console.log(`New tickTime: ${tickTime.value}ms`)
          saveState() // Save state after tick time reduction
        }
      }, 100) // Update every 100 milliseconds
    }
  }

  const stopManualProgress = () => {
    if (manualIntervalId !== null) {
      clearInterval(manualIntervalId)
      manualIntervalId = null
    }
  }

  const tickTimeSeconds = computed(() => (tickTime.value / 1000).toFixed(1))
  const reductionSeconds = computed(() => ((initialTickTime - tickTime.value) / 1000).toFixed(1))

  watch(isManual, (newValue) => {
    saveState() // Save state when isManual changes
    if (newValue) {
      stopAutoProgress()
    }
    else {
      stopManualProgress() // Ensure manual progress stops if we switch back to auto
      tickTime.value = initialTickTime // Reset tickTime to initial value
      startAutoProgress()
    }
  })

  onMounted(() => {
    // loadState(); // Load state when store is created
    initData() // Initialize data if dust or orbs array is empty

    startAutoProgress()

    // Save state every 3 seconds
    setInterval(() => {
      saveState()
    }, 3000)
  })

  return {
    dust,
    orbs,
    progress,
    fillCounter,
    tickTime,
    isManual,
    maxReduction,
    getResource,
    incrementResource,
    decrementResource,
    initData,
    setProgress,
    startAutoProgress,
    stopAutoProgress,
    startManualProgress,
    stopManualProgress,
    completeTick,
    tickTimeSeconds,
    reductionSeconds,
  }
})
