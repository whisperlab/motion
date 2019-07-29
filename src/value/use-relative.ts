import { useCallback, useEffect, useMemo } from "react"
import { MotionValue } from "./"
import { isMotionValue } from "./utils/is-motion-value"
import { useMotionValue } from "../value/use-motion-value"

const toValue: <T>(v: MotionValue<T> | T) => T = v =>
    isMotionValue(v) ? v.get() : v

export function useRelative<T>(
    callback: (...values: T[]) => T,
    ...values: (MotionValue<T> | T)[]
) {
    // Compute the motion values's value by running
    // current values of its related values through
    // the callback function
    const getComputedValue = useCallback(
        () => callback(...values.map(toValue)),
        [callback, values]
    )

    // Create new motion value
    const value = useMotionValue(getComputedValue())

    // Calllback to update the motion value
    const compute = useCallback(() => value.set(getComputedValue()), [])

    // Partition the values into motion values / non motion values
    const [mvs, nmvs]: [MotionValue<T>[], T[]] = useMemo(
        () =>
            values.reduce(
                (acc, val) => {
                    acc[isMotionValue(val) ? 0 : 1].push(val)
                    return acc
                },
                [[] as any[], [] as any[]]
            ),
        [values]
    )

    // When motion values values c
    // Change, update listeners
    useEffect(
        () => {
            const rs = mvs.map(v => v.onChange(compute))
            return () => rs.forEach(remove => remove())
        },
        [mvs]
    )

    // When non-motion values
    //  change, update
    useEffect(compute, [nmvs])

    return value
}
