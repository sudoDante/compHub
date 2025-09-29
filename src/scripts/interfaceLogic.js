import * as event from "./modules/customEvents.js"
import { componentsConfig } from "./../config/componentsConfig.js"
import * as element from "./modules/elements.js"

export const loadComponent = async (par, container) => {
    componentBox.innerHTML = ""
    const url = par.url
    const tag = par.htmlTag
    const name = par.defaultName
    const comp = await import(url)
    await element.add(container, tag, name, name)
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
    const componentBox = document.getElementById("componentBox")

    componentBox.innerHTML = ""
    const widthBox = document.body.offsetWidth
    const heightBox = document.body.offsetHeight

    if (view === "computerView") {
        componentBox.style.height = `${heightBox}px`
        componentBox.style.width = `${widthBox}px`
        componentBox.style.borderRadius = "0px"
    }
    if (view === "tabletView") {
        componentBox.style.height = `${heightBox * 0.8}px`
        componentBox.style.width = `${16 / 9 * (0.8 * heightBox)}px`
        componentBox.style.borderRadius = "16px"
    }
    if (view === "mobileView") {
        componentBox.style.height = `${heightBox * 0.8}px`
        componentBox.style.width = `${9 / 16 * (0.8 * heightBox)}px`
        componentBox.style.borderRadius = "8px"
    }
    componentBox.addEventListener("transitionend", () => { event.send(document, "viewChange", { detail: view }) }, { once: true })
}

export const menuVisibility = (obj) => {
    const list = document.getElementById("listMenuHidden")
    const config = document.getElementById("configMenuHidden")
    const panels = document.getElementById("bothMenuHidden")

    console.log(list, config)
    const check = document.getElementById(`${obj.item}Hidden`)
    console.log(check)
    check.checked = obj.state

    panels.checked = (!list.checked && !config.checked) ? false : true
}

export const drawInfo = async (par, container) => {
    const infoFamily = document.getElementById("infoFamily")
    const infoName = document.getElementById("infoName")
    const family = par.type
    const delay = par.time
    const name = par.defaultName
    const transition = parseFloat(getComputedStyle(container).getPropertyValue("--infoTransition"))

    container.style.width = "var(--controlsAutoWidth)"
    infoFamily.style.clipPath = "polygon(0 0, 0 0, 0 100%, 0% 100%)"
    infoName.style.clipPath = "polygon(0 0, 0 0, 0 100%, 0% 100%)"
    await new Promise(resolve => setTimeout(resolve, transition))

    infoFamily.textContent = ""
    infoName.textContent = ""
    infoName.textContent = name.toUpperCase()
    infoFamily.textContent = family
    await new Promise(resolve => setTimeout(resolve, transition))

    infoName.style.clipPath = "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)"
    await new Promise(resolve => { setTimeout(resolve, transition) })
    infoFamily.style.clipPath = "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)"
    await new Promise(resolve => { setTimeout(resolve, delay) }) /* <-- ATTENTION LIST TRANSITIONS DELAY. BETTER PERFORMANCE */
}

export const loadConfig = async (par) => {
    const componentTag = par.htmlTag
    const confJson = componentsConfig
    const componentConf = Object.values(confJson).find(item => item.tag === componentTag)
    return componentConf.config
}

export const drawPanelConfig = async (conf, container) => {
    const backColor = getComputedStyle(document.documentElement).getPropertyValue("--backColor")
    const transition = getComputedStyle(document.documentElement).getPropertyValue("--barsTransition")
    const width = getComputedStyle(document.documentElement).getPropertyValue("--rightPanelBox")
    const buttonSize = getComputedStyle(document.documentElement).getPropertyValue("--barHeight")

    await import("./components/appSpecific/configMenu.js")
    element.add(container, "config-menu", "configMenu", null, {
        config: JSON.stringify(conf),
        back: backColor,
        buttonSize: buttonSize,
        transition: transition,
        parentWidth: width
    })
}