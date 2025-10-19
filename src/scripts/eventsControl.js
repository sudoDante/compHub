import { componentsConfig } from "../config/componentsConfig.js"
import * as events from "./modules/customEvents.js"
import * as ifaceLogic from "./interfaceLogic.js"
import * as iface from "./interface.js"

export const loadInterfaceEvents = () => {
    let eventDetail
    const main = document.querySelector("main")
    const configMenu = document.getElementById("configMenu")
    const componentLoadTransition = getComputedStyle(document.documentElement).getPropertyValue("--componentLoad")
    const testModeBox = document.getElementById("testModeBox")
    const configBox = document.getElementById("configMenu").shadowRoot.getElementById("configBox")
    let view = "computerView"
    let fullMode = false

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

        document.addEventListener("controlColorPicker", (e) => {
            main.style.background = `linear-gradient(180deg, rgba(220, 220, 220, 1) 0%, ${e.detail} 100%)`
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
            await ifaceLogic.changeView("computerView")
            eventDetail ? ifaceLogic.fullLoad(eventDetail, true, componentLoadTransition) : null
            ifaceLogic.placePauseAlert(view, fullMode)
            ifaceLogic.placeTabletView(false)
            ifaceLogic.changePanelsWidth(false)
        })

        tablet.addEventListener("change", async () => {
            view = "tabletView"
            await ifaceLogic.changeView("tabletView")
            eventDetail ? ifaceLogic.fullLoad(eventDetail, true, componentLoadTransition) : null
            ifaceLogic.placePauseAlert(view, fullMode)
            if (fullMode === true) {
                ifaceLogic.changePanelsWidth(true)
                ifaceLogic.placeTabletView(fullMode)
            }
        })

        mobile.addEventListener("change", async () => {
            view = "mobileView"
            await ifaceLogic.changeView("mobileView")
            eventDetail ? ifaceLogic.fullLoad(eventDetail, true, componentLoadTransition) : null
            ifaceLogic.placePauseAlert(view, fullMode)
            ifaceLogic.placeTabletView(false)
            ifaceLogic.changePanelsWidth(false)
        })

        fullscreen.addEventListener("change", async (e) => {
            e.target.checked
                ? await document.documentElement.requestFullscreen()
                : await document.exitFullscreen()
        })

        document.addEventListener("fullscreenchange", async () => {
            fullMode = document.fullscreenElement ? true : false
            fullscreen.checked = fullMode

            if (fullMode) {

                ifaceLogic.placePauseAlert(view, true)
                if (view === "tabletView") {
                    ifaceLogic.changePanelsWidth(true)
                    ifaceLogic.placeTabletView(true)
                }
            } else {
                ifaceLogic.placePauseAlert(view, fullMode)
                ifaceLogic.changePanelsWidth(false)
                if (view === "tabletView") ifaceLogic.placeTabletView(false)
            }

            await ifaceLogic.changeView(view)
            eventDetail ? ifaceLogic.fullLoad(eventDetail, true, componentLoadTransition) : null
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
                    ifaceLogic.placePauseAlert(view, fullMode)
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
