import * as React from "react"
import { motion, useBetween, useMotionValue } from "../../src"

const size = 128

const Ball = props => {
    const { children, x, y, drag, color, ...rest } = props
    return (
        <motion.div
            style={{
                display: "flex",
                placeContent: "center",
                placeItems: "center",
                height: size,
                width: size,
                borderRadius: 8,
                backgroundColor: color,
                position: "absolute",
                fontFamily: "sans-serif",
            }}
            drag={drag}
            x={x}
            y={y}
        >
            {children}
        </motion.div>
    )
}

export const App = () => {
    const dragXa = useMotionValue(40)
    const dragYa = useMotionValue(40)

    const dragXb = useMotionValue(550)
    const dragYb = useMotionValue(550)

    const xc = useBetween(dragXa, dragXb, 0.5)
    const yc = useBetween(dragYa, dragYb, 0.5)

    const xd = useBetween(dragXa, dragXb, (a, b) => (b / a / a) * 2)
    const yd = useBetween(dragYa, dragYb, (a, b) => (b / a / a) * 2)

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
            }}
        >
            <Ball color="#ff0000" drag x={dragXa} y={dragYa}>
                A
            </Ball>
            <Ball color="#ff0000" drag x={dragXb} y={dragYb}>
                B
            </Ball>
            <Ball color="#fff" x={xc} y={yc}>
                C
            </Ball>
            <Ball color="#777" x={xd} y={yd}>
                D
            </Ball>
        </div>
    )
}
