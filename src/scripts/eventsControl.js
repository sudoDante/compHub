import { componentsConfig } from "../config/componentsConfig.js"
import * as ifaceLogic from "./interfaceLogic.js"
import * as extra from "./modules/extra.js"
import * as events from "./modules/customEvents.js"

export const loadInterfaceEvents = () => {
    let eventDetail
    const configMenu = document.getElementById("configMenu")
    const componentLoadTransition = getComputedStyle(document.documentElement).getPropertyValue("--componentLoad")
    const rightPanelCloseButton = document.getElementById("configMenu").shadowRoot.getElementById("closeInput")
    const testModeBox = document.getElementById("testModeBox")
    const configBox = document.getElementById("configMenu").shadowRoot.getElementById("configBox")


    const loadMenuEvents = async () => {
        console.log("menu custom events READY: waiting")

        document.addEventListener("selectionMenu", async (e) => {
            const importedConfig = await ifaceLogic.importConfig(e.detail)
            ifaceLogic.movePanel(true, "right")

            if (testModeBox.children.length === 0) await ifaceLogic.activeTestMode(testModeBox)
            if (configBox.children.length > 0) await ifaceLogic.clearInfo()

            ifaceLogic.drawInfo(e.detail)
            await ifaceLogic.fullLoad(e.detail, true, componentLoadTransition)

            events.send(configMenu.shadowRoot, "loadConfig", { detail: importedConfig })
        })
        document.addEventListener("configLoaded", (e) => ifaceLogic.movePanel(false, "right"))
    }


    const loadViewsEvents = () => {
        console.log("views events control READY: waiting")
        let view = "computerView"
        let fullState = false

        const computer = document.getElementById("computer")
        const tablet = document.getElementById("tablet")
        const mobile = document.getElementById("mobile")
        const fullscreen = document.getElementById("fullscreen")

        computer.addEventListener("change", async () => {
            view = "computerView"
            await ifaceLogic.changeView("computerView", fullState)
            eventDetail ? await fullLoad(false) : await fullLoad(true)
        })

        tablet.addEventListener("change", async () => {
            view = "tabletView"
            await ifaceLogic.changeView("tabletView", fullState)
            eventDetail ? await fullLoad(false) : await fullLoad(true)
        })

        mobile.addEventListener("change", async () => {
            view = "mobileView"
            await ifaceLogic.changeView("mobileView", fullState)
            eventDetail ? await fullLoad(false) : await fullLoad(true)
        })

        fullscreen.addEventListener("change", async (e) => {
            if (e.target.checked) {
                await document.documentElement.requestFullscreen()
                fullState = true
            } else {
                await document.exitFullscreen()
                fullState = false
            }
            await ifaceLogic.changeView(view, fullState)
            eventDetail ? await fullLoad(false) : await fullLoad(true)
        })
    }

    const loadComponentEvents = () => {
        console.log("custom events config READY: waiting")

        document.addEventListener("componentChanged", async (e) => {
            const event = Object.entries(e.detail)[0][0]
            const value = Object.entries(e.detail)[0][1]

            if (event === "testMode") {
            }

            if (event === "pause") {
            }
        })
    }

    loadViewsEvents()
    loadMenuEvents()
    loadComponentEvents()
}
