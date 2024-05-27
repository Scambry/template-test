<script setup lang='ts'>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import { useOrbsStore } from '~/stores/orbs' // Adjust the path according to your project structure

const orbsStore = useOrbsStore()

const progress = ref(0)
const buttonAnimating = ref(false)
const buttonPressed = ref(false)
const isManualMode = ref(false)
let intervalId = null
const maxManualChargeSpeedIncrease = 0.7 // Maximum speed increase to 30%

function handleKeyDown(event) {
  if (isManualMode.value && event.code === 'Space' && !buttonPressed.value) {
    buttonPressed.value = true
    triggerButtonAnimation(true)
  }
}

function handleKeyUp(event) {
  if (isManualMode.value && event.code === 'Space') {
    buttonPressed.value = false
    triggerButtonAnimation(false)
  }
}

function handleMouseDown() {
  if (isManualMode.value) {
    buttonPressed.value = true
    triggerButtonAnimation(true)
  }
}

function handleMouseUp() {
  if (isManualMode.value) {
    buttonPressed.value = false
    triggerButtonAnimation(false)
  }
}

function resetProgress() {
  progress.value = 0
  setTimeout(() => {
    if (!isManualMode.value)
      startAutoProgress()
  }, 100) // Brief delay before restarting progress
}

function startAutoProgress() {
  const autoInterval = orbsStore.chargeSpeed / 1000 // Interval for auto charging
  intervalId = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 0.1 // Smaller increment for smoother animation
    }
    else {
      orbsStore.amountOfCharges += 1
      clearInterval(intervalId)
      resetProgress()
    }
  }, autoInterval) // Interval for smoother updates
}

function stopAutoProgress() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(async () => {
  orbsStore.initData()
  startAutoProgress()

  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  window.addEventListener('mousedown', handleMouseDown)
  window.addEventListener('mouseup', handleMouseUp)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  window.removeEventListener('mousedown', handleMouseDown)
  window.removeEventListener('mouseup', handleMouseUp)
  stopAutoProgress()
})

watch(isManualMode, (newValue) => {
  if (newValue) {
    // Manual mode activated, reset progress and stop automatic progress
    stopAutoProgress()
    progress.value = 0
  }
  else {
    // Automatic mode activated, start auto progress and reset manual speed
    orbsStore.manualChargeSpeed = orbsStore.chargeSpeed
    resetProgress()
  }
})

function buyResource(resourceId: any) {
  // Implement buy logic here
  console.log(`Buying resource with ID: ${resourceId}`)
}

function triggerButtonAnimation(isPressing) {
  if (isPressing) {
    buttonAnimating.value = true
    if (isManualMode.value) {
      const manualInterval = orbsStore.manualChargeSpeed / 1000 // Interval for manual charging
      const manualCharging = setInterval(() => {
        if (buttonPressed.value) {
          if (progress.value < 100) {
            progress.value += 0.1 // Increase the progress manually
          }
          else {
            orbsStore.amountOfCharges += 1
            progress.value = 0 // Reset the progress when it reaches 100%
            if (orbsStore.manualChargeSpeed > orbsStore.chargeSpeed * (1 - maxManualChargeSpeedIncrease))
              orbsStore.manualChargeSpeed -= orbsStore.chargeSpeed * 0.1 // Increase speed by 10%
          }
        }
        else {
          clearInterval(manualCharging)
        }
      }, manualInterval) // Short interval for smooth progress
    }
  }
  else {
    setTimeout(() => {
      buttonAnimating.value = false
      if (!buttonPressed.value)
        orbsStore.manualChargeSpeed = orbsStore.chargeSpeed // Reset manual speed when stopping charge
    }, 250) // Duration of the animation for release
  }
}
</script>

<template>
  <div class="card grid grid-cols-12 h-[80vh] p-4 items-center">
    <!-- Progress Bar with Checkbox and Counter -->
    <div class="col-span-3 flex items-center">
      <input id="manualMode" v-model="isManualMode" type="checkbox">
      <label for="manualMode" class="ml-2">Manual Mode</label>
    </div>
    <div class="col-span-6 w-full mb-4">
      <div class="progress-bar-container">
        <div class="progress-bar-fill-wrapper">
          <div
            class="progress-bar-fill"
            :style="{ width: `${progress}%` }"
          />
        </div>
        <div class="progress-bar-counter">
          {{ orbsStore.amountOfCharges }}
        </div>
        <div class="progress-bar-speed">
          {{ isManualMode ? `Manual Speed: ${(orbsStore.manualChargeSpeed / 1000).toFixed(2)}s` : `Auto Speed: ${(orbsStore.chargeSpeed / 1000).toFixed(2)}s` }}
        </div>
      </div>
    </div>
    <div class="col-span-3" />

    <!-- Left Resource List -->
    <div class="resource-list col-span-2 flex flex-col justify-center items-center w-full">
      <div
        v-for="resource in orbsStore.dust"
        :key="resource.id"
        class="resource-item flex items-center mb-2"
      >
        <span>{{ resource.count }}</span>
        <span class="mx-2">X</span>
        <img src="https://picsum.photos/200/300" class="resource-icon text-2xl w-8 h-8" alt="resource icon">
        <button class="ml-2 p-button p-component" @click="buyResource(resource.id)">
          Buy
        </button>
      </div>
    </div>

    <!-- Game Container -->
    <div class="game-container col-span-8 flex justify-center items-center h-full bg-surface-card">
      <div class="sprite-box flex justify-center items-center w-1/2 h-3/5 border-2 border-black">
        <img
          src="https://picsum.photos/200/300"
          alt="Borg Infested Teleporter"
          class="sprite-image w-4/5 h-4/5 object-contain"
        >
      </div>
    </div>

    <!-- Right Resource List -->
    <div class="resource-list col-span-2 flex flex-col justify-center items-center w-full">
      <div
        v-for="resource in orbsStore.orbs"
        :key="resource.id"
        class="resource-item flex items-center mb-2"
      >
        <span>{{ resource.count }}</span>
        <span class="mx-2">X</span>
        <img src="https://picsum.photos/200/300" class="resource-icon text-2xl w-8 h-8" alt="resource icon">
        <button class="ml-2 p-button p-component" @click="buyResource(resource.id)">
          Buy
        </button>
      </div>
    </div>

    <!-- Space Button -->
    <div class="col-span-12 flex justify-center mt-4">
      <div
        v-if="isManualMode"
        class="button" :class="[{ 'press-animate': buttonPressed, 'release-animate': !buttonPressed && buttonAnimating }]"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
      />
    </div>
  </div>
</template>

<style scoped>
.bg-primary-custom {
  background-color: var(--primary-color);
}

.progress-bar-container {
  position: relative;
  overflow: hidden; /* Ensure that the green bar doesn't clip outside */
  height: 24px; /* Adjust height as needed */
  border-radius: 12px; /* Ensure this matches the border-radius of the bar */
  background-color: var(--gray-300); /* Background color for the container */
}

.progress-bar-fill-wrapper {
  height: 100%;
  border-radius: 12px; /* Ensure this matches the border-radius of the container */
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 12px; /* Ensure this matches the border-radius of the container */
  transition: width 0.1s linear; /* Smooth transition for width change */
}

.progress-bar-counter {
  position: absolute;
  right: 10px; /* Adjust positioning as needed */
  top: 50%;
  transform: translateY(-50%);
  color: #000; /* Text color for the counter */
}

.progress-bar-speed {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #000; /* Text color for the speed */
  font-weight: bold;
}

@keyframes buttonPress {
  0% {
    background-image: url('https://picsum.photos/200/300');
  }
  100% {
    background-image: url('https://picsum.photos/200/300');
  }
}

@keyframes buttonRelease {
  0% {
    background-image: url('https://picsum.photos/200/300');
  }
  100% {
    background-image: url('https://picsum.photos/200/300');
  }
}

.button {
  width: 128px; /* Adjust size as needed */
  height: 64px; /* Adjust size as needed */
  background-image: url('https://picsum.photos/200/300'); /* Initial background */
  background-size: cover;
  background-position: center;
}

.button.press-animate {
  animation: buttonPress 0.05s steps(2) forwards;
}

.button.release-animate {
  animation: buttonRelease 0.05s steps(2) forwards;
}
</style>
