import {
  Box3,
  Color,
  CylinderGeometry,
  DoubleSide,
  Mesh,
  ShaderMaterial,
} from 'three'
import gsap from 'gsap'
import vertex from '../shader/light-wall/vertex.glsl'
import fragment from '../shader/light-wall/fragment.glsl'

export default class LightWall {
  mesh: Mesh<CylinderGeometry, ShaderMaterial>
  eventListIndex = 0
  constructor(radius = 5, length = 2, position = { x: 0, z: 0 }) {
    const geometry = new CylinderGeometry(radius, radius, 2, 32, 1, true)

    const material = new ShaderMaterial({
      uniforms: {
        uTopColor: {
          value: new Color('#aaaeff'),
        },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      side: DoubleSide,
    })
    this.mesh = new Mesh(geometry, material)
    this.mesh.position.set(position.x, 1, position.z)

    geometry.computeBoundingBox()
    const { min, max } = geometry.boundingBox as Box3
    //   获取物体的高度差
    const uHeight = max.y - min.y
    material.uniforms.uHeight = {
      value: uHeight,
    }

    // 动画
    gsap.to(this.mesh.scale, {
      x: length,
      z: length,
      duration: 1,
      repeat: -1,
      yoyo: true,
    })
  }
  remove() {
    this.mesh.remove()
    this.mesh.removeFromParent()
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
  }
}
