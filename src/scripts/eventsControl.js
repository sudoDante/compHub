import { componentsConfig } from "../config/componentsConfig.js"
import * as ifaceLogic from "./interfaceLogic.js"
import * as extra from "./modules/extra.js"


export const loadInterfaceEvents = () => {
    let eventDetail
    const componentLoadTransition = getComputedStyle(document.documentElement).getPropertyValue("--componentLoad")

    const fullLoad = async (par) => {
        ifaceLogic.movePanel(par)

        await new Promise(resolve => setTimeout(resolve, parseFloat(componentLoadTransition)))
        if (eventDetail) {
            ifaceLogic.loadComponent(eventDetail)
            ifaceLogic.moveHalo(parseFloat(componentLoadTransition))
            await ifaceLogic.moveMask(parseFloat(componentLoadTransition))
        }
    }

    const loadMenuEvents = async () => {
        console.log("custom events control READY: waiting")

        // COMPONENTS MENU
        const configMenu = document.getElementById("configMenu")
        const configBox = document.getElementById("configMenu").shadowRoot.getElementById("configBox")

        document.addEventListener("selectionMenu", async (e) => {
            eventDetail = e.detail
            const importedConfig = await ifaceLogic.importConfig(eventDetail)

            if (configBox.children.length > 0) await ifaceLogic.clearInfo()

            ifaceLogic.drawConfig(importedConfig)
            ifaceLogic.drawInfo(eventDetail)
            await fullLoad(true)


            configMenu.style.display = "flex"
            ifaceLogic.movePanel(false)

            await new Promise(resolve => setTimeout(resolve, 1000))
            /*         component.setAttribute("pause", "")
             */
        })

        document.addEventListener("menuVisibility", (e) => {
            ifaceLogic.controlBarsPanels(e.detail)
        })
    }

    const loadViewsEvents = () => {
        console.log("views events control READY: waiting")
        let view = "computerView"

        const computer = document.getElementById("computer")
        const tablet = document.getElementById("tablet")
        const mobile = document.getElementById("mobile")
        const fullscreen = document.getElementById("fullscreen")

        computer.addEventListener("change", async () => {
            view = "computerView"
            await ifaceLogic.changeView("computerView")
            await fullLoad(true)
        })

        tablet.addEventListener("change", async () => {
            view = "tabletView"
            await ifaceLogic.changeView("tabletView")
            await fullLoad(true)
        })

        mobile.addEventListener("change", async () => {
            view = "mobileView"
            await ifaceLogic.changeView("mobileView")
            await fullLoad(true)        })

        fullscreen.addEventListener("change", async (e) => {
            if (e.target.checked) {
                await document.documentElement.requestFullscreen()
            } else {
                await document.exitFullscreen()
            }
            await ifaceLogic.changeView(view)
            await fullLoad(true)
        })
    }


    loadMenuEvents()
    loadViewsEvents()
}
