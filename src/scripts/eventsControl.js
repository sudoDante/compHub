import { componentsConfig } from "../config/componentsConfig.js"
import * as ifaceLogic from "./interfaceLogic.js"
import * as extra from "./modules/extra.js"
import * as events from "./modules/customEvents.js"

export const loadInterfaceEvents = () => {
    let eventDetail
    const configMenu = document.getElementById("configMenu")
    const componentLoadTransition = getComputedStyle(document.documentElement).getPropertyValue("--componentLoad")
    const rightPanelCloseButton = document.getElementById("configMenu").shadowRoot.getElementById("closeInput")

    const fullLoad = async (par) => {
        ifaceLogic.movePanel(par, "right")
        await new Promise(resolve => setTimeout(resolve, parseFloat(componentLoadTransition)))

        let component
        if (eventDetail) {
            component = await ifaceLogic.loadComponent(eventDetail)
            ifaceLogic.moveHalo(parseFloat(componentLoadTransition))
            await ifaceLogic.moveMask(parseFloat(componentLoadTransition))
        }
        return component
    }

    const loadMenuEvents = async () => {
        console.log("custom events control READY: waiting")
        const configMenu = document.getElementById("configMenu")
        const configBox = document.getElementById("configMenu").shadowRoot.getElementById("configBox")

        document.addEventListener("selectionMenu", async (e) => {
            eventDetail = e.detail
            const importedConfig = await ifaceLogic.importConfig(eventDetail)
            ifaceLogic.loadPausedLayer(main, false)

            if (configBox.children.length > 0) await ifaceLogic.clearInfo()
            ifaceLogic.drawInfo(eventDetail)
            const component = await fullLoad(true)
            configMenu.style.display = "flex"
            ifaceLogic.movePanel(false, "right")
            rightPanelCloseButton.checked = true
            events.send(configMenu.shadowRoot, "loadConfig", { detail: importedConfig })
            await new Promise(resolve => setTimeout(resolve, 1000))
            ifaceLogic.pauseSetVisible()
        })

        document.addEventListener("menuVisibility", (e) => {
            ifaceLogic.controlBarsPanels(e.detail)
        })
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
                localStorage.setItem("testMode", value)
                await new Promise(resolve => setTimeout(resolve, 300))
                window.location.replace(window.location.href)
            }

            if (event === "pause") {
                const main = document.getElementById("main")
                const actualComponent = ifaceLogic.identifyBoxes("inactive").children[0] /* inactive???? strangers things */
                actualComponent ? actualComponent.setAttribute("pause", value) : null
                ifaceLogic.loadPausedLayer(main, value)
            }
        })
    }

    loadViewsEvents()
    loadMenuEvents()
    loadComponentEvents()
}
