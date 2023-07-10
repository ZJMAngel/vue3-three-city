import {
  Box3,
  BufferGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  Shader,
  Vector2,
} from 'three'
import gsap from 'gsap'

export default function modifyCityMaterial(
  mesh: Mesh<BufferGeometry, MeshBasicMaterial>
) {

  mesh.material.onBeforeCompile = (shader) => {
    console.log(shader.vertexShader, 999, shader.fragmentShader)
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `
        #include <dithering_fragment>
        //#end#
    `
    )
    // 高度差渐变
    addGradColor(mesh, shader)
    // 圆形扩散
    addSpread(shader)
    // 水平扩散(x,z)
    addLightLine(shader)
    // 垂直扩散(y)
    addToTopLine(shader)
  }
}

function addGradColor(
  mesh: Mesh<BufferGeometry, MeshBasicMaterial>,
  shader: Shader
) {
  mesh.geometry.computeBoundingBox()
  const { min, max } = mesh.geometry.boundingBox as Box3
  //   获取物体的高度差
  const uHeight = max.y - min.y
  shader.uniforms.uTopColor = {
    value: new Color('#aaaeff'),
  }
  shader.uniforms.uHeight = {
    value: uHeight,
  }

  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
      #include <common>
      varying vec3 vPosition;
      `
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
      #include <begin_vertex>
      vPosition = position;
      `
  )
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
      #include <common>

      uniform vec3 uTopColor;
      uniform float uHeight;
      varying vec3 vPosition;
      `
  )
  shader.fragmentShader = shader.fragmentShader.replace(
    '//#end#',
    `
      vec4 distGradColor = gl_FragColor;

      // 设置混合的百分比
      float gradMix = (vPosition.y+uHeight/2.0)/uHeight;
      // 计算出混合颜色
      vec3 gradMixColor = mix(distGradColor.xyz,uTopColor,gradMix);
      gl_FragColor = vec4(gradMixColor,1);

        //#end#
      `
  )
}
function addSpread(shader: Shader) {
  shader.uniforms.uSpreadCenter = {
    value: new Vector2(0, 0),
  }
  shader.uniforms.uSpreadTime = {
    value: 0,
  }
  shader.uniforms.uSpreadWidth = {
    value: 40,
  }

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
      #include <common>

      uniform vec2 uSpreadCenter;
      uniform float uSpreadTime;
      uniform float uSpreadWidth;
      `
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    '//#end#',
    `
    float spreadRadius= distance(vPosition.xz,uSpreadCenter);

    // 扩散范围的函数
    float spreadIndex = -(spreadRadius-uSpreadTime)*(spreadRadius-uSpreadTime)+uSpreadWidth;

    if(spreadIndex>0.0){
        gl_FragColor = mix(gl_FragColor,vec4(1,0.8,0.8,1),spreadIndex/uSpreadWidth);
    }
        //#end#
      `
  )
  gsap.to(shader.uniforms.uSpreadTime, {
    value: 800,
    duration: 3,
    ease: 'none',
    repeat: -1,
  })
}

function addLightLine(shader: Shader) {
  shader.uniforms.uLightLineTime = {
    value: -1500,
  }
  shader.uniforms.uLightLineWidth = {
    value: 200,
  }

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
      #include <common>

      uniform float uLightLineTime;
      uniform float uLightLineWidth;
      `
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    '//#end#',
    `
    // 扩散范围的函数
    // float lightLineIndex = -(vPosition.x-uLightLineTime)*(vPosition.x-uLightLineTime)+uLightLineWidth;
    float lightLineIndex = -(vPosition.x+vPosition.z-uLightLineTime)*(vPosition.x+vPosition.z-uLightLineTime)+uLightLineWidth;

    if(lightLineIndex>0.0){
        gl_FragColor = mix(gl_FragColor,vec4(1,1,1,1),lightLineIndex/uLightLineWidth);
    }
        //#end#
      `
  )
  gsap.to(shader.uniforms.uLightLineTime, {
    value: 1500,
    duration: 5,
    ease: 'none',
    repeat: -1,
  })
}
function addToTopLine(shader: Shader) {
  shader.uniforms.uToTopTime = {
    value: 0,
  }
  shader.uniforms.uToTopWidth = {
    value: 40,
  }

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
      #include <common>

      uniform float uToTopTime;
      uniform float uToTopWidth;
      `
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    '//#end#',
    `
    // 扩散范围的函数
    float toTopIndex = -(vPosition.y-uToTopTime)*(vPosition.y-uToTopTime)+uToTopWidth;

    if(toTopIndex>0.0){
        gl_FragColor = mix(gl_FragColor,vec4(0.8,0.8,1,1),toTopIndex/uToTopWidth);
    }
        //#end#
      `
  )
  gsap.to(shader.uniforms.uToTopTime, {
    value: 500,
    duration: 3,
    ease: 'none',
    repeat: -1,
  })
}
