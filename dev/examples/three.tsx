// Example taken from https://codesandbox.io/embed/9y8vkjykyy
import * as THREE from "three/src/Three"
import React, { useState, useRef, useEffect, useMemo } from "react"
// A THREE.js React renderer, see: https://github.com/drcmda/react-three-fiber
import { Canvas, useRender } from "react-three-fiber"
import { useAnimation } from "@framer"
import { motion } from "@framer/renderers/three"

const spring = { type: "spring", mass: 10, stiffness: 1000, damping: 300 }

function Octahedron() {
    const [active, setActive] = useState(false)
    const [hovered, setHover] = useState(false)
    const vertices = [[-1, 0, 0], [0, 1, 0], [1, 0, 0], [0, -1, 0], [-1, 0, 0]]

    return (
        <group>
            <motion.line animate={{ z: active ? 2 : 0 }} transition={spring}>
                <geometry
                    attach="geometry"
                    vertices={vertices.map(v => new THREE.Vector3(...v))}
                />
                <motion.lineBasicMaterial
                    attach="material"
                    initial={false}
                    animate={{ color: active ? "#FF69B4" : "#fff" }}
                    transition={spring}
                />
            </motion.line>
            <motion.mesh
                onClick={e => setActive(!active)}
                onPointerOver={e => setHover(true)}
                onPointerOut={e => setHover(false)}
                animate={{
                    scale: active ? 1.5 : 1,
                    rotateX: active ? THREE.Math.degToRad(180) : 0,
                    rotateZ: active ? THREE.Math.degToRad(45) : 0,
                    "material-opacity": hovered ? 0.6 : 0.25,
                }}
                transition={spring}
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

function Stars() {
    const controls = useAnimation()
    let theta = 0
    useRender(() => {
        controls.set({
            rotate: 5 * Math.sin(THREE.Math.degToRad((theta += 0.1))),
            scale: Math.cos(THREE.Math.degToRad(theta * 2)),
        })
    })
    const [geo, mat, vertices, coords] = useMemo(() => {
        const geo = new THREE.SphereBufferGeometry(1, 10, 10)
        const mat = new THREE.MeshBasicMaterial({
            color: new THREE.Color("lightblue"),
        })
        const coords = new Array(2000)
            .fill(0)
            .map(i => [
                Math.random() * 800 - 400,
                Math.random() * 800 - 400,
                Math.random() * 800 - 400,
            ])
        return [geo, mat, vertices, coords]
    }, [])

    return (
        <motion.group animate={controls}>
            {coords.map(([p1, p2, p3], i) => (
                <mesh
                    key={i}
                    geometry={geo}
                    material={mat}
                    position={[p1, p2, p3]}
                />
            ))}
        </motion.group>
    )
}

export const App = () => (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
        <Canvas>
            <ambientLight color="lightblue" />
            <pointLight color="white" intensity={1} position={[10, 10, 10]} />
            <Octahedron />
            <Stars />
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
