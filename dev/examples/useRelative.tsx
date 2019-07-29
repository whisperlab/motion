import * as React from "react"
import { motion, useRelative, useMotionValue, useTransform } from "../../src"

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

function Line(props) {
    return (
        <motion.line
            {...props}
            stroke={"#fff"}
            strokeWidth={2}
            transform={`translate(${size / 2}, ${size / 2})`}
        />
    )
}

export const App = () => {
    const dragXa = useMotionValue(400)
    const dragYa = useMotionValue(40)

    const dragXb = useMotionValue(40)
    const dragYb = useMotionValue(250)

    const dragXc = useMotionValue(560)
    const dragYc = useMotionValue(450)

    const x = useRelative((a, b, c) => (a + b + c) / 3, dragXa, dragXb, dragXc)
    const y = useRelative((a, b, c) => (a + b + c) / 3, dragYa, dragYb, dragYc)

    return (
        <div
            style={{
                width: 720,
                height: 720,
            }}
        >
            <motion.svg
                viewBox="0 0 720 720"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                }}
            >
                <Line x1={dragXa} x2={x} y1={dragYa} y2={y} />
                <Line x1={dragXb} x2={x} y1={dragYb} y2={y} />
                <Line x1={dragXc} x2={x} y1={dragYc} y2={y} />
            </motion.svg>
            <Ball color="#ff0000" drag x={dragXa} y={dragYa}>
                A
            </Ball>
            <Ball color="#ff0000" drag x={dragXb} y={dragYb}>
                B
            </Ball>
            <Ball color="#ff0000" drag x={dragXc} y={dragYc}>
                C
            </Ball>
            <Ball color="#ffffff" x={x} y={y}>
                D
            </Ball>
        </div>
    )
}
