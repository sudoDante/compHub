import { componentsConfig } from "../config/componentsConfig.js"
import * as extra from "./modules/extra.js"
import * as events from "./modules/customEvents.js"
import * as ifaceLogic from "./interfaceLogic.js"
import * as iface from "./interface.js"

export const loadInterfaceEvents = () => {
    let eventDetail
    const configMenu = document.getElementById("configMenu")
    const componentLoadTransition = getComputedStyle(document.documentElement).getPropertyValue("--componentLoad")
/*     const rightPanelCloseButton = document.getElementById("configMenu").shadowRoot.getElementById("closeInput")
 */    const testModeBox = document.getElementById("testModeBox")
    const configBox = document.getElementById("configMenu").shadowRoot.getElementById("configBox")
    let view = "computerView"

    const loadMenuEvents = async () => {
        console.log("menu custom events READY: waiting")

        document.addEventListener("selectionMenu", async (e) => {
            eventDetail = e.detail
            const importedConfig = await ifaceLogic.importConfig(eventDetail)
            ifaceLogic.movePanel(true, "right")
            if (configBox.children.length > 0) await ifaceLogic.clearInfo()
            ifaceLogic.drawInfo(eventDetail)
            await ifaceLogic.fullLoad(eventDetail, true, componentLoadTransition)
            events.send(configMenu.shadowRoot, "loadConfig", { detail: importedConfig })
        })

        document.addEventListener("configLoaded", (e) => {
            ifaceLogic.movePanel(false, "right")
            if (testModeBox.children.length === 0) ifaceLogic.activeTestMode(testModeBox)
        })
    }


    const loadViewsEvents = () => {
        console.log("views events control READY: waiting")

        const computer = document.getElementById("computer")
        const tablet = document.getElementById("tablet")
        const mobile = document.getElementById("mobile")
        const fullscreen = document.getElementById("fullscreen")

        computer.addEventListener("change", async () => {
            view = "computerView"
/*             localStorage.setItem("view", "computerView")
 */            await ifaceLogic.changeView("computerView")
            eventDetail ? ifaceLogic.fullLoad(eventDetail, true, componentLoadTransition) : null
            ifaceLogic.placePauseAlert(view)
        })

        tablet.addEventListener("change", async () => {
            view = "tabletView"
/*             localStorage.setItem("view", "tabletView")
 */            await ifaceLogic.changeView("tabletView")
            eventDetail ? ifaceLogic.fullLoad(eventDetail, true, componentLoadTransition) : null
            ifaceLogic.placePauseAlert(view)
        })

        mobile.addEventListener("change", async () => {
            view = "mobileView"
/*             localStorage.setItem("view", "mobileView")
 */            await ifaceLogic.changeView("mobileView")
            eventDetail ? ifaceLogic.fullLoad(eventDetail, true, componentLoadTransition) : null
            ifaceLogic.placePauseAlert(view)
        })

        fullscreen.addEventListener("change", async (e) => {
            if (e.target.checked) {
                await document.documentElement.requestFullscreen()
            } else {
                await document.exitFullscreen()
            }

            await ifaceLogic.changeView(view)
            eventDetail ? ifaceLogic.fullLoad(eventDetail, true, componentLoadTransition) : null
            ifaceLogic.placePauseAlert(view)
        })
    }

    const loadComponentEvents = () => {
        console.log("custom events config READY: waiting")
        let pauseTime
        const componentBoxContainer = document.getElementById("componentBoxContainer")

        document.addEventListener("componentChanged", async (e) => {
            const event = Object.entries(e.detail)[0][0]
            const value = Object.entries(e.detail)[0][1]

            if (event === "testMode") {
                const configComponent = document.getElementById("configMenu").shadowRoot
                configComponent.dispatchEvent(new CustomEvent("testMode", { detail: value }))

                if (!document.getElementById("pauseBox")) {
                    pauseTime = await iface.loadVisualPause(componentBoxContainer)
                    ifaceLogic.placePauseAlert(view)
                    pauseTime.textContent = "PAUSED"
                }

                if (value === false) ifaceLogic.clearPause()
            }

            if (event === "autoPause") pauseTime.textContent = Number(value) === 0 ? "PAUSED" : value

        })
    }

    loadViewsEvents()
    loadMenuEvents()
    loadComponentEvents()
}
