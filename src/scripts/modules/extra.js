export const randomize = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const toRgba = ((color, alpha = null) => {
    const element = document.createElement("canvas").getContext("2d")
    element.fillStyle = color
    const rgb = element.fillStyle
    const r = parseInt(rgb.slice(1, 3), 16)
    const g = parseInt(rgb.slice(3, 5), 16)
    const b = parseInt(rgb.slice(5, 7), 16)
    
    let rgbColor
    alpha ? rgbColor = `rgba(${[r, g, b, alpha]})` : rgbColor = `rgba(${[r, g, b]})`
    return rgbColor
})

export const checkPar = (num) => {
    return num % 2 === 0
}