import { componentsConfig } from "../config/componentsConfig.js"
import * as ifaceLogic from "./interfaceLogic.js"
import * as extra from "./modules/extra.js"

export const loadMenuEvents = () => {
    console.log("Custom events control READY: waiting")

    // COMPONENTS MENU
    let eventDetail
    let containerExchanger = 0
    const componentBox0 = document.getElementById("componentBox0")
    const componentBox1 = document.getElementById("componentBox1")
    const rightPanelBox = document.getElementById("rightPanelBox")
    const configMenu = document.getElementById("configMenu")
    const infoTransition = getComputedStyle(document.documentElement).getPropertyValue("--infoTransition")
    const panelTransition = getComputedStyle(document.documentElement).getPropertyValue("--barsTransition")

    document.addEventListener("selectionMenu", async (e) => {
        eventDetail = e.detail
        const importedConfig = await ifaceLogic.importConfig(eventDetail)
        const configBox = document.getElementById("configMenu").shadowRoot.getElementById("configBox")

        const componentBox = extra.checkPar(containerExchanger)
            ? componentBox0
            : componentBox1

        const toEmptyComponentBox = extra.checkPar(containerExchanger)
            ? componentBox1
            : componentBox0

        /*         if (configBox.children.length > 0) {
                    ifaceLogic.movePanel(rightPanelBox, true)
                    await new Promise(resolve => setTimeout(resolve, parseFloat(panelTransition)))
        
                    ifaceLogic.moveMask(false, componentBox, toEmptyComponentBox, parseFloat(infoTransition))
                    ifaceLogic.moveHalo(false, parseFloat(infoTransition))
        
                    await ifaceLogic.clearInfo()
                }
         */
        ifaceLogic.drawConfig(importedConfig)
        ifaceLogic.drawInfo(eventDetail)


        const component = await ifaceLogic.loadComponent(eventDetail, componentBox, configBox)

        ifaceLogic.moveMask(componentBox, toEmptyComponentBox, parseFloat(infoTransition))
        ifaceLogic.moveHalo(parseFloat(infoTransition))
        await new Promise(resolve => setTimeout(resolve, parseFloat(infoTransition)))

        configMenu.style.display = "flex"
        ifaceLogic.movePanel(rightPanelBox, false)

        await new Promise(resolve => setTimeout(resolve, 1000))
        /*         component.setAttribute("pause", "")
         */
        containerExchanger += 1
    })











    /*     const panelTransition = getComputedStyle(document.documentElement).getPropertyValue("--barsTransition")
    
        document.addEventListener("selectionMenu", async (e) => {
            eventDetail = e.detail
            const config = await ifaceLogic.loadConfig(eventDetail)
            const configBox = document.getElementById("configMenu").shadowRoot.getElementById("configBox")
    
            if (configBox.children.length > 0) {
                ifaceLogic.movePanel(rightPanelBox, true)
                await new Promise(resolve => setTimeout(resolve, parseFloat(panelTransition)))
    
                ifaceLogic.moveHalo(false, parseFloat(infoTransition))
                ifaceLogic.moveMask(false, componentBox, parseFloat(infoTransition))
                await ifaceLogic.clearInfo()
            }
    
            ifaceLogic.drawConfig(config)
            ifaceLogic.drawInfo(eventDetail)
    
            const component = await ifaceLogic.loadComponent(eventDetail, componentBox, configBox)
    
            ifaceLogic.moveMask(true, componentBox)
            ifaceLogic.moveHalo(true, parseFloat(infoTransition))
            await new Promise(resolve => setTimeout(resolve, parseFloat(infoTransition)))
    
            configMenu.style.display = "flex"
            ifaceLogic.movePanel(rightPanelBox, false)
    
            await new Promise(resolve => setTimeout(resolve, 1000))
            component.setAttribute("pause", "") 
            PAUSE ATTR 
    
        })
     */

    document.addEventListener("menuVisibility", (e) => {
        ifaceLogic.menuVisibility(e.detail)
    })

    document.addEventListener("viewChange", (e) => {
        eventDetail ? ifaceLogic.loadComponent(eventDetail, componentBox) : null
    })
}