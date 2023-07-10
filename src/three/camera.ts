import eventHub from '@/utils/eventHub';
import { PerspectiveCamera } from 'three';

// const camera = new PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   50000
// );

// // 设置相机位置
// camera.position.set(5, 10, 15);

// 创建透视相机
const camera = new PerspectiveCamera(
  75,
  window.innerHeight / window.innerHeight,
  1,
  100000
);
// 设置相机位置
// object3d具有position，属性是1个3维的向量
camera.position.set(1000, 1000, 1000);

class CameraModule {
  activeCamera: PerspectiveCamera;
  collection: Record<string, PerspectiveCamera>;
  constructor() {
    this.activeCamera = camera;
    this.collection = {
      default: camera,
    };

    eventHub.on('toggleCamera', (name) => {
      this.setActive(name);
    });
    console.log(666, this.collection);
  }
  add(name: string, camera: PerspectiveCamera) {
    this.collection[name] = camera;
  }
  private setActive(name: string) {
    this.activeCamera = this.collection[name];
  }
}

export default new CameraModule();
