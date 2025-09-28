import { componentsConfig } from "../config/componentsConfig.js"
import * as component from "./component.js"
import * as ifaceLogic from "./interfaceLogic.js"


export const loadMenuEvents = () => {
    console.log("Custom events control READY: waiting")

    // COMPONENTS MENU
    let componentInfo
    const componentBox = document.getElementById("componentBox")
    const info = document.getElementById("info")
    const configBox = document.getElementById("rightAside")

    document.addEventListener("selectionMenu", async (e) => {
        componentInfo = e.detail
        await ifaceLogic.drawInfo(componentInfo, info)
        /* inyectar animacion de cambio para la salida del componente */
        await ifaceLogic.loadConfig(componentInfo, componentBox)
        component.load(componentInfo, componentBox)
    })

    /* evento para cargar componente de configuracion especifico */

    document.addEventListener("viewChange", (e) => {
        componentInfo ? component.load(componentInfo, componentBox) : null
    })
}

export const applyViewsEvents = () => {
    const computer = document.getElementById("computer")
    const tablet = document.getElementById("tablet")
    const mobile = document.getElementById("mobile")
    const fullscreen = document.getElementById("fullscreen")

    computer.addEventListener("change", () => {
        ifaceLogic.changeView("computerView")
    })

    tablet.addEventListener("change", () => {
        ifaceLogic.changeView("tabletView")
    })

    mobile.addEventListener("change", () => {
        ifaceLogic.changeView("mobileView")
    })

    fullscreen.addEventListener("change", (e) => {
        if (e.target.checked) {
            document.documentElement.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    })
}
