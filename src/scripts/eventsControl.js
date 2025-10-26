import { componentsConfig } from "../config/componentsConfig.js"
import * as events from "./modules/customEvents.js"
import * as ifaceLogic from "./interfaceLogic.js"
import * as iface from "./interface.js"

export const loadInterfaceEvents = () => {
    const main = document.querySelector("main")
    const configMenu = document.getElementById("configMenu")
    const componentLoadTransition = getComputedStyle(document.documentElement).getPropertyValue("--componentLoad")
    const testModeBox = document.getElementById("testModeActivatorBox")
    const configBox = document.getElementById("configMenu").shadowRoot.getElementById("configBox")

    let view = "computerView"
    let fullMode = false
    let eventDetail
    let component
    let lastAutoPauseEvent = { value: 0 }

    const loadMenuEvents = async () => {
        console.log("menu custom events READY: waiting")

        document.addEventListener("selectionMenu", async (e) => {
            eventDetail = e.detail
            const importedConfig = await ifaceLogic.importConfig(eventDetail)
            ifaceLogic.movePanel(true, "right")
            if (configBox.children.length > 0) await ifaceLogic.clearInfo()
            await ifaceLogic.drawInfo(eventDetail)
            component = await ifaceLogic.fullLoad(eventDetail, true, componentLoadTransition)
            ifaceLogic.cancelAutoPause(lastAutoPauseEvent)
            events.send(configMenu.shadowRoot, "loadConfig", { detail: importedConfig })
        })

        document.addEventListener("configLoaded", (e) => {
            ifaceLogic.movePanel(false, "right")
            if (testModeBox.children.length === 0) iface.loadTestModeBox(testModeBox)
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
            ifaceLogic.placeTabletView(false)
            ifaceLogic.changePanelsWidth(false)
            eventDetail ? component = await ifaceLogic.fullLoad(eventDetail, true, componentLoadTransition) : null
            ifaceLogic.cancelAutoPause(lastAutoPauseEvent)
        })

        tablet.addEventListener("change", async () => {
            view = "tabletView"
            await ifaceLogic.changeView("tabletView")
            if (fullMode === true) {
                ifaceLogic.changePanelsWidth(true)
                ifaceLogic.placeTabletView(fullMode)
            }
            eventDetail ? component = await ifaceLogic.fullLoad(eventDetail, true, componentLoadTransition) : null
            ifaceLogic.cancelAutoPause(lastAutoPauseEvent)
        })

        mobile.addEventListener("change", async () => {
            view = "mobileView"
            await ifaceLogic.changeView("mobileView")
            ifaceLogic.placeTabletView(false)
            ifaceLogic.changePanelsWidth(false)
            eventDetail ? component = await ifaceLogic.fullLoad(eventDetail, true, componentLoadTransition) : null
            ifaceLogic.cancelAutoPause(lastAutoPauseEvent)
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

                if (view === "tabletView") {
                    ifaceLogic.changePanelsWidth(true)
                    ifaceLogic.placeTabletView(true)
                }
            } else {
                ifaceLogic.changePanelsWidth(false)
                if (view === "tabletView") ifaceLogic.placeTabletView(false)
            }

            await ifaceLogic.changeView(view)
            eventDetail ? component = await ifaceLogic.fullLoad(eventDetail, true, componentLoadTransition) : null
            ifaceLogic.cancelAutoPause(lastAutoPauseEvent)
        })
    }

    const loadPauseEvents = async () => {
        console.log("pause custom events READY: waiting")
        const testModeComponentTransition = parseFloat(getComputedStyle(document.getElementById("configMenu").shadowRoot.host).getPropertyValue("--fastTransition"))

        document.addEventListener("testMode", async (e) => {
            const event = Object.entries(e.detail)[0][0]
            const value = Object.entries(e.detail)[0][1]

            console.log(event, value)

            if (event === "activeTestMode") {
                component.pause.state = value

                const configComponent = document.getElementById("configMenu").shadowRoot
                configComponent.dispatchEvent(new CustomEvent("testMode", { detail: { state: value } }))
                await new Promise(resolve => setTimeout(resolve, testModeComponentTransition))
                configComponent.dispatchEvent(new CustomEvent("testMode", { detail: { rangeValue: 0 } }))
                await ifaceLogic.expandInfoPauseBox(value)
                ifaceLogic.pauseTimer(lastAutoPauseEvent, 0)
            }

            if (event === "autoPause") {
                ifaceLogic.applyAutoPause(lastAutoPauseEvent, value, component)
            }
        })
    }

    loadViewsEvents()
    loadMenuEvents()
    loadPauseEvents()
}
