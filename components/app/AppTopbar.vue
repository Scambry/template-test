<script setup lang='ts'>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Badge from 'primevue/badge'
import { useOrbsStore } from '~/stores/orbs' // Adjust the path according to your project structure
import { useLayout } from '~/composables/layout'
import { useThemeStore } from '~/stores/theme' // Adjust the path according to your project structure

defineEmits(['menuToggle'])
const { onMenuToggle } = useLayout()
const outsideClickListener = ref(null)
const topbarMenuActive = ref(false)

const orbsStore = useOrbsStore()

onMounted(() => {
  bindOutsideClickListener()
})
onBeforeUnmount(() => {
  unbindOutsideClickListener()
})

function onTopBarMenuButton() {
  topbarMenuActive.value = !topbarMenuActive.value
}

const topbarMenuClasses = computed(() => {
  return {
    'layout-topbar-menu-mobile-active': topbarMenuActive.value,
  }
})

function bindOutsideClickListener() {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event))
        topbarMenuActive.value = false
    }

    document.addEventListener('click', outsideClickListener.value)
  }
}

function unbindOutsideClickListener() {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener.value)
    outsideClickListener.value = null
  }
}

function isOutsideClicked(event) {
  if (!topbarMenuActive.value)
    return
  const sidebarEl = document.querySelector('.layout-topbar-menu')
  const topbarEl = document.querySelector('.layout-topbar-menu-button')

  return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target))
}

const themeStore = useThemeStore()
const op = ref<any>(null)

function toggle(event: any) {
  op.value.toggle(event)
}
</script>

<template>
  <div class="layout-topbar">
    <NuxtLink to="/" class="layout-topbar-logo">
      <span class="ml-1 mr-6" style="color: var(--primary-color)">Idle Game</span>
      <Badge :value="orbsStore.fillCounter" style="background-color: var(--primary-color)" />
    </NuxtLink>

    <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
      <i class="pi pi-bars" />
    </button>

    <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
      <i class="pi pi-ellipsis-v" />
    </button>

    <div class="layout-topbar-menu" :class="topbarMenuClasses">
      <button class="p-link layout-topbar-button" @click="toggle">
        <i class="pi pi-cog" />
        <span>Settings</span>
      </button>
    </div>

    <client-only>
      <OverlayPanel id="overlay_panel" ref="op" append-to="body" style="width: 200px">
        <h6>Theme</h6>
        <div class="field-radiobutton">
          <RadioButton
            v-model="themeStore.themeName"
            input-id="aura-dark"
            name="layoutColorMode"
            value="aura-dark"
            @change="themeStore.setTheme('aura-dark')"
          />
          <label for="aura-dark">Aura Dark</label>
        </div>
        <div class="field-radiobutton">
          <RadioButton
            v-model="themeStore.themeName"
            input-id="aura-light"
            name="layoutColorMode"
            value="aura-light"
            @change="themeStore.setTheme('aura-light')"
          />
          <label for="aura-light">Aura Light</label>
        </div>
        <div class="field-radiobutton">
          <RadioButton
            v-model="themeStore.themeName"
            input-id="lara-dark"
            name="layoutColorMode"
            value="lara-dark"
            @change="themeStore.setTheme('lara-dark')"
          />
          <label for="lara-dark">Lara Dark</label>
        </div>
        <div class="field-radiobutton">
          <RadioButton
            v-model="themeStore.themeName"
            input-id="lara-light"
            name="layoutColorMode"
            value="lara-light"
            @change="themeStore.setTheme('lara-light')"
          />
          <label for="lara-light">Lara Light</label>
        </div>

        <h6>Primary Color</h6>
        <div class="flex">
          <div
            style="width:2rem;height:2rem;border-radius:6px; "
            class="bg-green-500  mr-3  cursor-pointer"
            @click="themeStore.setColor('green')"
          />
          <div
            style="width:2rem;height:2rem;border-radius:6px"
            class="bg-blue-500 mr-3 cursor-pointer"
            @click="themeStore.setColor('blue')"
          />
          <div
            style="width:2rem;height:2rem;border-radius:6px;"
            class="bg-teal-500 mr-3 cursor-pointer"
            @click="themeStore.setColor('teal')"
          />
          <div
            style="width:2rem;height:2rem;border-radius:6px"
            class="bg-purple-500 mr-3 cursor-pointer"
            @click="themeStore.setColor('purple')"
          />
          <div
            style="width:2rem;height:2rem;border-radius:6px"
            class="bg-amber-500 mr-3 cursor-pointer"
            @click="themeStore.setColor('amber')"
          />
        </div>
      </OverlayPanel>
    </client-only>
  </div>
</template>

<style lang="scss" scoped>@media (orientation: landscape) and (max-width: 1024px){
  .layout-topbar {
    display: none;
  }

  .layout-footer {
    display: none;
  }
}</style>

