import { defineStore } from 'pinia';
import { ref, watch, computed } from 'vue';
import blackDustIcon from '~/assets/art/black_dust.png';
import blueDustIcon from '~/assets/art/blue_dust.png';
import greenDustIcon from '~/assets/art/green_dust.png';
import orangeDustIcon from '~/assets/art/orange_dust.png';
import purpleDustIcon from '~/assets/art/purple_dust.png';

import blackOrbIcon from '~/assets/art/black_orb.png';
import blueOrbIcon from '~/assets/art/blue_orb.png';
import greenOrbIcon from '~/assets/art/green_orb.png';
import orangeOrbIcon from '~/assets/art/orange_orb.png';
import purpleOrbIcon from '~/assets/art/purple_orb.png';

interface Resource {
  id: number;
  name: string;
  count: number;
  icon: string;
}

export const useOrbsStore = defineStore('orbs', () => {
  const dust = ref<Resource[]>([]);
  const orbs = ref<Resource[]>([]);
  const progress = ref(0);
  const fillCounter = ref(0);
  const initialTickTime = 10000; // Initial tick time in milliseconds
  const tickTime = ref(initialTickTime); // 10 seconds
  const isManual = ref(false);
  let intervalId: number | null = null;
  let manualIntervalId: number | null = null;

  const initData = () => {
    dust.value = [
      { id: 1, name: 'Black', count: 0, icon: blackDustIcon },
      { id: 2, name: 'Blue', count: 0, icon: blueDustIcon },
      { id: 3, name: 'Green', count: 0, icon: greenDustIcon },
      { id: 4, name: 'Orange', count: 0, icon: orangeDustIcon },
      { id: 5, name: 'Purple', count: 0, icon: purpleDustIcon },
    ];

    orbs.value = [
      { id: 1, name: 'Black', count: 0, icon: blackOrbIcon },
      { id: 2, name: 'Blue', count: 0, icon: blueOrbIcon },
      { id: 3, name: 'Green', count: 0, icon: greenOrbIcon },
      { id: 4, name: 'Orange', count: 0, icon: orangeOrbIcon },
      { id: 5, name: 'Purple', count: 0, icon: purpleOrbIcon },
    ];
  };

  const getResource = (resourceId: number, resourceList: Resource[]) => {
    return resourceList.find(r => r.id === resourceId);
  };

  const incrementResource = (resourceId: number, resourceList: Resource[]) => {
    const resource = getResource(resourceId, resourceList);
    if (resource) {
      resource.count++;
    }
  };

  const decrementResource = (resourceId: number, resourceList: Resource[]) => {
    const resource = getResource(resourceId, resourceList);
    if (resource && resource.count > 0) {
      resource.count--;
    }
  };

  const setProgress = (newProgress: number) => {
    progress.value = newProgress;
  };

  const completeTick = () => {
    fillCounter.value += 1;
    progress.value = 0;
  };

  const startAutoProgress = () => {
    if (process.client && intervalId === null && !isManual.value) {
      const increment = 100 / (tickTime.value / 100); // Calculate increment to complete in tickTime
      intervalId = window.setInterval(() => {
        if (progress.value < 100) {
          progress.value += increment;
        } else {
          completeTick();
        }
      }, 100); // Update every 100 milliseconds
    }
  };

  const stopAutoProgress = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const startManualProgress = () => {
    if (manualIntervalId === null) {
      const increment = 100 / (tickTime.value / 100);
      manualIntervalId = window.setInterval(() => {
        if (progress.value < 100) {
          progress.value += increment;
        } else {
          completeTick();
          // Reduce tickTime by 10% up to a maximum reduction of 30%
          const maxReduction = initialTickTime * 0.7;
          tickTime.value = Math.max(tickTime.value - (tickTime.value * 0.1), maxReduction);
          console.log(`New tickTime: ${tickTime.value}ms`);
        }
      }, 100); // Update every 100 milliseconds
    }
  };

  const stopManualProgress = () => {
    if (manualIntervalId !== null) {
      clearInterval(manualIntervalId);
      manualIntervalId = null;
    }
  };

  const tickTimeSeconds = computed(() => (tickTime.value / 1000).toFixed(1));
  const reductionSeconds = computed(() => ((initialTickTime - tickTime.value) / 1000).toFixed(1));

  watch(isManual, (newValue) => {
    if (newValue) {
      stopAutoProgress();
    } else {
      stopManualProgress(); // Ensure manual progress stops if we switch back to auto
      tickTime.value = initialTickTime; // Reset tickTime to initial value
      startAutoProgress();
    }
  });

  if (process.client) {
    initData(); // Initialize data when store is created
    startAutoProgress();
  }

  return { dust, orbs, progress, fillCounter, tickTime, isManual, getResource, incrementResource, decrementResource, initData, setProgress, startAutoProgress, stopAutoProgress, startManualProgress, stopManualProgress, completeTick, tickTimeSeconds, reductionSeconds };
});
