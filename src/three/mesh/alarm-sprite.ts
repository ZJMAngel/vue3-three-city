import {
  TextureLoader,
  SpriteMaterial,
  Sprite,
  Raycaster,
  Vector2,
} from 'three'
import camera from '../camera'

// type fn = () => void
interface IFn {
  (e: MouseEvent): void
}

export default class AlarmSprite {
  public mesh: Sprite
  public fns: IFn[]
  public eventListIndex = 0
  constructor(type = '火警', position = { x: -1.8, z: 3 }, color = 0xffffff) {
    const textureLoader = new TextureLoader()
    const typeObj: Record<string, string> = {
      火警: './textures/tag/fire.png',
      治安: './textures/tag/jingcha.png',
      电力: './textures/tag/e.png',
    }

    const map = textureLoader.load(typeObj[type])
    const material = new SpriteMaterial({
      map: map,
      color: color,
      // blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false,
    })

    this.mesh = new Sprite(material)

    // 设置位置
    this.mesh.position.set(position.x, 3.5, position.z)

    // 创建射线
    const raycaster = new Raycaster()
    const mouse = new Vector2()

    // 封装点击事件
    this.fns = []

    // 事件的监听
    window.addEventListener('click', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)

      raycaster.setFromCamera(mouse, camera.activeCamera)

      const intersects = raycaster.intersectObject(this.mesh)
      if (intersects.length > 0) {
        this.fns.forEach((fn) => {
          fn(event)
        })
      }
    })
  }
  public onClick(fn: IFn) {
    this.fns.push(fn)
  }

  public remove() {
    this.mesh.remove()
    this.mesh.removeFromParent()
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
  }
}
