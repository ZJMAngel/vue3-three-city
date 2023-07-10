import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import gsap from 'gsap';
import eventHub from '@/utils/eventHub';
import activeCamera from '../camera';
import parkScene from '../park-scene';
import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  CatmullRomCurve3,
  Mesh,
  PerspectiveCamera,
  Vector3,
} from 'three';

export default class Park {
  private mixer?: AnimationMixer;
  private clip?: AnimationClip;
  private action?: AnimationAction;
  private gltf?: GLTF;
  private curveProgress?: number;
  private curve = new CatmullRomCurve3();
  private redcar?: Mesh;
  constructor() {
    // 载入模型
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    dracoLoader.preload();
    loader.setDRACOLoader(dracoLoader);

    loader.load('./model/city4.glb', (gltf) => {
      this.gltf = gltf;
      parkScene.add(gltf.scene);
      // 场景子元素遍历
      gltf.scene.traverse((child: any) => {
        if (child.name === '热气球') {
          this.mixer = new AnimationMixer(child);
          this.clip = gltf.animations[1];
          this.action = this.mixer.clipAction(this.clip);
          this.action.play();
        }

        if (child.name === '汽车园区轨迹') {
          // console.log(child);
          const line = child;
          line.visible = false;
          // 根据点创建曲线
          const points = [];
          for (let i = line.geometry.attributes.position.count; i--; ) {
            points.push(
              new Vector3(
                line.geometry.attributes.position.getX(i),
                line.geometry.attributes.position.getY(i),
                line.geometry.attributes.position.getZ(i)
              )
            );
          }

          this.curve = new CatmullRomCurve3(points);
          this.curveProgress = 0;
          this.carAnimation();
        }

        if (child.name === 'redcar') {
          // console.log(child)
          this.redcar = child;
        }
      });
      gltf.cameras.forEach((camera) => {
        console.log(777, camera);
        activeCamera.add(camera.name, camera as PerspectiveCamera);
      });
    });
    eventHub.on('actionClick', (i) => {
      // console.log(i)
      this.action?.reset();
      this.clip = this.gltf?.animations[i];
      this.action = this.mixer?.clipAction(this.clip as AnimationClip);
      this.action?.play();
    });
  }
  carAnimation() {
    gsap.to(this, {
      curveProgress: 0.999,
      duration: 10,
      repeat: -1,
      onUpdate: () => {
        const point = this.curve?.getPoint(this.curveProgress as number);
        this.redcar?.position.set(point?.x, point?.y, point?.z);
        // 调整车朝向在曲线切线上
        if ((this.curveProgress as number) + 0.001 < 1) {
          const point = this.curve?.getPoint(
            (this.curveProgress as number) + 0.001
          );
          this.redcar?.lookAt(point);
        }
      },
    });
  }

  update(time: number) {
    if (this?.mixer) {
      this.mixer.update(time);
    }
  }
}
