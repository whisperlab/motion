import * as THREE from "three"
import { createMotionComponent } from "../../motion"
import { createThreeMotionConfig } from "./create-three-config"

export const motion = Object.keys(THREE).reduce((components, key) => {
    const lowercaseKey = key[0].toLowerCase() + key.substring(1)
    components[lowercaseKey] = createMotionComponent(
        createThreeMotionConfig(lowercaseKey)
    )
    return components
}, {})
