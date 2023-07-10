<template>
  <div class="scene" ref="sceneDiv"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  parkScene,
  camera,
  renderer,
  axesHelper,
  animate1,
  createPark,
} from '@/three';
import '@/three/init';

const sceneDiv = ref<HTMLDivElement>();
parkScene.add(camera.activeCamera);
parkScene.add(axesHelper);
createPark();

onMounted(() => {
  sceneDiv.value?.appendChild(renderer.domElement);
  animate1();
});
</script>

<style scoped>
.scene {
  width: 100vh;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
</style>
