import * as events from "./modules/customEvents.js"
import * as ifaceLogic from "./interfaceLogic.js"
import * as iface from "./interface.js"

export const loadInterfaceEvents = () => {
    const main = document.querySelector("main")
    const configMenu = document.getElementById("configMenu")
    const componentLoadTransition = getComputedStyle(document.documentElement).getPropertyValue("--componentLoad")
    const pauseModeSwitchBox = document.getElementById("pauseModeSwitchBox")
    const configBox = document.getElementById("configMenu").shadowRoot.getElementById("configBox")

    let view = "computerView"
    let fullMode = false
    let eventDetail
    let component
    let pause = false
    let lastAutoPauseEvent = { value: 0 }
    let autoPauseTime

    const loadMenuEvents = async () => {
        console.log("menu custom events READY: waiting")

        document.addEventListener("selectionMenu", async (e) => {
            eventDetail = e.detail
            pause = false
            ifaceLogic.resetPauseControl(lastAutoPauseEvent, false)

            const importedConfig = await ifaceLogic.importConfig(eventDetail)
            ifaceLogic.movePanel(true, "right")
            if (configBox.children.length > 0) await ifaceLogic.clearInfo()
            await ifaceLogic.drawInfo(eventDetail)
            events.send(configMenu.shadowRoot, "loadConfig", { detail: importedConfig })

            component = await ifaceLogic.newLoadSequence(eventDetail, componentLoadTransition, pause)
        })

        document.addEventListener("configLoaded", (e) => {
            ifaceLogic.movePanel(false, "right")
            if (pauseModeSwitchBox.children.length === 0) iface.loadTestModeBox(pauseModeSwitchBox)
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
            eventDetail ? component = await ifaceLogic.newLoadSequence(eventDetail, componentLoadTransition, pause, lastAutoPauseEvent) : null
            ifaceLogic.applyAutoPause(lastAutoPauseEvent, autoPauseTime, component)
        })

        tablet.addEventListener("change", async () => {
            view = "tabletView"
            await ifaceLogic.changeView("tabletView")
            if (fullMode === true) {
                ifaceLogic.changePanelsWidth(true)
                ifaceLogic.placeTabletView(fullMode)
            }
            eventDetail ? component = await ifaceLogic.newLoadSequence(eventDetail, componentLoadTransition, pause, lastAutoPauseEvent) : null
            ifaceLogic.applyAutoPause(lastAutoPauseEvent, autoPauseTime, component)
        })

        mobile.addEventListener("change", async () => {
            view = "mobileView"
            await ifaceLogic.changeView("mobileView")
            ifaceLogic.placeTabletView(false)
            ifaceLogic.changePanelsWidth(false)
            eventDetail ? component = await ifaceLogic.newLoadSequence(eventDetail, componentLoadTransition, pause, lastAutoPauseEvent) : null
            ifaceLogic.applyAutoPause(lastAutoPauseEvent, autoPauseTime, component)
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
            eventDetail ? component = await ifaceLogic.newLoadSequence(eventDetail, componentLoadTransition, pause, lastAutoPauseEvent) : null
            ifaceLogic.applyAutoPause(lastAutoPauseEvent, autoPauseTime, component)
        })
    }

    const loadPauseEvents = async () => {
        console.log("pause custom events READY: waiting")

        document.addEventListener("pauseMode", async (e) => {
            pause = e.detail
            component.pause.state = e.detail
            const transition = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fastTransition"))

            if (e.detail) {
                ifaceLogic.expandInfoPauseBox(true)
                await new Promise(resolve => setTimeout(resolve, transition))
                configMenu.autoPauseVisible.state = true
            } else {
                await ifaceLogic.expandInfoPauseBox(false)
                await new Promise(resolve => setTimeout(resolve, transition))
                configMenu.autoPauseVisible.state = false
            }
        })

        document.addEventListener("autoPause", (e) => {
            autoPauseTime = e.detail
            ifaceLogic.applyAutoPause(lastAutoPauseEvent, autoPauseTime, component)
       })
    }

    loadViewsEvents()
    loadMenuEvents()
    loadPauseEvents()
}
