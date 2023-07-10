import camera from './camera';
import { css3drender, renderer } from './renderer';

// 监听屏幕大小改变的变化，设置渲染的尺寸
const activeCamera = camera.activeCamera;
// 更新摄像头
activeCamera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
activeCamera.updateProjectionMatrix();

window.addEventListener('resize', () => {
  //   console.log("resize");
  const activeCamera = camera.activeCamera;
  // 更新摄像头
  activeCamera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  activeCamera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio);
  // 更新cssrender
  css3drender.setSize(window.innerWidth, window.innerHeight);
});
