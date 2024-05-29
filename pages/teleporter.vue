<script setup lang='ts'>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import { useOrbsStore } from '~/stores/orbs'; // Adjust the path according to your project structure

const orbsStore = useOrbsStore();

const buttonAnimating = ref(false);
const buttonPressed = ref(false);

const handleKeyDown = (event) => {
  if (event.code === 'Space' && !buttonPressed.value && orbsStore.isManual) {
    buttonPressed.value = true;
    triggerButtonAnimation(true);
    orbsStore.startManualProgress();
  }
};

const handleKeyUp = (event) => {
  if (event.code === 'Space' && orbsStore.isManual) {
    buttonPressed.value = false;
    triggerButtonAnimation(false);
    orbsStore.stopManualProgress();
  }
};

const handleMouseDown = () => {
  if (orbsStore.isManual) {
    buttonPressed.value = true;
    triggerButtonAnimation(true);
    orbsStore.startManualProgress();
  }
};

const handleMouseUp = () => {
  if (orbsStore.isManual) {
    buttonPressed.value = false;
    triggerButtonAnimation(false);
    orbsStore.stopManualProgress();
  }
};

const buyResource = (resourceId: any) => {
  // Implement buy logic here
  console.log(`Buying resource with ID: ${resourceId}`);
};

const triggerButtonAnimation = (isPressing) => {
  if (isPressing) {
    buttonAnimating.value = true;
  } else {
    setTimeout(() => {
      buttonAnimating.value = false;
    }, 250); // Duration of the animation for release
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
});

watch(orbsStore.isManual, (newValue) => {
  if (newValue) {
    orbsStore.stopAutoProgress();
  } else {
    orbsStore.stopManualProgress();
    orbsStore.startAutoProgress();
  }
});
</script>

<template>
  <div class="card grid grid-cols-12 h-[80vh] p-4 items-center">
    <!-- Progress Bar with Checkbox and Counter -->
    <div class="col-span-3 flex items-center">
      <input type="checkbox" id="manualMode" v-model="orbsStore.isManual" />
      <label for="manualMode" class="ml-2">Manual Mode</label>
    </div>
    <div class="col-span-6 w-full mb-4">
      <div class="progress-bar-container">
        <div class="progress-bar-fill-wrapper">
          <div
              class="progress-bar-fill"
              :style="{ width: orbsStore.progress + '%' }"
          ></div>
        </div>
        <div class="progress-bar-counter">
          {{ orbsStore.fillCounter }}
        </div>
        <div class="progress-bar-time">
          {{ orbsStore.tickTimeSeconds }}s / {{ orbsStore.reductionSeconds }}s
        </div>
      </div>
    </div>
    <div class="col-span-3"></div>

    <!-- Left Resource List -->
    <div class="resource-list col-span-2 flex flex-col justify-center items-center w-full">
      <div
          v-for="resource in orbsStore.dust"
          :key="resource.id"
          class="resource-item flex items-center mb-2"
      >
        <span>{{ resource.count }}</span>
        <span class="mx-2">X</span>
        <img :src="resource.icon" class="resource-icon text-2xl w-8 h-8" alt="resource icon">
        <button @click="buyResource(resource.id)" class="ml-2 p-button p-component">
          Buy
        </button>
      </div>
    </div>

    <!-- Game Container -->
    <div class="game-container col-span-8 flex justify-center items-center h-full bg-surface-card">
      <div class="sprite-box flex justify-center items-center w-1/2 h-3/5 border-2 border-black">
        <img
            src="/assets/art/teleport_void.png"
            alt="Borg Infested Teleporter"
            class="sprite-image w-4/5 h-4/5 object-contain"
        />
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
        <img :src="resource.icon" class="resource-icon text-2xl w-8 h-8" alt="resource icon">
        <button @click="buyResource(resource.id)" class="ml-2 p-button p-component">
          Buy
        </button>
      </div>
    </div>

    <!-- Space Button -->
    <div class="col-span-12 flex justify-center mt-4">
      <div
          v-if="orbsStore.isManual"
          :class="['button', { 'press-animate': buttonPressed, 'release-animate': !buttonPressed && buttonAnimating }]"
          @mousedown="handleMouseDown"
          @mouseup="handleMouseUp"
      ></div>
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
</style>
