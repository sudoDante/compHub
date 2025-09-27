import * as element from "./modules/elements.js"
import { components } from "../config/components.js"
import { listMenu } from "./components/appSpecific/listMenu.js"
import { componentsConfig } from "./../config/componentsConfig.js"

export const loadMenu = async (container) => {
    document.addEventListener("listMenu_primary", async (e) => {
        const pos = Number(e.detail.pos)
        const delay = Number(`${parseFloat(e.detail.time) + 60}`)
        console.log(pos, delay)
    })
    element.add(container, "list-menu", null, "listMenu", { "list": components, title: "Components by type", close: true, button: "fall" })
}

export const loadControls = async (container) => {
    const controlsBox = element.add(container, "div", null, "controlBox absolute")

    const colorBox = element.add(controlsBox, "div", null, "colorBox controls relative")
    const colorIcon = element.add(colorBox, "span", null, "colorIcon font22 material-symbols-outlined")
    colorIcon.textContent = "colors"
    const text = element.add(colorBox, "span", null, "text font")
    text.textContent = "Color"
    const checkbox = element.add(colorBox, "input", null, "hiddenInput", { type: "checkbox" })

    const backBox = element.add(controlsBox, "div", null, "backBox controls flex")
    for (let i = 1; i <= 6; i++) {
        const numberBox = element.add(backBox, "span", null, "numberBox relative center font")
        numberBox.textContent = i
        if (i === 6) {
            numberBox.classList.replace("font", "material-symbols-outlined")
            numberBox.textContent = "replay"
        }
        element.add(numberBox, "input", null, "hiddenInput", { type: "radio", name: "back" })
    }

    const viewsBox = element.add(controlsBox, "div", null, "viewsBox controls flex")
    const icons = ["computer", "view_compact_alt", "mobile_3", "crop_free"]
    const ids = ["computer", "tablet", "mobile", "fullScreen"]
    for (let i = 0; i <= 3; i++) {
        const view = element.add(viewsBox, "div", null, "view relative center")
        const iconView = element.add(view, "span", null, "iconView material-symbols-outlined")
        iconView.textContent = icons[i]
        const input = element.add(view, "input", null, "hiddenInput", { type: i < 3 ? "radio" : "checkbox", name: "views" })
        input.setAttribute("id", ids[i])
    }
}

export const loadInfo = async (par, container) => {
    const preFamily = document.getElementById("preFamily")
    const preName = document.getElementById("preName")
    const family = par.type
    const delay = par.time
    const name = par.defaultName
    const transition = parseFloat(getComputedStyle(container).getPropertyValue("--preTransition"))

    container.style.width = "var(--controlsAutoWidth)"
    preFamily.style.clipPath = "polygon(0 0, 0 0, 0 100%, 0% 100%)"
    preName.style.clipPath = "polygon(0 0, 0 0, 0 100%, 0% 100%)"
    await new Promise(resolve => setTimeout(resolve, transition))

    preFamily.textContent = ""
    preName.textContent = ""
    preName.textContent = name.toUpperCase()
    preFamily.textContent = family
    await new Promise(resolve => setTimeout(resolve, transition))

    preName.style.clipPath = "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)"
    await new Promise(resolve => { setTimeout(resolve, transition) })
    preFamily.style.clipPath = "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)"
    await new Promise(resolve => { setTimeout(resolve, delay) }) /* <-- ATTENTION LIST TRANSITIONS DELAY. BETTER PERFORMANCE */
}

export const loadConfig = async (par, container) => {
    console.log(container, par)
    const componentTag = par.defaultName
    const confJson = componentsConfig
    const componentConf = Object.values(confJson).find(item => item.name === componentTag)
    console.log(componentConf)
    console.log(componentConf.config)
}


