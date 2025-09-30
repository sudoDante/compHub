import { componentsConfig } from "../config/componentsConfig.js"
import * as ifaceLogic from "./interfaceLogic.js"


export const loadMenuEvents = () => {
    console.log("Custom events control READY: waiting")

    // COMPONENTS MENU
    let componentInfo
    const componentBox = document.getElementById("componentBox")
    const info = document.getElementById("info")
    const rightPanelBox = document.getElementById("rightPanelBox")

    document.addEventListener("selectionMenu", async (e) => {
        componentInfo = e.detail
        await ifaceLogic.drawInfo(componentInfo, info)
        /* inyectar animacion de cambio para la salida del componente y esperar transicion*/
        ifaceLogic.loadComponent(componentInfo, componentBox)

        const config = await ifaceLogic.loadConfig(componentInfo)
        if (!document.getElementById("configMenu")) await ifaceLogic.drawPanelConfig(rightPanelBox)
        ifaceLogic.drawConfig(config)
    })

    document.addEventListener("menuVisibility", (e) => {
        ifaceLogic.menuVisibility(e.detail)
    })

    document.addEventListener("viewChange", (e) => {
        componentInfo ? ifaceLogic.loadComponent(componentInfo, componentBox) : null
    })
}