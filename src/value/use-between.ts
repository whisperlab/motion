import { useCallback } from "react"
import { MotionValue } from "./"
import { isMotionValue } from "./utils/is-motion-value"
import { useOnChange } from "../value/use-on-change"
import { useMotionValue } from "../value/use-motion-value"
import { transform } from "../utils/transform"

type Cruncher<T> = (a: T | any, b: T | any) => number

export function useBetween<T>(
    valueA: MotionValue<T> | number | string,
    valueB: MotionValue<T> | number | string,
    normal: number | Cruncher<T>
) {
    const calc = useCallback(
        () => {
            let a, b, c

            a = isMotionValue(valueA) ? valueA.get() : valueA
            b = isMotionValue(valueB) ? valueB.get() : valueB
            c = typeof normal == "number" ? normal : normal(a, b)

            return transform(c, [0, 1], [a, b])
        },
        [normal]
    )

    const value = useMotionValue(calc())

    useOnChange(valueA, () => value.set(calc()))
    useOnChange(valueB, () => value.set(calc()))

    return value
}
