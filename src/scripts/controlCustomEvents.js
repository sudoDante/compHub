import * as element from "./modules/elements.js"
/* import { components } from "../config/components.js"
 */
console.log("Custom events control READY: waiting")

const presentationLoad = async (par, box) => {
    const container = document.getElementById("presentationBox")
    const preFamily = document.getElementById("preFamily")
    const preName = document.getElementById("preName")
    const family = par.type
    const delay = par.time
    const name = par.defaultName
    const transition = parseFloat(getComputedStyle(container).getPropertyValue("--preTransition"))

/*     box.innerHTML = ""
 */    container.style.width = "calc(var(--offset) - 30px)"
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

const addCompoment = async (par) => {
    const componentBox = document.getElementById("componentBox")
    componentBox.innerHTML = ""
    const url = par.url
    const tag = par.htmlTag
    const name = par.defaultName
    const comp = await import(url)
    await element.add(componentBox, tag, name, name)
}

// COMPONENTS MENU
let componentInfo

document.addEventListener("selectionMenu", async (e) => {
    componentInfo = e.detail
    await presentationLoad(componentInfo, componentBox)
    /* inyectar animacion de cambio para la salida del componente */
    addCompoment(componentInfo)
})

document.addEventListener("viewChange", (e) => {
    componentInfo ? addCompoment(componentInfo) : null
})