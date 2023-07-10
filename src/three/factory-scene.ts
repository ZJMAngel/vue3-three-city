import {
  DirectionalLight,
  EquirectangularReflectionMapping,
  Scene,
} from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

const factoryScene = new Scene()

// 导入hdr纹理
const hdrLoader = new RGBELoader()
hdrLoader.loadAsync('/textures/2k.hdr').then((texture) => {
  factoryScene.background = texture
  factoryScene.environment = texture
  factoryScene.environment.mapping = EquirectangularReflectionMapping
})

// 添加平行光
const light = new DirectionalLight(0xffffff, 1)
light.position.set(10, 100, 10)
factoryScene.add(light)

export default factoryScene
