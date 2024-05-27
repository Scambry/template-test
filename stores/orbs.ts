import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Resource {
  id: number
  name: string
  count: number
  icon: string
}

export const useOrbsStore = defineStore('orbs', () => {
  const dust = ref<Resource[]>([])
  const orbs = ref<Resource[]>([])

  // New states
  const amountOfCharges = ref(0)
  const chargeSpeed = ref(10000) // 10 seconds for auto charge
  const manualChargeSpeed = ref(chargeSpeed.value) // Manual speed starts the same as auto speed

  const initData = () => {
    dust.value = [
      { id: 1, name: 'Black', count: 0, icon: 'https://picsum.photos/200/300' },
      { id: 2, name: 'Blue', count: 0, icon: 'https://picsum.photos/200/300' },
      { id: 3, name: 'Green', count: 0, icon: 'https://picsum.photos/200/300' },
      { id: 4, name: 'Orange', count: 0, icon: 'https://picsum.photos/200/300' },
      { id: 5, name: 'Purple', count: 0, icon: 'https://picsum.photos/200/300' },
    ]

    orbs.value = [
      { id: 1, name: 'Black', count: 0, icon: 'https://picsum.photos/200/300' },
      { id: 2, name: 'Blue', count: 0, icon: 'https://picsum.photos/200/300' },
      { id: 3, name: 'Green', count: 0, icon: 'https://picsum.photos/200/300' },
      { id: 4, name: 'Orange', count: 0, icon: 'https://picsum.photos/200/300' },
      { id: 5, name: 'Purple', count: 0, icon: 'https://picsum.photos/200/300' },
    ]
  }

  const getResource = (resourceId: number, resourceList: Resource[]) => {
    return resourceList.find(r => r.id === resourceId)
  }

  const incrementResource = (resourceId: number, resourceList: Resource[]) => {
    const resource = getResource(resourceId, resourceList)
    if (resource)
      resource.count++
  }

  const decrementResource = (resourceId: number, resourceList: Resource[]) => {
    const resource = getResource(resourceId, resourceList)
    if (resource && resource.count > 0)
      resource.count--
  }

  const increaseManualSpeed = () => {
    if (manualChargeSpeed.value > chargeSpeed.value * 0.7)
      manualChargeSpeed.value -= chargeSpeed.value * 0.1
  }

  const decreaseManualSpeed = () => {
    manualChargeSpeed.value = chargeSpeed.value
  }

  return { dust, orbs, amountOfCharges, chargeSpeed, manualChargeSpeed, getResource, incrementResource, decrementResource, increaseManualSpeed, decreaseManualSpeed, initData }
})
