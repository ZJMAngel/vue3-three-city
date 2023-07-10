import { Color, MeshBasicMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import modifyCityMaterial from '../modify/modify-city-material';
import cityScene from '../city-scene';
import AlarmSprite from './alarm-sprite';
import FlyLine from './fly-line';
import FlyLineShader from './fly-line-shader';
import LaserRader from './laser-radar';
import LightWall from './light-wall';
import MeshLine from './mesh-line';

export default function city() {
  const gltfLoader = new GLTFLoader();

  gltfLoader.load('./model/model/city.glb', (gltf) => {
    gltf.scene.traverse((item: any) => {
      console.log(item);

      if (item.type === 'Mesh') {
        const cityMaterial = new MeshBasicMaterial({
          color: new Color(0x0c0e6f),
        });
        item.material = cityMaterial;
        modifyCityMaterial(item);
        if (item.name === 'Layerbuildings') {
          const meshLine = new MeshLine(item.geometry);
          // 匹配缩放
          const { x, y, z } = item.scale as Vector3;
          meshLine.line.scale.set(x, y, z);
          cityScene.add(meshLine.line);
        }
      }
    });
    cityScene.add(gltf.scene);

    // // 添加飞线
    // const flyLine = new FlyLine()
    // scene.add(flyLine.mesh)

    // // 着色器飞线
    // const flyLineShader = new FlyLineShader()
    // scene.add(flyLineShader.points)

    // // 添加光墙
    // const lightWall = new LightWall()
    // scene.add(lightWall.mesh)

    // // 添加雷达
    // const laserRader = new LaserRader()
    // scene.add(laserRader.mesh)

    // // 添加警告标识
    // const alarmSprite = new AlarmSprite()
    // scene.add(alarmSprite.sprite)
    // alarmSprite.onClick(function (e) {
    //   console.log('警告', e)
    // })
  });
}
