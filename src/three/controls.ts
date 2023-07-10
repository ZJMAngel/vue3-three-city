import eventHub from '@/utils/eventHub';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import camera from './camera';
import { renderer } from './renderer';

class ControlsModule {
  controls?: OrbitControls | FlyControls | FirstPersonControls;
  constructor() {
    this.setOrbitControls();
    eventHub.on('toggleControls', (name) => {
      switch (name) {
        case 'Fly':
          this.setFlyControls();
          break;
        case 'FirstPerson':
          this.setFirstPersonControls();
          break;
        default:
          this.setOrbitControls();
          break;
      }
    });
  }
  setOrbitControls() {
    // 初始化控制器
    this.controls = new OrbitControls(camera.activeCamera, renderer.domElement);
    // 设置控制器阻尼
    this.controls.enableDamping = true;
    // 设置自动旋转
    // controls.autoRotate = true;

    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minPolarAngle = 0;
  }
  setFlyControls() {
    this.controls = new FlyControls(camera.activeCamera, renderer.domElement);
    this.controls.movementSpeed = 100;
    this.controls.rollSpeed = Math.PI / 60;
  }
  setFirstPersonControls() {
    this.controls = new FirstPersonControls(
      camera.activeCamera,
      renderer.domElement
    );
    this.controls.movementSpeed = 100;
  }
}

export default new ControlsModule();
