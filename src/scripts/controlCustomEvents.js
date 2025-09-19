import * as element from "./modules/elements.js"
import { components } from "../config/components.js"

console.log("Custom events control READY: waiting")

const loadComponent = async (par) => {
    const compContainer = document.getElementById("compContainer")
    const url = par.url
    const tag = par.htmlTag
    const delay = par.time
    const name = par.defaultName

    compContainer.innerHTML = ""

    const comp = await import(url)
    await new Promise(resolve => { setTimeout(resolve, delay) })

    element.add(compContainer, tag, name, name)
}

// COMPONENTS MENU

document.addEventListener("selectionMenu", (e) => {
    loadComponent(e.detail)
})