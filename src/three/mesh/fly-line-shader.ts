import vertex from '../shader/fly-line/vertex.glsl'
import fragment from '../shader/fly-line/fragment.glsl'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  Points,
  ShaderMaterial,
  Vector3,
} from 'three'
import gsap from 'gsap'

export default class FlyLineShader {
  public mesh: Points<BufferGeometry, ShaderMaterial>
  eventListIndex = 0
  constructor(position = { x: 0, z: 0 }, color = 0x00ffff) {
    const linePoints = [
      new Vector3(0, 0, 0),
      new Vector3(position.x / 2, 4, position.z / 2),
      new Vector3(position.x, 0, position.z),
    ]
    const curve = new CatmullRomCurve3(linePoints)
    const points = curve.getPoints(1000)
    const geometry = new BufferGeometry().setFromPoints(points)

    // 给每一个顶点设置属性(设置不同粗细)
    const aSizeArray = new Float32Array(points.length)
    for (let i = 0, length = aSizeArray.length; i < length; i++) {
      aSizeArray[i] = i
    }

    // 设置几何体顶点属性
    geometry.setAttribute('aSize', new BufferAttribute(aSizeArray, 1))

    const material = new ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0,
        },
        uColor: {
          value: new Color(color),
        },
        uLength: {
          value: points.length,
        },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })

    this.mesh = new Points(geometry, material)
    gsap.to(material.uniforms.uTime, {
      value: 1000,
      duration: 1,
      repeat: -1,
      ease: 'none',
    })
  }
  remove() {
    this.mesh.remove()
    this.mesh.removeFromParent()
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
  }
}
