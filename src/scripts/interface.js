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
    const typesMenu = element.add(leftAside, "list-menu", null, "listMenu", { "list": components, title: "Components by type", close: true, button: "fall" })
}

export const loadInfo = async (par, box) => {
    const preFamily = document.getElementById("preFamily")
    const preName = document.getElementById("preName")
    const family = par.type
    const delay = par.time
    const name = par.defaultName
    const transition = parseFloat(getComputedStyle(box).getPropertyValue("--preTransition"))

    box.style.width = "calc(var(--offset) - 30px)"
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

export const loadConfig = async (par, box) => {
    console.log(box, par)
    const componentTag = par.defaultName
    const confJson = componentsConfig
    const componentConf = Object.values(confJson).find(item => item.name === componentTag)
    console.log(componentConf)
    console.log(componentConf.config)
}


