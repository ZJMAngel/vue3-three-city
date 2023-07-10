import {
  DirectionalLight,
  EquirectangularReflectionMapping,
  Scene,
} from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

const parkScene = new Scene()

// 导入hdr纹理
const hdrLoader = new RGBELoader()
hdrLoader.loadAsync('/textures/023.hdr').then((texture) => {
  parkScene.background = texture
  parkScene.environment = texture
  parkScene.environment.mapping = EquirectangularReflectionMapping
})

// 添加平行光
const light = new DirectionalLight(0xffffff, 1)
light.position.set(10, 100, 10)
parkScene.add(light)

export default parkScene
