import { useCallback, useEffect } from "react"
import { MotionValue } from "./"
import { isMotionValue } from "./utils/is-motion-value"
import { useMotionValue } from "../value/use-motion-value"

const toValue: <T>(v: MotionValue<T> | T) => T = v =>
    isMotionValue(v) ? v.get() : v

export function useRelative<T>(
    callback: (...values: T[]) => T,
    ...values: (MotionValue<T> | T)[]
) {
    const calc = useCallback(
        () => {
            const vs = values.map(toValue)
            return callback(...vs)
        },
        [callback, values]
    )

    // Create new motion value
    const value = useMotionValue(calc())

    // Update the
    const update = useCallback(() => value.set(calc()), [])

    // When motion values values change,
    // remove / add update change listeners
    useEffect(
        () => {
            const rs = values.map((v: MotionValue<T>) => v.onChange(update))
            return () => rs.forEach(remove => remove())
        },
        [values.filter(v => isMotionValue(v))]
    )

    // When non-motion values values change, update
    useEffect(() => update, [values.filter(v => !isMotionValue(v))])

    return value
}
