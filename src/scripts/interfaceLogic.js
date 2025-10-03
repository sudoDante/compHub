import * as event from "./modules/customEvents.js"
import { componentsConfig } from "./../config/componentsConfig.js"
import * as element from "./modules/elements.js"

export const loadComponent = async (par, container) => {
    container.innerHTML = ""
    const url = par.url
    const tag = par.htmlTag
    const name = par.defaultName
    await import(url)
    element.add(container, tag, name, name)
}

export const applyBacksRestart = () => {
    const restartBackImage = document.getElementById("restartBackImage")

    restartBackImage.addEventListener("click", () => {
        const imageInputSelected = Array.from(document.querySelectorAll("input[name='backImage']")).find(item => item.checked === true)
        if (imageInputSelected) imageInputSelected.checked = false
    })
}

export const applyViewsEvents = () => {
    const computer = document.getElementById("computer")
    const tablet = document.getElementById("tablet")
    const mobile = document.getElementById("mobile")
    const fullscreen = document.getElementById("fullscreen")

    computer.addEventListener("change", () => {
        changeView("computerView")
    })

    tablet.addEventListener("change", () => {
        changeView("tabletView")
    })

    mobile.addEventListener("change", () => {
        changeView("mobileView")
    })

    fullscreen.addEventListener("change", (e) => {
        if (e.target.checked) {
            document.documentElement.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    })
}

const changeView = async (view) => {
    const componentBoxContainer = document.getElementById("componentBoxContainer")
    const componentBox = document.getElementById("componentBox")

    componentBox.innerHTML = ""
    const widthBox = document.body.offsetWidth
    const heightBox = document.body.offsetHeight

    if (view === "computerView") {
        componentBoxContainer.style.height = `${heightBox}px`
        componentBoxContainer.style.width = `${widthBox}px`
        componentBoxContainer.style.borderRadius = "0px"
    }
    if (view === "tabletView") {
        componentBoxContainer.style.height = `${heightBox * 0.8}px`
        componentBoxContainer.style.width = `${16 / 9 * (0.8 * heightBox)}px`
        componentBoxContainer.style.borderRadius = "16px"
    }
    if (view === "mobileView") {
        componentBoxContainer.style.height = `${heightBox * 0.8}px`
        componentBoxContainer.style.width = `${9 / 16 * (0.8 * heightBox)}px`
        componentBoxContainer.style.borderRadius = "16px"
    }
    componentBoxContainer.addEventListener("transitionend", () => { event.send(document, "viewChange", { detail: view }) }, { once: true })
}

export const menuVisibility = (obj) => {
    const list = document.getElementById("listMenuHidden")
    const config = document.getElementById("configMenuHidden")
    const panels = document.getElementById("bothMenuHidden")
    const check = document.getElementById(`${obj.item}Hidden`)
    check.checked = obj.state

    panels.checked = (!list.checked && !config.checked) ? false : true
}

export const drawInfo = async (par) => {
    const info = document.getElementById("info")
    const infoFamily = document.getElementById("infoFamily")
    const infoName = document.getElementById("infoName")
    const transition = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--infoTransition"))

    const family = par.type
    const delay = par.time
    const name = par.defaultName

    infoFamily.textContent = ""
    infoName.textContent = ""
    infoName.textContent = name.toUpperCase()
    infoFamily.textContent = family

    info.style.clipPath = "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)"
    await new Promise(resolve => { setTimeout(resolve, transition) }) /* <-- ATTENTION LIST TRANSITIONS DELAY. BETTER PERFORMANCE */
}

export const clearInfo = async () => {
    const info = document.getElementById("info")
    const transition = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--infoTransition"))
    info.style.transition = transition
    info.style.clipPath = "polygon(0 0, 0 0, 0 100%, 0% 100%)"
    info.style.transition = transition
    await new Promise(resolve => { setTimeout(resolve, transition) }) /* <-- ATTENTION LIST TRANSITIONS DELAY. BETTER PERFORMANCE */
}

export const moveHalo = async (par, time) => {
    const line = document.getElementById("line")
    line.style.boxShadow = "0 0 30px rgb(0, 255, 208), 0 0 30px rgb(0, 255, 208), 0 0 30px rgb(0, 255, 208)"
    if (par === true) {
        line.style.top = "100%"
    } else {
        line.style.top = 0
    }
    await new Promise(resolve => setTimeout(resolve, time))
    line.style.boxShadow = "none"

}

export const movePanel = async (panel, par) => {
    if (par === true) {
        panel.style.right = `-${rightPanelBox.offsetWidth}px`

    } else {
        panel.style.right = 0
    }
}

export const moveMask = async (par, box, time) => {
    if (par === true) {
        componentBox.style.clipPath = "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)"
    } else {
        componentBox.style.clipPath = "polygon(0 0, 100% 0, 100% 0, 0 0)"
        await new Promise(resolve => setTimeout(resolve, time))
        box.innerHTML = ""
    }
}

export const loadConfig = async (par) => {
    const componentTag = par.htmlTag
    const confJson = componentsConfig
    const componentConf = Object.values(confJson).find(item => item.tag === componentTag)
    return componentConf.config
}

export const drawPanelConfig = async (container) => {
    const backColor = getComputedStyle(document.documentElement).getPropertyValue("--backColor")
    const transition = getComputedStyle(document.documentElement).getPropertyValue("--barsTransition")
    const width = getComputedStyle(document.documentElement).getPropertyValue("--rightPanelBox")
    const buttonSize = getComputedStyle(document.documentElement).getPropertyValue("--barHeight")

    await import("./components/appSpecific/configMenu.js")
    element.add(container, "config-menu", "configMenu", null, {
        "back": backColor,
        "buttonSize": buttonSize,
        "transition": transition,
        "parentWidth": width
    })
}

export const drawConfig = async (config) => {
    const container = document.getElementById("configMenu").shadowRoot.getElementById("configBox")
    const font = "anta"
    const fontSize = "14px"
    const fontColor = "rgba(160, 160, 160, 1)"
    const enphasisColor = "red"
    const configItems = config

    for (const array of configItems) {
        const title = array.title
        const items = array.items

        const section = element.add(container, "section", null, "section")

        for (const obj of items) {
            const tag = obj.tag
            let type = obj.type || null

            if (tag === "input" && obj.type === "range") {
                await import("./components/nano/rangeSlim2.js")
                const value = obj.value
                const min = obj.min
                const max = obj.max

                const rangeBox = element.add(section, "div", null, "rangeBox")
                const range = element.add(rangeBox, "range-slim", null, null, {
                    "title": obj.label,
                    "fontFamily": font,
                    "fontSize": fontSize,
                    "fontColor": fontColor,
                    "trackColor": "rgba(200, 200, 200, 0.2)",
                    "progressColor": "rgba(200, 200, 200, 0.6)",
                    "thumbColor": "rgba(200, 200, 200, 1)",
                    "enphasisColor": enphasisColor,
                    "min": min,
                    "max": max,
                    "value": value
                })
            }
        }
    }
}