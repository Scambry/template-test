<script setup lang='ts'>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import { useOrbsStore } from '~/stores/orbs' // Adjust the path according to your project structure

const orbsStore = useOrbsStore()

const buttonAnimating = ref(false)
const buttonPressed = ref(false)

function handleKeyDown(event) {
  if (event.code === 'Space' && !buttonPressed.value && orbsStore.isManual) {
    buttonPressed.value = true
    triggerButtonAnimation(true)
    orbsStore.startManualProgress()
  }
}

function handleKeyUp(event) {
  if (event.code === 'Space' && orbsStore.isManual) {
    buttonPressed.value = false
    triggerButtonAnimation(false)
    orbsStore.stopManualProgress()
  }
}

function handleMouseDown() {
  if (orbsStore.isManual) {
    buttonPressed.value = true
    triggerButtonAnimation(true)
    orbsStore.startManualProgress()
  }
}

function handleMouseUp() {
  if (orbsStore.isManual) {
    buttonPressed.value = false
    triggerButtonAnimation(false)
    orbsStore.stopManualProgress()
  }
}

function triggerButtonAnimation(isPressing) {
  if (isPressing) {
    buttonAnimating.value = true
  }
  else {
    setTimeout(() => {
      buttonAnimating.value = false
    }, 250) // Duration of the animation for release
  }
}

onMounted(() => {
  orbsStore.initData() // Ensure initData is called to initialize the resources

  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)

  // Prevent body from scrolling
  document.body.style.overflow = 'hidden'
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)

  // Re-enable body scrolling
  document.body.style.overflow = ''
})

watch(orbsStore.isManual, (newValue) => {
  if (newValue) {
    orbsStore.stopAutoProgress()
  }
  else {
    orbsStore.stopManualProgress()
    orbsStore.startAutoProgress()
  }
})
</script>

<template>
  <div class="card-wrapper">
    <div class="card grid grid-cols-12 p-4 items-center">
      <!-- Image -->
      <div class="col-span-4 flex justify-center items-center">
        <div class="relative flex justify-center items-center md:w-32 md:h-32 w-16 h-16">
          <img class="w-full h-full z-10" src="/assets/art/tile000.png" alt="Border Image">
          <img class="absolute md:w-25.5 md:h-25.5 w-12 h-12 z-20" src="https://picsum.photos/64/64" alt="Inner Image">
        </div>
      </div>
      <!-- Progress Bar with Counter and Time -->
      <div class="col-span-4 w-full mb-4">
        <div class="progress-bar-container">
          <div class="progress-bar-fill-wrapper">
            <div
                class="progress-bar-fill"
                :style="{ width: `${orbsStore.progress}%` }"
            />
          </div>
          <div class="progress-bar-time">
            {{ orbsStore.tickTimeSeconds }}s / {{ orbsStore.reductionSeconds }}s
          </div>
        </div>
      </div>
      <!-- Image -->
      <div class="col-span-4 flex justify-center items-center">
        <div class="relative flex justify-center items-center md:w-32 md:h-32 w-16 h-16">
          <img class="w-full h-full z-10" src="/assets/art/tile000.png" alt="Border Image">
          <img class="absolute md:w-25.5 md:h-25.5 w-12 h-12 z-20" src="https://picsum.photos/64/64" alt="Inner Image">
        </div>
      </div>

      <!-- Manual Mode Checkbox -->
      <div class="col-span-12 flex justify-center mt-4">
        <input id="manualMode" v-model="orbsStore.isManual" type="checkbox">
        <label for="manualMode" class="ml-2">Manual Mode</label>
      </div>
      <div class="col-span-12 flex justify-center mt-4">
        <Button label="Delete Storage" @click="orbsStore.clearLocalStorage" @touchstart="orbsStore.clearLocalStorage()" />
      </div>

      <!-- Left Resource List -->
      <div class="resource-list col-span-2 flex flex-col justify-center items-center w-full">
        <div
            v-for="resource in orbsStore.dust"
            :key="resource.id"
            class="resource-item flex items-center mb-2"
        >
          <span>{{ resource.count }}</span>
          <span class="mx-2">X</span>
          <img draggable="false" :src="resource.icon" class="resource-icon text-2xl w-8 h-8" alt="resource icon">
          <Button :label="String(resource.cost)" class="ml-2 p-button md:w-[4rem] md:h-[2rem] w-[2rem] h-[1.5rem] md:text-base text-sm md:text-center text-center" @click="orbsStore.buyResource(resource.id, orbsStore.dust)" />
        </div>
      </div>

      <!-- Game Container -->
      <div class="game-container col-span-8 flex justify-center items-center h-full bg-surface-card">
        <div class="sprite-box flex justify-center items-center w-1/2 h-3/5 border-2 border-black">
          <img
              draggable="false"
              src="/assets/art/teleport_void.png"
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
          <img draggable="false" :src="resource.icon" class="resource-icon text-2xl w-8 h-8" alt="resource icon">
          <Button :label="String(resource.cost)" class="ml-2 p-button md:w-[4rem] md:h-[2rem] w-[2rem] h-[1.5rem] md:text-base text-sm md:text-center text-center" @click="orbsStore.buyResource(resource.id, orbsStore.orbs)" />
        </div>
      </div>
      <!-- Space Button -->
      <div class="col-span-12 flex justify-center mt-4">
        <div class="button-container">
          <div
              v-if="orbsStore.isManual"
              class="button" :class="[{ 'press-animate': buttonPressed, 'release-animate': !buttonPressed && buttonAnimating }]"
              @mousedown="handleMouseDown"
              @mouseup="handleMouseUp"
              @touchstart="handleMouseDown"
              @touchend="handleMouseUp"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-primary-custom {
  background-color: var(--primary-color);
}

.card-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 5rem; /* Adjust this value based on the height of your topbar */
  left: 0;
  right: 0;
  bottom: 5rem; /* Adjust to ensure the card doesn't overlap the footer */
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.5); /* Optional: Add a background overlay */
  z-index: 996; /* Ensure this is below the topbar z-index */
  padding: 1rem; /* Add padding for better spacing on smaller screens */
}

.card {
  width: 100%; /* Ensure the card takes the full width of the container */
  max-width: 1200px; /* Optionally, set a max-width to prevent it from getting too large */
  height: calc(100% - 10rem); /* Adjust height to account for topbar and footer */
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
  text-align: right;
  width: 100%;
}

.progress-bar-time {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #000; /* Text color for the time display */
  text-align: center;
  white-space: nowrap;
}

.button-container {
  width: 128px; /* Fixed width to prevent layout shift */
  height: 64px; /* Fixed height to prevent layout shift */
}

@keyframes buttonPress {
  0% {
    background-image: url('assets/art/tile120.png');
  }
  100% {
    background-image: url('assets/art/tile122.png');
  }
}

@keyframes buttonRelease {
  0% {
    background-image: url('assets/art/tile122.png');
  }
  100% {
    background-image: url('assets/art/tile120.png');
  }
}

.button {
  width: 128px; /* Adjust size as needed */
  height: 64px; /* Adjust size as needed */
  background-image: url('assets/art/tile120.png'); /* Initial background */
  background-size: cover;
  background-position: center;
}

.button.press-animate {
  animation: buttonPress 0.05s steps(2) forwards;
}

.button.release-animate {
  animation: buttonRelease 0.05s steps(2) forwards;
}

img {
  user-select: none;
  pointer-events: none;
}

.p-button {
  padding: 0.5rem 0.5rem;
}

.card {
  position: relative;
}

.card.static {
  user-select: none;
}

.card .button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 1rem; /* Adjust to ensure the button stays within the card */
  left: 50%;
  transform: translateX(-50%);
}

@media (max-width: 768px) {
  .card-wrapper {
    padding: 0.5rem; /* Adjust padding for smaller screens */
  }
  .card {
    width: 100%;
    height: auto; /* Ensure the card takes full width but auto height */
  }
  .progress-bar-container {
    height: 20px; /* Adjust height for smaller screens */
  }
  .button-container {
    width: 100px; /* Adjust button size for smaller screens */
    height: 50px;
  }
}

@media (orientation: landscape) and (max-width: 768px) {
  .card-wrapper {
    flex-direction: column; /* Ensure proper layout in landscape mode */
    padding: 0.5rem; /* Adjust padding for landscape */
  }
  .card {
    height: calc(100% - 10rem); /* Ensure proper height in landscape */
  }
}
</style>
