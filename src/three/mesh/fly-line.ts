import {
  CatmullRomCurve3,
  Mesh,
  MeshBasicMaterial,
  MirroredRepeatWrapping,
  RepeatWrapping,
  TextureLoader,
  TubeGeometry,
  Vector3,
} from 'three'
import gsap from 'gsap'

export default class FlyLine {
  public mesh: Mesh<TubeGeometry, MeshBasicMaterial>
  constructor() {
    const linePoints = [
      new Vector3(0, 0, 0),
      new Vector3(5, 4, 0),
      new Vector3(10, 0, 0),
    ]
    const curve = new CatmullRomCurve3(linePoints)
    const geometry = new TubeGeometry(curve, 64, 0.4, 2)
    const textureLoader = new TextureLoader()
    const texture = textureLoader.load('./textures/z_11.png')
    texture.wrapS = RepeatWrapping
    texture.wrapT = MirroredRepeatWrapping
    texture.repeat.set(1, 2)
    const material = new MeshBasicMaterial({
      map: texture,
      transparent: true,
    })
    this.mesh = new Mesh(geometry, material)

    gsap.to(texture.offset, {
      x: -1,
      duration: 1,
      repeat: -1,
      ease: 'none',
    })
  }
}
