import { Color, DoubleSide, Mesh, PlaneGeometry, ShaderMaterial } from 'three'
import gsap from 'gsap'
import vertex from '../shader/laser-radar/vertex.glsl'
import fragment from '../shader/laser-radar/fragment.glsl'

export default class LaserRadar {
  mesh: Mesh<PlaneGeometry, ShaderMaterial>
  eventListIndex = 0
  constructor(radius = 2, position = { x: 0, z: 0 }, color = 0xff0000) {
    const geometry = new PlaneGeometry(radius, radius)

    const material = new ShaderMaterial({
      uniforms: {
        uColor: {
          value: new Color(color),
        },
        uTime: {
          value: 0,
        },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      side: DoubleSide,
    })
    this.mesh = new Mesh(geometry, material)
    this.mesh.position.set(position.x, 1, position.z)
    this.mesh.rotation.x = -Math.PI / 2

    gsap.to(material.uniforms.uTime, {
      value: 1,
      duration: 1,
      repeat: -1,
      ease: 'none',
    })
  }
  public remove() {
    this.mesh.remove()
    this.mesh.removeFromParent()
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
  }
}
