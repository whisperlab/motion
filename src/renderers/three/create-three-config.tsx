import * as React from "react"
import { MotionComponentConfig } from "../../motion/component"
import { createElement, useEffect } from "react"
import { createStylerFactory } from "stylefire"
import { getAnimationComponent } from "../../motion/functionality/animation"
import { createThreeStyles } from "./create-three-styles"
import { applyProps } from "react-three-fiber"

const threeStyler = createStylerFactory({
    onRead: () => null,
    onRender: (state, { entity, parseState }) => {
        console.log(parseState(state))
        applyProps(entity, parseState(state))
    },
})

export function createThreeMotionConfig(
    Component: string
): MotionComponentConfig {
    return {
        renderComponent: (ref, style, values, props) => {
            useEffect(() => {
                const componentStyler = threeStyler({
                    entity: ref.current,
                    parseState: createThreeStyles(),
                })

                values.mount((key, value) => componentStyler.set(key, value))

                return () => values.unmount()
            }, [])

            return createElement<any>(Component, {
                ...props,
                ref,
                // TODO: Strip animate, initial etc from props
                // ...staticVisualStyles, TODO: Replace this with react-three-fiber specifc implementation
            })
        },
        loadFunctionalityComponents: (
            ref,
            values,
            props,
            controls,
            inherit
        ) => {
            const components: JSX.Element[] = []

            // TODO: Consolidate Animation functionality loading strategy with other functionality components
            const Animation = getAnimationComponent(props)

            if (Animation) {
                components.push(
                    <Animation
                        key="animation"
                        initial={props.initial}
                        animate={props.animate}
                        variants={props.variants}
                        transition={props.transition}
                        controls={controls}
                        inherit={inherit}
                        values={values}
                    />
                )
            }

            return components
        },
        getValueControlsConfig: (_ref, values) => {
            return {
                values,
                readValueFromSource: () => 0,
            }
        },
    }
}
