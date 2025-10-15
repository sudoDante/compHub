import * as element from "./modules/elements.js"
import { components } from "../config/components.js"

export const loadMenu = async (container) => {
    document.addEventListener("listMenu_primary", async (e) => {
        const pos = Number(e.detail.pos)
        const delay = Number(`${parseFloat(e.detail.time) + 60}`)
        console.log(pos, delay)
    })
    const backColor = getComputedStyle(document.documentElement).getPropertyValue("--backColor")
    const barsTransition = getComputedStyle(document.documentElement).getPropertyValue("--barsTransition")
    element.add(container, "list-menu", "listMenu", "listMenu", {
        "list": components,
        title: "Components by type",
        back: backColor,
        close: true,
        button: "fall",
        hostTransition: barsTransition
    })
}

export const loadControls = async (container) => {
    const controlsBox = element.add(container, "div", "controlBox", "controlBox absolute anta")

    const colorBox = element.add(controlsBox, "div", null, "colorBox controls relative")
    const colorIcon = element.add(colorBox, "span", null, "colorIcon material-symbols-outlined")
    colorIcon.textContent = "colors"
    const text = element.add(colorBox, "span", null, "text font")
    text.textContent = "Color"
    const checkbox = element.add(colorBox, "input", "colorInput", "hiddenInput", { type: "checkbox" })

    const backBox = element.add(controlsBox, "div", null, "backBox controls flex")
    for (let i = 1; i <= 5; i++) {
        const numberBox = element.add(backBox, "span", null, "numberBox relative center font")
        numberBox.textContent = i
        const input = element.add(numberBox, "input", null, "hiddenInput", { type: "radio", name: "backImage" })
        i === 1 ? input.checked = true : null
    }
    const restart = element.add(backBox, "span", "restartBackImage", "numberBox restartBackImage relative center material-symbols-outlined")
    restart.textContent = "settings_backup_restore"

    const viewsBox = element.add(controlsBox, "div", null, "viewsBox controls flex")
    const icons = ["computer", "view_compact_alt", "mobile_3", "crop_free"]
    const ids = ["computer", "tablet", "mobile", "fullscreen"]
    for (let i = 0; i <= 4; i++) {
        const view = element.add(viewsBox, "div", null, "view relative center")
        const iconView = element.add(view, "span", null, "iconView material-symbols-outlined")
        iconView.textContent = icons[i]
        const input = element.add(view, "input", null, "hiddenInput", { type: i < 3 ? "radio" : "checkbox", name: "views" })
        input.setAttribute("id", ids[i])
        i === 0 ? input.checked = true : null
    }
}

export const loadInfoArea = async (container) => {
    const info = element.add(container, "div", "info", "info absolute anta")
    const infoTitlesBox = element.add(info, "div", "infoTitlesBox", "infoTitlesBox")
    element.add(infoTitlesBox, "span", "infoName", "name")
    element.add(infoTitlesBox, "span", "infoFamily", "family")
    const testModeBox = element.add(info, "div", "testModeBox", "testModeBox")
}

export const loadPanelConfig = async (container) => {
    const backColor = getComputedStyle(document.documentElement).getPropertyValue("--backColor")
    const transition = getComputedStyle(document.documentElement).getPropertyValue("--barsTransition")
    const buttonSize = getComputedStyle(document.documentElement).getPropertyValue("--barHeight")

    await import("./components/appSpecific/configMenu.js")
    const configMenu = await element.add(container, "config-menu", "configMenu", null, {
        "back": backColor,
        "buttonSize": buttonSize,
        "transition": transition,
        "fontFamily": "Baumans",
        "fontColor": "rgba(160, 160, 160, 1)",
        "fontSize": "16px"
    })
    return configMenu
}

export const loadVisualPause = async (box) => {
    const pauseBox = element.add(box, "div", "pauseBox", "pauseBox absolute")
    const pauseIcon = element.add(pauseBox, "spam", null, "pauseIcon center")
    const time = element.add(pauseBox, "spam", "time", "time center")
    pauseIcon.textContent = "play_pause"
    return time
}

export const loadColorSelector = async (box) => {
    await import("./components/nano/colorPicker.js")
    const colorInput = document.getElementById("colorInput")
    const barHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--barHeight"))

    const colorPickerBox = element.add(box, "div", null, "colorPickerBox absolute")
    element.add(colorPickerBox, "color-picker", null, null, {
        "backColor": "rgba(245, 245, 245, 0.753)",
        "boxShadow": "inset 2px 2px 6px rgb(58, 58, 58)",
    })

    colorInput.addEventListener("change", async (e) => {
        if (e.target.checked) {
            colorPickerBox.style.top = `calc(${barHeight}px + 20px)`
            colorPickerBox.style.opacity = 1
        } else {
            colorPickerBox.style.top = "10px"
            colorPickerBox.style.opacity = 0
        }
    })

/*     

    const colorControlBox = element.add(box, "div", null, "colorControlBox absolute")
    const colorBox = element.add(colorControlBox, "input", "colorBox", "colorBox", {
        type: "range",
        min: 0,
        max: 255,
        value: 128
    })

    const inputsBox = element.add(colorControlBox, "div", null, "inputsBox")
    let ranges = []
    let values = []
    for (let i = 1; i <= 3; i++) {
        const rangeBox = element.add(inputsBox, "div", null, "rangeBox")
        const input = element.add(rangeBox, "input", "rangeColor", "rangeColor", { type: "range" })
        const value = element.add(rangeBox, "span", null, "valueBox")
        ranges.push(input)
        values.push(value)
    }

    const paletteBox = element.add(colorControlBox, "div", null, "paletteBox")
    await new Promise(requestAnimationFrame)
    console.log(paletteBox)
    console.log(paletteBox.offsetWidth)
    console.log(paletteBox.offsetHeight)
    const samplesNumber = paletteBox.offsetWidth / paletteBox.offsetHeight - 1
    console.log(samplesNumber)

    colorInput.addEventListener("change", async (e) => {
        if (e.target.checked) {
            colorControlBox.style.top = `calc(${boxHeight}px + 20px)`
            colorControlBox.style.opacity = 1
        } else {
            colorControlBox.style.top = "10px"
            colorControlBox.style.opacity = 0
        }
    })

    document.getElementById("colorBox").style.backgroundColor = `hsl(128, 100%, 50%)`

    ranges[0].addEventListener("input", (e) => {
        const color = e.target.value
        values[0].textContent = color
        document.getElementById("colorBox").style.backgroundColor = `hsl(${color}, 100%, 50%)`
    })
 */}