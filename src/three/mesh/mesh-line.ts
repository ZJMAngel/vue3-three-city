import {
  BufferGeometry,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
} from 'three'

// 边缘轮廓
export default class MeshLine {
  line: LineSegments<EdgesGeometry<BufferGeometry>, LineBasicMaterial>

  constructor(geometry: BufferGeometry) {
    const edges = new EdgesGeometry(geometry)
    const material = new LineBasicMaterial({ color: 0xffffff })
    this.line = new LineSegments(edges, material)
  }
}
