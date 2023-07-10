import { Clock } from 'three';
import camera from './camera';
import { renderer, css3drender } from './renderer';
import controlsModule from './controls';
import parkScene from './park-scene';
import factoryScene from './factory-scene';
import cityScene from './city-scene';
import { updateMesh } from './create-mesh';

const clock = new Clock();

export function animate() {
  const time = clock.getDelta();
  controlsModule.controls?.update(time);
  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(cityScene, camera.activeCamera);
}

export function animate1() {
  const time = clock.getDelta();
  controlsModule.controls?.update(time);
  updateMesh(time);
  requestAnimationFrame(animate1);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(parkScene, camera.activeCamera);
}
export function animate2() {
  const time = clock.getDelta();
  controlsModule.controls?.update(time);
  requestAnimationFrame(animate2);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(factoryScene, camera.activeCamera);
  css3drender.render(factoryScene, camera.activeCamera);
}
