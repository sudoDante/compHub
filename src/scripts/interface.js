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

    const infoPauseBox = element.add(info, "div", "infoPauseBox", "infoPauseBox")
    const infoPauseIcon = element.add(infoPauseBox, "span", "infoPauseIcon", "infoPauseIcon toIcon center")
   
    const infoPauseTimer = element.add(infoPauseBox, "span", "infoPauseTimer", "infoPauseTimer toIcon center")
    infoPauseTimer.textContent = "pause_circle"

    const testModeActivatorBox = element.add(info, "div", "testModeActivatorBox", "testModeActivatorBox")
}

export const loadTestModeBox = async (box) => {
    await import("./components/nano/switchSlim.js")
    await element.add(box, "switch-slim", "testMode", null, {
        "title": "Test Mode",
        "fontColor": "rgba(129, 129, 129, 1)",
        "enphasisColor": "rgba(174, 232, 240, 0.76)",
        "fontFamily1": "Nunito Sans",
        "fontFamily2": "Anta",
        "fontSize": "13px",
        "backColor": "rgba(53, 53, 53, 1)",
        "trueText": "I",
        "falseText": "0",
        "trueColor": "whitesmoke",
        "falseColor": "rgb(60,60,60)",
        "value": false
    }, {
        eventDom: document,
        eventName: "testMode",
        eventItem: "activeTestMode"
    })
    box.style.opacity = 1
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

/* export const loadVisualPause = async (box, view) => {
    const pauseBox = await element.add(box, "div", "pauseBox", "pauseBoxInactive absolute")
    console.log(view)
    if (view === "computerView") {
        pauseBox.className = ""
        pauseBox.className = "pauseBoxInactive absolute computerView"
    }
    if (view === "tabletView") {
        pauseBox.className = ""
        pauseBox.className = "pauseBoxInactive absolute tabletView"
    }
    if (view === "mobileView") {
        pauseBox.className = ""
        pauseBox.className = "pauseBoxInactive absolute mobileView"
    }

    const pauseIcon = element.add(pauseBox, "spam", "pauseIcon", "pauseIcon center")
    const time = await element.add(pauseBox, "spam", "pauseBoxTime", "time center")
    pauseIcon.textContent = "play_pause"
    await new Promise(resolve => setTimeout(resolve, 10))
    pauseBox.style.opacity = 1
    return pauseBox
}
 */
/* export const unloadVisualPause = async (box) => {
    const transition = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--barsTransition"))
    box.style.opacity = 0
    await new Promise(resolve => setTimeout(resolve, transition))
    box.remove()
}
 */
export const loadColorSelector = async (box) => {
    await import("./components/micro/colorPickerHSL.js")
    const colorInput = document.getElementById("colorInput")
    const barHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--barHeight"))

    const colorPickerBox = await element.add(box, "div", "colorPicker", "colorPickerBox absolute")
    element.add(colorPickerBox, "color-picker-hsl", "controlPicker", null, {
        "backColor": "rgba(255, 255, 255, 0.5)",
        "fontFamily": "Anta",
        "fontSize": "13px",
        "fontColor": "rgba(43, 43, 43, 1)",
        "event": "controlColorPicker"
    })

    colorInput.addEventListener("change", async (e) => {
        if (e.target.checked) {
            colorPickerBox.style.top = `calc(${barHeight}px + 20px)`
            colorPickerBox.style.opacity = 1
        } else {
            colorInput.disabled = true
            colorPickerBox.style.top = "10px"
            colorPickerBox.style.opacity = 0
            await new Promise(resolve => setTimeout(resolve, 220)) /* time colorPickerBox class transition */
            colorInput.disabled = false
        }
    })
}