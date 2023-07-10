<template>
  <div class="factoryScene" ref="sceneDiv"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  factoryScene,
  camera,
  renderer,
  axesHelper,
  animate2,
  createFactory,
} from '@/three';
import '@/three/init';
import eventHub from '@/utils/eventHub';

const sceneDiv = ref<HTMLDivElement>();
factoryScene.add(camera.activeCamera);
factoryScene.add(axesHelper);
createFactory();

onMounted(() => {
  sceneDiv.value?.appendChild(renderer.domElement);
  animate2();
});
</script>

<style scoped>
.factoryScene {
  width: 100vh;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
</style>
