import { componentsConfig } from "../config/componentsConfig.js"
import * as ifaceLogic from "./interfaceLogic.js"
import * as extra from "./modules/extra.js"


export const loadInterfaceEvents = () => {
    let eventDetail
    const componentLoadTransition = getComputedStyle(document.documentElement).getPropertyValue("--componentLoad")
    const rightPanelBox = document.getElementById("rightPanelBox")

    const fullLoad = async () => {
        ifaceLogic.movePanel(rightPanelBox, true)
        /*         await new Promise(resolve => setTimeout(resolve, parseFloat(panelTransition)))
         */
        await new Promise(resolve => setTimeout(resolve, parseFloat(componentLoadTransition)))
        ifaceLogic.loadComponent(eventDetail)
        ifaceLogic.moveHalo(parseFloat(componentLoadTransition))
        await ifaceLogic.moveMask(parseFloat(componentLoadTransition))
    }

    const loadMenuEvents = async () => {
        console.log("custom events control READY: waiting")

        // COMPONENTS MENU
        const configMenu = document.getElementById("configMenu")
        const configBox = document.getElementById("configMenu").shadowRoot.getElementById("configBox")
        console.log(configBox)

        document.addEventListener("selectionMenu", async (e) => {
            eventDetail = e.detail
            const importedConfig = await ifaceLogic.importConfig(eventDetail)

            if (configBox.children.length > 0) {
                await ifaceLogic.clearInfo()
            }

            ifaceLogic.drawConfig(importedConfig)
            ifaceLogic.drawInfo(eventDetail)
            await fullLoad()

            configMenu.style.display = "flex"
            ifaceLogic.movePanel(rightPanelBox, false)

            await new Promise(resolve => setTimeout(resolve, 1000))
            /*         component.setAttribute("pause", "")
             */
        })

        document.addEventListener("menuVisibility", (e) => {
            ifaceLogic.menuVisibility(e.detail)
        })
    }

    const loadViewsEvents = () => {
        console.log("views events control READY: waiting")

        const computer = document.getElementById("computer")
        const tablet = document.getElementById("tablet")
        const mobile = document.getElementById("mobile")
        const fullscreen = document.getElementById("fullscreen")

        computer.addEventListener("change", async () => {
            await ifaceLogic.changeView("computerView")
            await fullLoad()
        })

        tablet.addEventListener("change", async () => {
            await ifaceLogic.changeView("tabletView")
            await fullLoad()
        })

        mobile.addEventListener("change", async () => {
            await ifaceLogic.changeView("mobileView")
            await fullLoad()
        })

        fullscreen.addEventListener("change", async (e) => {
            if (e.target.checked) {
                document.documentElement.requestFullscreen()
            } else {
                document.exitFullscreen()
            }
        })


/*         if (eventDetail) {
            console.log(eventDetail)
            ifaceLogic.loadComponent(eventDetail)
            ifaceLogic.moveHalo(parseFloat(componentLoadTransition))
            ifaceLogic.moveMask(parseFloat(componentLoadTransition))
        }
 */    }


    loadMenuEvents()
    loadViewsEvents()
}
