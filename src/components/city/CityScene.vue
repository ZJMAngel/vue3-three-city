<template>
  <div class="scene" ref="sceneDiv"></div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, watch } from 'vue';
import {
  cityScene,
  camera,
  renderer,
  axesHelper,
  animate,
  createCity,
} from '@/three';
import '@/three/init';
import eventHub from '@/utils/eventHub';
import { Color, Vector3 } from 'three';
import FlyLineShader from '@/three/mesh/fly-line-shader';
import LightWall from '@/three/mesh/light-wall';
import LaserRadar from '@/three/mesh/laser-radar';
import gsap from 'gsap';
import controlsModule from '@/three/controls';
import AlarmSprite from '@/three/mesh/alarm-sprite';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const props = defineProps(['eventList']);
const sceneDiv = ref(null);
cityScene.add(camera.activeCamera);
cityScene.add(axesHelper);
createCity();

onMounted(() => {
  (sceneDiv.value as unknown as HTMLDivElement).appendChild(
    renderer.domElement
  );
  animate();
});

let eventListMesh: any[] = [];
interface IPosition {
  x: number;
  z: number;
}
let mapFn: Record<string, (position: IPosition, i: number) => void> = {
  火警: (position: IPosition, i: number) => {
    const lightWall = new LightWall(1, 2, position);
    lightWall.eventListIndex = i;
    cityScene.add(lightWall.mesh);
    eventListMesh.push(lightWall);
  },
  治安: (position: IPosition, i: number) => {
    //   生成随机颜色
    const color = new Color(
      Math.random(),
      Math.random(),
      Math.random()
    ).getHex();
    // 添加着色器飞线
    const flyLineShader = new FlyLineShader(position, color);
    flyLineShader.eventListIndex = i;
    cityScene.add(flyLineShader.mesh);
    eventListMesh.push(flyLineShader);
  },
  电力: (position: IPosition, i: number) => {
    // 添加雷达
    const lightRadar = new LaserRadar(2, position);
    lightRadar.eventListIndex = i;
    cityScene.add(lightRadar.mesh);
    eventListMesh.push(lightRadar);
  },
};

eventHub.on('eventToggle', (i: number) => {
  eventListMesh.forEach((item) => {
    if (item.eventListIndex === i) {
      item.mesh.visible = true;
    } else {
      item.mesh.visible = false;
    }
  });
  const position = {
    x: props.eventList[i].position.x / 5 - 10,
    y: 0,
    z: props.eventList[i].position.y / 5 - 10,
  };
  //   controls.target.set(position.x, position.y, position.z);
  gsap.to((controlsModule.controls as OrbitControls).target, {
    duration: 1,
    x: position.x,
    y: position.y,
    z: position.z,
  });
});

watch(
  () => props.eventList,
  (val) => {
    console.log(1112, eventListMesh);

    console.log(val);
    eventListMesh.forEach((item) => {
      item.remove();
    });
    eventListMesh = [];
    props.eventList.forEach(
      (item: { name: string; position: Vector3 }, i: number) => {
        const position = {
          x: item.position.x / 5 - 10,
          z: item.position.y / 5 - 10,
        };
        const alarmSprite = new AlarmSprite(item.name, position);
        alarmSprite.onClick(() => {
          // console.log(item.name, i);
          eventHub.emit('spriteClick', i);
        });
        alarmSprite.eventListIndex = i;
        eventListMesh.push(alarmSprite);
        cityScene.add(alarmSprite.mesh);
        if (mapFn[item.name]) {
          mapFn[item.name](position, i);
        }
      }
    );
    console.log(22222, eventListMesh);
  }
);
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
