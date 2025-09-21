import * as element from "./modules/elements.js"
import { components } from "../config/components.js"

console.log("Custom events control READY: waiting")

const loadComponent = async (par) => {
    const container = document.getElementById("presentationBox")
    const preFamily = document.getElementById("preFamily")
    const preName = document.getElementById("preName")
    const compContainer = document.getElementById("compContainer")
    const family = par.type
    const url = par.url
    const tag = par.htmlTag
    const delay = par.time
    const name = par.defaultName
    const transition = parseFloat(getComputedStyle(container).getPropertyValue("--preTransition"))
    const comp = await import(url)

    compContainer.innerHTML = ""
    container.style.width = "calc(var(--offset) - 30px)"
    preFamily.style.clipPath = "polygon(0 0, 0 0, 0 100%, 0% 100%)"
    preName.style.clipPath = "polygon(0 0, 0 0, 0 100%, 0% 100%)"
    await new Promise(resolve => setTimeout(resolve, transition))

    preFamily.textContent = ""
    preName.textContent = ""
    preFamily.textContent = family
    preName.textContent = name.toUpperCase()
    await new Promise(resolve => setTimeout(resolve, transition))

    preFamily.style.clipPath = "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)"
    await new Promise(resolve => { setTimeout(resolve, transition) })
    preName.style.clipPath = "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)"
    await new Promise(resolve => { setTimeout(resolve, delay) }) /* <-- ATENTION LIST TRANSITIONS DELAY. BETTER PERFORMANCE */

    /* inyectar animacion de cambio para la salida del componente */
    element.add(compContainer, tag, name, name)
}

// COMPONENTS MENU

document.addEventListener("selectionMenu", (e) => {
    loadComponent(e.detail)
})