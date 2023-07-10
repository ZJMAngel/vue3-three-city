import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import gsap from 'gsap';
import factoryScene from '../factory-scene';
import {
  AdditiveBlending,
  BufferAttribute,
  Color,
  Group,
  Object3D,
  Points,
  PointsMaterial,
  Raycaster,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  Vector3,
} from 'three';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import eventHub from '@/utils/eventHub';
import cameraModule from '../camera';
import vertex from '../shader/fighter-point/vertex.glsl';
import fragment from '../shader/fighter-point/fragment.glsl';

export default class Factory {
  private floor1Group = new Group();
  private floor2Group = new Group();
  private wallGroup = new Group();
  public fighterGroup = new Group();
  private floor2Tags: CSS3DObject[];
  private mouse = new Vector2();
  private raycaster = new Raycaster();
  fighterPointsGroup = new Group();
  constructor() {
    // 载入模型
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    dracoLoader.preload();
    loader.setDRACOLoader(dracoLoader);

    this.floor2Tags = [];
    const array = ['小型会议室', '核心科技室', '科技展台', '设计总监办公室'];
    loader.load('./models/floor2.glb', (gltf) => {
      this.floor2Group = gltf.scene;

      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          child.material.emissiveIntensity = 5;
        }

        if (array.indexOf(child.name) !== -1) {
          // console.log("小型会议室", child);
          const css3dObject = this.createTag(child);
          css3dObject.visible = true;
          this.floor2Tags.push(css3dObject);
          this.floor2Group.add(css3dObject);
        }
      });
      this.floor2Group.visible = false;

      factoryScene.add(this.floor2Group);
    });

    loader.load('./models/floor1.glb', (gltf) => {
      this.floor1Group = gltf.scene;

      // 判断子元素是否是物体
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          // console.log(child);
          child.material.emissiveIntensity = 5;
          // child.receiveShadow = true;
          // child.castShadow = true;
        }
      });
      this.floor1Group.visible = false;
      factoryScene.add(gltf.scene);
    });

    loader.load('./models/wall.glb', (gltf) => {
      this.wallGroup = gltf.scene;
      factoryScene.add(this.wallGroup);
      this.wallGroup.visible = false;
    });

    loader.load('./models/Fighter1.glb', (gltf) => {
      this.fighterGroup = gltf.scene;
      this.createPoints(this.fighterGroup);
      // this.fighterGroup.visible = true;
      factoryScene.add(this.fighterGroup);
      this.fighterGroup.position.set(3, 42, 68);
      this.fighterGroup.traverse((child: any) => {
        if (child.isMesh) {
          child.material.emissiveIntensity = 15;
          child.position2 = child.position.clone();
        }
      });

      // 事件监听
      window.addEventListener('click', (event) => {
        //   console.log(event);
        //   对时间对象进行加工
        // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);

        //通过摄像机和鼠标位置更新射线
        this.raycaster.setFromCamera(this.mouse, cameraModule.activeCamera);

        //进行检测
        const intersects = this.raycaster.intersectObject(this.fighterGroup);
        //   console.log(intersects);
        if (intersects.length > 0) {
          //   真正触发精灵的点击事件
          console.log(
            '点击了战斗机',
            this.floor2Group.visible,
            this.floor2Tags
          );
          this.pointsBlast();
          if (this.floor2Group.visible) {
            this.floor2Group.visible = false;
            this.floor2Tags.forEach((tag) => {
              tag.visible = false;
            });
          } else {
            this.floor2Group.visible = true;
            this.floor2Tags.forEach((tag) => {
              tag.visible = true;
            });
          }
        }
      });
      // this.showFighter();
    });

    this.initEvent();
  }

  private createTag(object3d: Object3D) {
    const element = document.createElement('div');
    element.className = 'elementTag';
    element.innerHTML = `
      <div class="elementContent">
        <h3>${object3d.name}</h3>
        <p>温度：26°</p>
        <p>湿度：50%</p>
      </div>
    `;

    const objectCSS3D = new CSS3DObject(element);
    objectCSS3D.scale.set(0.2, 0.2, 0.2);
    objectCSS3D.position.copy(object3d.position);
    // factoryScene.add(objectCSS3D);
    return objectCSS3D;
  }

  showFloor1() {
    this.floor1Group.visible = true;
  }
  showFloor2() {
    this.floor2Group.visible = true;
    this.fighterGroup.visible = true;
    this.floor2Tags.forEach((tag) => {
      tag.visible = true;
    });
  }

  hideFloor1() {
    this.floor1Group.visible = false;
  }
  hideFloor2() {
    this.floor2Group.visible = false;
    this.fighterGroup.visible = false;
    this.floor2Tags.forEach((tag) => {
      tag.visible = false;
    });
  }

  hideWall() {
    this.wallGroup.visible = false;
  }
  showWall() {
    this.wallGroup.visible = true;
  }
  initEvent() {
    eventHub.on('showFloor1', () => {
      this.showFloor1();
      this.hideWall();
      this.hideFloor2();
    });
    eventHub.on('showFloor2', () => {
      this.showFloor2();
      this.hideWall();
      this.hideFloor1();
    });
    eventHub.on('showWall', () => {
      this.showWall();
      this.hideFloor1();
      this.hideFloor2();
    });
    eventHub.on('showAll', () => {
      this.showFloor1();
      this.showFloor2();
      this.showWall();
      gsap.to(this.wallGroup.position, {
        y: 200,
        duration: 1,
      });
      gsap.to(this.floor2Group.position, {
        y: 50,
        duration: 1,
        delay: 1,
      });
    });

    eventHub.on('hideAll', () => {
      // this.hideWall();
      gsap.to(this.wallGroup.position, {
        y: 0,
        duration: 1,
        delay: 1,
        onComplete: () => {
          this.hideFloor1();
          this.hideFloor2();
        },
      });
      gsap.to(this.floor2Group.position, {
        y: 0,
        duration: 1,
      });
    });

    eventHub.on('flatFighter', () => {
      // 将飞机展成立方体
      // 获取立方体点的位置
      const positions: Vector3[] = [];
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          positions.push(new Vector3(i * 2 - 2, j * 2 - 2, 0));
        }
      }

      let n = 0;
      this.fighterGroup.traverse((child: any) => {
        if (child.isMesh) {
          // console.log(child);
          // child.position.copy(positions[n].multiplyScalar(20));
          positions[n].multiplyScalar(10);

          gsap.to(child.position, {
            x: '+=' + positions[n].x,
            y: '+=' + positions[n].y,
            z: '+=' + positions[n].z,
            duration: 1,
          });
          n++;
        }
      });
    });

    eventHub.on('recoverFighter', () => {
      this.fighterGroup.traverse((child: any) => {
        if (child.isMesh) {
          gsap.to(child.position, {
            x: child.position2.x,
            y: child.position2.y,
            z: child.position2.z,
            duration: 1,
          });
        }
      });
    });

    eventHub.on('pointsFighter', () => {
      this.createPoints(this.fighterGroup);
    });

    eventHub.on('pointsBlast', () => {
      this.pointsBlast();
    });

    eventHub.on('pointsBack', () => {
      this.pointsBack();
    });
  }

  createPoints(object3d: Object3D) {
    if (
      !this.fighterPointsGroup ||
      this.fighterPointsGroup.children.length === 0
    ) {
      this.fighterPointsGroup = this.transformPoints(object3d);
      factoryScene.add(this.fighterPointsGroup);
    }
  }

  transformPoints(object3d: Object3D) {
    // 创建纹理图像
    const texture = new TextureLoader().load('./assets/particles/1.png');
    const group = new Group();

    function createPoints(object3d: Object3D, newObject3d: Object3D) {
      if (object3d.children.length > 0) {
        object3d.children.forEach((child: any) => {
          if (child.isMesh) {
            // 随机生成颜色
            const color = new Color(
              Math.random(),
              Math.random(),
              Math.random()
            );
            // const material = new THREE.PointsMaterial({
            //   size: 0.1,
            //   color: color,
            //   map: texture,
            //   blending: THREE.AdditiveBlending,
            //   transparent: true,
            //   depthTest: false,
            // });

            const material = new ShaderMaterial({
              uniforms: {
                uColor: { value: color },
                uTexture: { value: texture },
                uTime: {
                  value: 0,
                },
              },
              vertexShader: vertex,
              fragmentShader: fragment,
              blending: AdditiveBlending,
              transparent: true,
              depthTest: false,
            });
            const points = new Points(child.geometry, material);
            points.position.copy(child.position);
            points.rotation.copy(child.rotation);
            points.scale.copy(child.scale);
            newObject3d.add(points);
            createPoints(child, points);
          }
        });
      }
    }

    createPoints(object3d, group);
    // object3d.traverse((child) => {
    //   if (child.isMesh) {
    //     const points = child.geometry.attributes.position.array;
    //     const geometry = new THREE.BufferGeometry();
    //     geometry.setAttribute(
    //       "position",
    //       new THREE.Float32BufferAttribute(points, 3)
    //     );

    //     // 随机生成颜色
    //     const color = new THREE.Color(
    //       Math.random(),
    //       Math.random(),
    //       Math.random()
    //     );
    //     const material = new THREE.PointsMaterial({
    //       size: 0.1,
    //       color: color,
    //     });
    //     const pointsMesh = new THREE.Points(geometry, material);
    //     pointsMesh.position.copy(child.position);
    //     pointsMesh.rotation.copy(child.rotation);
    //     pointsMesh.scale.copy(child.scale);
    //     group.add(pointsMesh);
    //   }
    // });

    return group;
  }

  pointsBlast() {
    this.fighterPointsGroup.traverse((child: any) => {
      if (child.isPoints) {
        const randomPositionArray = new Float32Array(
          child.geometry.attributes.position.count * 3
        );
        for (let i = 0; i < child.geometry.attributes.position.count; i++) {
          randomPositionArray[i * 3 + 0] = (Math.random() * 2 - 1) * 10;
          randomPositionArray[i * 3 + 1] = (Math.random() * 2 - 1) * 10;
          randomPositionArray[i * 3 + 2] = (Math.random() * 2 - 1) * 10;
        }

        child.geometry.setAttribute(
          'aPosition',
          new BufferAttribute(randomPositionArray, 3)
        );

        gsap.to(child.material.uniforms.uTime, {
          value: 10,
          duration: 10,
        });
      }
    });
  }

  pointsBack() {
    this.fighterPointsGroup.traverse((child: any) => {
      if (child.isPoints) {
        gsap.to(child.material.uniforms.uTime, {
          value: 0,
          duration: 10,
        });
      }
    });
  }
}
