import * as element from "./modules/elements.js"
/* import { components } from "../config/components.js"
 */
console.log("Custom events control READY: waiting")

const presentationLoad = async (par) => {
    const container = document.getElementById("presentationBox")
    const preFamily = document.getElementById("preFamily")
    const preName = document.getElementById("preName")
    const compContainer = document.getElementById("compContainer")
    const family = par.type
    const delay = par.time
    const name = par.defaultName
    const transition = parseFloat(getComputedStyle(container).getPropertyValue("--preTransition"))

    compContainer.innerHTML = ""
    container.style.width = "calc(var(--offset) - 30px)"
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
    await new Promise(resolve => { setTimeout(resolve, delay) }) /* <-- ATENTION LIST TRANSITIONS DELAY. BETTER PERFORMANCE */
}

const addCompoment = async (par) => {
    const url = par.url
    const tag = par.htmlTag
    const name = par.defaultName
    const comp = await import(url)
    await element.add(compContainer, tag, name, name)
}

// COMPONENTS MENU
document.addEventListener("selectionMenu", async (e) => {
    await presentationLoad(e.detail)
    /* inyectar animacion de cambio para la salida del componente */
    addCompoment(e.detail)
})