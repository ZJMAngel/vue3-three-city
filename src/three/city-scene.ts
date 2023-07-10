import { CubeTextureLoader, Scene } from 'three';

const cityScene = new Scene();

// 场景天空盒
const textureCubeLoader = new CubeTextureLoader().setPath('./textures/');
const textureCube = textureCubeLoader.load([
  '1.jpg',
  '2.jpg',
  '3.jpg',
  '4.jpg',
  '5.jpg',
  '6.jpg',
]);

cityScene.background = textureCube;
cityScene.environment = textureCube;

export default cityScene;
