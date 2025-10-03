import { componentsConfig } from "../config/componentsConfig.js"
import * as ifaceLogic from "./interfaceLogic.js"


export const loadMenuEvents = () => {
    console.log("Custom events control READY: waiting")

    // COMPONENTS MENU
    let componentInfo
    const componentBox = document.getElementById("componentBox")
    const rightPanelBox = document.getElementById("rightPanelBox")
    const infoTransition = getComputedStyle(document.documentElement).getPropertyValue("--infoTransition")
    const panelTransition = getComputedStyle(document.documentElement).getPropertyValue("--barsTransition")

    document.addEventListener("selectionMenu", async (e) => {
        componentInfo = e.detail

        const config = await ifaceLogic.loadConfig(componentInfo)
        if (!document.getElementById("configMenu")) {
            await ifaceLogic.drawPanelConfig(rightPanelBox)
        }

        const configBox = document.getElementById("configMenu").shadowRoot.getElementById("configBox")
        if (configBox.children.length > 0) {
            ifaceLogic.movePanel(rightPanelBox, true)
            await new Promise(resolve => setTimeout(resolve, parseFloat(panelTransition)))

            ifaceLogic.moveHalo(false, parseFloat(infoTransition))
            ifaceLogic.moveMask(false, componentBox, parseFloat(infoTransition))
            await ifaceLogic.clearInfo()
        }

        ifaceLogic.drawConfig(config)
        ifaceLogic.drawInfo(componentInfo)
        ifaceLogic.loadComponent(componentInfo, componentBox, configBox)
        ifaceLogic.moveMask(true, componentBox)
        ifaceLogic.moveHalo(true, parseFloat(infoTransition))
        await new Promise(resolve => setTimeout(resolve, parseFloat(infoTransition)))

        ifaceLogic.movePanel(rightPanelBox, false)
    })

    document.addEventListener("menuVisibility", (e) => {
        ifaceLogic.menuVisibility(e.detail)
    })

    document.addEventListener("viewChange", (e) => {
        componentInfo ? ifaceLogic.loadComponent(componentInfo, componentBox) : null
    })
}