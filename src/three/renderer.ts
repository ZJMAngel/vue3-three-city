import { ACESFilmicToneMapping, WebGLRenderer } from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
// 初始化渲染器
const renderer = new WebGLRenderer({
  // 设置抗锯齿
  antialias: true,
  logarithmicDepthBuffer: true,
});
// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.toneMapping = ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;

const css3drender = new CSS3DRenderer();
css3drender.setSize(window.innerWidth, window.innerHeight);
(document.querySelector('#cssrender') as HTMLDivElement)?.appendChild(
  css3drender.domElement
);
export { css3drender, renderer };
