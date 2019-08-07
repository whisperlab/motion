type State = {
    [key: string]: number | string
}

type ResolvedState = {
    [key: string]: number[] | number | string
}

const axisOrder = ["X", "Y", "Z"]
function handleDimensionArray(
    targetName: string,
    valueName: string,
    value: string | number,
    styles: ResolvedState
) {
    if (!styles[targetName]) {
        styles[targetName] = [0, 0, 0]
    }

    const axis = valueName[valueName.length - 1]
    const axisIndex = axisOrder.indexOf(axis)

    if (axisIndex === -1) {
        styles[targetName][0] = styles[targetName][1] = styles[
            targetName
        ][2] = value
    } else {
        styles[targetName][axisIndex] = value
    }
}

export function buildThreeStyles(
    state: State,
    styles: ResolvedState = {}
): void {
    for (const key in state) {
        // TODO These key checks could be replaced with a map
        if (key.startsWith("scale")) {
            handleDimensionArray("scale", key, state[key], styles)
        } else if (key.startsWith("rotate")) {
            handleDimensionArray("rotation", key, state[key], styles)
        } else if (key === "x" || key === "y" || key === "z") {
            handleDimensionArray(
                "position",
                key.toUpperCase(),
                state[key],
                styles
            )
        } else {
            styles[key] = state[key]
        }
    }
}

export function createThreeStyles() {
    const styles: State = {}

    return (state: State): ResolvedState => {
        buildThreeStyles(state, styles)
        return styles
    }
}
