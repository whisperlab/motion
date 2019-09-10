import { useCallback, useEffect } from "react"
import { MotionValue } from "./"
import { isMotionValue } from "./utils/is-motion-value"
import { useMotionValue } from "../value/use-motion-value"

const toValue: <T>(v: MotionValue<T> | T) => T = v =>
    isMotionValue(v) ? v.get() : v

/**
 * UseRelative
 * @description Declare a motion value with a value dependent on multiple other values.
 * @param values An array of motion values or values.
 * @param callback A function that receives the current values and returns a computed value.
 * @example
 * ```jsx
 * const knobHeight = useRelative(
 *  [scrollHeight, contentHeight, maskHeight],
 *  (scrollHeight, contentHeight, maskHeight) => {
 *    return maskHeight * (scrollHeight / contentHeight)
 *  }
 *)
 *```
 */
export function useRelative<T>(
    values: (MotionValue<T> | T)[],
    callback: (...values: T[]) => T
) {
    // Compute the motion values's value by running
    // current values of its related values through
    // the callback function
    const getComputedValue = useCallback(
        currentValues => callback(...currentValues.map(toValue)),
        [callback, values]
    )

    // Create new motion value and initialize with computed values
    const computedValue = useMotionValue(getComputedValue(values))

    // When values change, compute and update change listeners
    useEffect(
        () => {
            const computeValue = () =>
                computedValue.set(getComputedValue(values))

            // Compute motion value based on new values
            computeValue()

            // Add change events to each motion value, to compute the value
            // when that motion value changes
            const removers = values
                .map(v => isMotionValue(v) && v.onChange(computeValue))
                .filter(v => v) as (() => void)[]

            // Return removes for change events
            return () => removers.forEach(fn => fn())
        },
        [values]
    )

    return computedValue
}
