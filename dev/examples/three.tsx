// Example taken from https://codesandbox.io/embed/9y8vkjykyy
import * as THREE from "three/src/Three"
import React, { useState, useRef, useEffect } from "react"
// A THREE.js React renderer, see: https://github.com/drcmda/react-three-fiber
import { Canvas, useRender } from "react-three-fiber"
import { motion } from "@framer/renderers/three"

function Octahedron() {
    const [active, setActive] = useState(false)
    const [hovered, setHover] = useState(false)
    const vertices = [[-1, 0, 0], [0, 1, 0], [1, 0, 0], [0, -1, 0], [-1, 0, 0]]

    // const { color, pos, ...props } = useSpring({
    //     color: active ? "hotpink" : "white",
    //     pos: active ? [0, 0, 2] : [0, 0, 0],
    //     "material-opacity": hovered ? 0.6 : 0.25,
    //     scale: active ? [1.5, 1.5, 1.5] : [1, 1, 1],
    //     rotation: active
    //         ? [THREE.Math.degToRad(180), 0, THREE.Math.degToRad(45)]
    //         : [0, 0, 0],
    //     config: { mass: 10, tension: 1000, friction: 300, precision: 0.00001 },
    // })
    return (
        <group>
            <motion.line animate={{ scale: 3 }}>
                <geometry
                    attach="geometry"
                    vertices={vertices.map(v => new THREE.Vector3(...v))}
                />
                <lineBasicMaterial attach="material" />
            </motion.line>
            <motion.mesh
                onClick={e => setActive(!active)}
                onPointerOver={e => setHover(true)}
                onPointerOut={e => setHover(false)}
                animate={{ x: 1, rotate: 180, "material-opacity": 0.5 }}
                transition={{ delay: 0.3, duration: 2 }}
            >
                <octahedronGeometry attach="geometry" />
                <meshStandardMaterial
                    attach="material"
                    color="grey"
                    transparent
                />
            </motion.mesh>
        </group>
    )
}

export const App = () => (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
        <Canvas>
            <ambientLight color="lightblue" />
            <pointLight color="white" intensity={1} position={[10, 10, 10]} />
            <Octahedron />
        </Canvas>
        <style>{`* {
  box-sizing: border-box;
}

html,
body,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  overflow: hidden;
  background: #272727;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto,
    segoe ui, arial, sans-serif;
}`}</style>
    </div>
)
