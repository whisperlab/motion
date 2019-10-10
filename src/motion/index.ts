import { createMotionComponent } from "./component"
import { createDomMotionConfig } from "./functionality/dom"
import * as React from "react"
import {
    ReactHTML,
    DetailedHTMLFactory,
    HTMLAttributes,
    PropsWithoutRef,
    RefAttributes,
    SVGAttributes,
    ForwardRefExoticComponent,
} from "react"
import { HTMLElements } from "./utils/supported-elements"
import { SVGElements } from "./utils/supported-elements"
import { MotionProps, MakeMotion } from "./types"
import { Omit } from "../types"

export { MotionContext } from "./context/MotionContext"
export { MotionValuesMap } from "./utils/use-motion-values"
export { useExternalRef } from "./utils/use-external-ref"
export { ValueAnimationControls } from "../animation/ValueAnimationControls"
export { createMotionComponent }

type CustomMotionComponent = {
    custom: <Props>(
        custom: React.ComponentType<Props> | string
    ) => React.ForwardRefExoticComponent<
        Props & MotionProps & React.RefAttributes<Element>
    >
}

interface CustomElementComponent {
    [key: string]: React.ForwardRefExoticComponent<
        MotionProps & React.RefAttributes<Element>
    >
}

type Motion = HTMLMotionComponents &
    SVGMotionComponents &
    CustomMotionComponent &
    CustomElementComponent

const componentCache = new Map<string, any>()

function createCustomComponent<P>(Component: string | React.ComponentType<P>) {
    return createMotionComponent(createDomMotionConfig(Component))
}

/**
 * HTML & SVG components, optimised for use with gestures and animation. These can be used as
 * drop-in replacements for any HTML & SVG component, all CSS & SVG properties are supported.
 *
 * @internalremarks
 *
 * I'd like to make it possible for these to be loaded "on demand" - to reduce bundle size by only
 * including HTML/SVG stylers, animation and/or gesture support when necessary.
 *
 * ```jsx
 * <motion.div animate={{ x: 100 }} />
 *
 * <motion.p animate={{ height: 200 }} />
 *
 * <svg><motion.circle r={10} animate={{ r: 20 }} /></svg>
 * ```
 *
 * @public
 */
export const motion = new Proxy(
    {},
    {
        get: (_target, key: string) => {
            if (key === "custom") {
                return createCustomComponent
            } else if (componentCache.has(key)) {
                return componentCache.get(key)
            } else {
                const componentFactory = createCustomComponent(key)
                componentCache.set(key, componentFactory)
                return componentFactory
            }
        },
    }
) as Motion

type UnwrapFactoryAttributes<F> = F extends DetailedHTMLFactory<infer P, any>
    ? P
    : never
type UnwrapFactoryElement<F> = F extends DetailedHTMLFactory<any, infer P>
    ? P
    : never
type UnwrapSVGFactoryElement<F> = F extends React.SVGProps<infer P> ? P : never

type HTMLAttributesWithoutMotionProps<
    Attributes extends HTMLAttributes<Element>,
    Element extends HTMLElement
> = { [K in Exclude<keyof Attributes, keyof MotionProps>]?: Attributes[K] }

/**
 * @public
 */
export type HTMLMotionProps<
    TagName extends keyof ReactHTML
> = HTMLAttributesWithoutMotionProps<
    UnwrapFactoryAttributes<ReactHTML[TagName]>,
    UnwrapFactoryElement<ReactHTML[TagName]>
> &
    MotionProps

/**
 * Motion-optimised versions of React's HTML components.
 *
 * @public
 */
export type HTMLMotionComponents = {
    [K in HTMLElements]: ForwardRefComponent<
        UnwrapFactoryElement<ReactHTML[K]>,
        HTMLMotionProps<K>
    >
}

interface SVGAttributesWithoutMotionProps<T>
    extends Pick<
        SVGAttributes<T>,
        Exclude<keyof SVGAttributes<T>, keyof MotionProps>
    > {}

/**
 * Blanket-accept any SVG attribute as a `MotionValue`
 * @public
 */
export type SVGAttributesAsMotionValues<T> = MakeMotion<
    SVGAttributesWithoutMotionProps<T>
>

/**
 * @public
 */
export interface SVGMotionProps<T>
    extends SVGAttributesAsMotionValues<T>,
        Omit<MotionProps, "positionTransition"> {}

type ForwardRefComponent<T, P> = ForwardRefExoticComponent<
    PropsWithoutRef<P> & RefAttributes<T>
>

/**
 * Motion-optimised versions of React's SVG components.
 *
 * @public
 */
export type SVGMotionComponents = {
    [K in SVGElements]: ForwardRefComponent<
        UnwrapSVGFactoryElement<JSX.IntrinsicElements[K]>,
        SVGMotionProps<UnwrapSVGFactoryElement<JSX.IntrinsicElements[K]>>
    >
}
