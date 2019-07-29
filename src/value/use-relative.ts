import { useCallback, useEffect } from "react"
import { MotionValue } from "./"
import { isMotionValue } from "./utils/is-motion-value"
import { useOnChange } from "../value/use-on-change"
import { useMotionValue } from "../value/use-motion-value"
import { transform } from "../utils/transform"

type Value<T> = MotionValue<T> | number | string

const toValue: <T>(v: T) => T = v => (isMotionValue(v) ? v.get() : v)

export function useRelative<T>(
    callback: (...values: Value<T>[]) => number,
    ...values: (Value<T>)[]
) {
    const calc = useCallback(
        () => {
            const vs = values.map(toValue)
            return callback(...vs)
        },
        [callback, values]
    )

    const value = useMotionValue(calc())

    useEffect(() => {
        let cancels: any[] = []

        values.forEach(v => {
            if (isMotionValue(v)) {
                cancels.push(v.onChange(() => value.set(calc())))
            }
        })
        return () => {
            cancels.forEach(c => c())
        }
    }, [])

    return value
}
