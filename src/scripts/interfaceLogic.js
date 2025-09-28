import * as event from "./modules/customEvents.js"
import { componentsConfig } from "./../config/componentsConfig.js"

export const changeView = async (view) => {
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

export const loadConfig = async (par, container) => {
/*     console.log(container, par)
 */    const componentTag = par.defaultName
    const confJson = componentsConfig
    const componentConf = Object.values(confJson).find(item => item.name === componentTag)
/*     console.log(componentConf)
    console.log(componentConf.config)
 */}
