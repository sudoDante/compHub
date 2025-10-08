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
    const controlsBox = element.add(container, "div", null, "controlBox absolute anta")

    const colorBox = element.add(controlsBox, "div", null, "colorBox controls relative")
    const colorIcon = element.add(colorBox, "span", null, "colorIcon material-symbols-outlined")
    colorIcon.textContent = "colors"
    const text = element.add(colorBox, "span", null, "text font")
    text.textContent = "Color"
    const checkbox = element.add(colorBox, "input", null, "hiddenInput", { type: "checkbox" })

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
    element.add(info, "span", "infoName", "name")
    element.add(info, "span", "infoFamily", "family")
}

export const loadPanelConfig = async (container) => {
    const backColor = getComputedStyle(document.documentElement).getPropertyValue("--backColor")
    const transition = getComputedStyle(document.documentElement).getPropertyValue("--barsTransition")
    const width = getComputedStyle(document.documentElement).getPropertyValue("--rightPanelBox")
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
