import { componentsConfig } from "./../config/componentsConfig.js"
import * as element from "./modules/elements.js"

export const loadComponent = async (par) => {
    const container = identifyBoxes("inactive")
    const url = par.url
    const tag = par.htmlTag
    const name = par.defaultName
    await import(url)
    const component = await element.add(container, tag, name, name)
    return component
}

const pauseAtLoad = async (pauseState) => {
    if (pauseState) {
        console.log("esperando")
        await new Promise(resolve => {
            document.addEventListener("componentLoad", (e) => {
                const component = e.detail
                component.pause.state = true
                console.log("pausa por estado anterior")
                resolve()
            }, { once: true })
        })
    }
}

export const newLoadSequence = async (par, time, pauseState, lastAutoPauseEvent = null) => {
    let oldPauseTimer
    if (pauseState && lastAutoPauseEvent) { oldPauseTimer = lastAutoPauseEvent.value; pauseTimer(lastAutoPauseEvent, 0) }
    await new Promise(resolve => setTimeout(resolve, parseFloat(time)))
    moveHalo(parseFloat(time))
    await moveMask(parseFloat(time))
    if (!lastAutoPauseEvent) pauseAtLoad(pauseState)
    const component = await loadComponent(par)
    if (pauseState && lastAutoPauseEvent) { pauseTimer(lastAutoPauseEvent, oldPauseTimer) }
    return component
} /* DONT TOUCH */

export const applyBacksRestart = () => {
    const restartBackImage = document.getElementById("restartBackImage")

    restartBackImage.addEventListener("click", () => {
        const imageInputSelected = Array.from(document.querySelectorAll("input[name='backImage']")).find(item => item.checked === true)
        if (imageInputSelected) imageInputSelected.checked = false
    })
}

export const changeView = async (view) => {
    const inactiveBox = identifyBoxes("inactive")
    inactiveBox.innerHTML = ""
    const widthBox = window.innerWidth
    const heightBox = window.innerHeight
    const componentBoxContainer = document.getElementById("componentBoxContainer")
    const pauseBox = document.getElementById("pauseBox")
    if (pauseBox) console.log(pauseBox)

    if (view === "computerView") {
        componentBoxContainer.style.height = `${heightBox}px`
        componentBoxContainer.style.width = `${widthBox}px`
        componentBoxContainer.style.borderRadius = "0px"
        if (pauseBox) {
            pauseBox.className = ""
            pauseBox.className = "pauseBoxInactive absolute computerView"
        }
    }
    if (view === "tabletView") {
        componentBoxContainer.style.height = `${heightBox * 0.8}px`
        componentBoxContainer.style.width = `${16 / 9 * (0.8 * heightBox)}px`
        componentBoxContainer.style.borderRadius = "16px"
        if (pauseBox) {
            pauseBox.className = ""
            pauseBox.className = "pauseBoxInactive absolute tabletView"
        }
    }
    if (view === "mobileView") {
        componentBoxContainer.style.height = `${heightBox * 0.8}px`
        componentBoxContainer.style.width = `${9 / 16 * (0.8 * heightBox)}px`
        componentBoxContainer.style.borderRadius = "16px"
        if (pauseBox) {
            pauseBox.className = ""
            pauseBox.className = "pauseBoxInactive absolute mobileView"
        }
    }
}

export const identifyBoxes = (par) => {
    const componentBoxes = Array.from(document.querySelectorAll(".componentBox"))
    return componentBoxes.find(item => item.classList.contains(par))
}

export const drawInfo = async (par) => {
    const infoTitlesBox = document.getElementById("infoTitlesBox")
    const infoFamily = document.getElementById("infoFamily")
    const infoName = document.getElementById("infoName")
    const family = par.type
    const delay = par.time
    const name = par.defaultName
    infoFamily.textContent = ""
    infoName.textContent = ""
    infoName.textContent = name.toUpperCase()
    infoFamily.textContent = family
    infoTitlesBox.style.clipPath = "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)"
    
    await new Promise(resolve => { setTimeout(resolve, delay) }) /* <-- ATTENTION LIST TRANSITIONS DELAY. BETTER PERFORMANCE */
}

export const clearInfo = async () => {
    const infoTitlesBox = document.getElementById("infoTitlesBox")
    const transition = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--infoTransition"))
    infoTitlesBox.style.transition = transition
    infoTitlesBox.style.clipPath = "polygon(0 0, 0 0, 0 100%, 0% 100%)"
    infoTitlesBox.style.transition = transition
    
    await new Promise(resolve => { setTimeout(resolve, transition) }) /* <-- ATTENTION LIST TRANSITIONS DELAY. BETTER PERFORMANCE */
}

export const moveHalo = async (time) => {
    const line = document.getElementById("line")
    line.style.opacity = 1
    line.style.boxShadow = "0 0 14px cyan, 0 0 10px cyan"
    line.style.transition = time
    line.style.top = "100%"
    await new Promise(resolve => setTimeout(resolve, time))
    line.style.top = 0
    line.style.opacity = 0
}

export const moveMask = async (time) => {
    const active = identifyBoxes("active")
    const inactive = identifyBoxes("inactive")

    active.classList.add("maskOpen")
    inactive.classList.replace("maskOpen", "maskClose")
    await new Promise(resolve => setTimeout(resolve, time))
    inactive.classList.remove("maskClose")
    inactive.innerHTML = ""

    active.classList.replace("active", "inactive")
    inactive.classList.replace("inactive", "active")
}

export const movePanel = async (par, side) => {
    const rightPanelBox = document.getElementById("rightPanelBox")
    const leftPanelBox = document.getElementById("leftPanelBox")
    const panelBox = side === "left" ? leftPanelBox : rightPanelBox

    if (side === "right") {
        panelBox.style.right = par === true ? `-${panelBox.offsetWidth}px` : 0
    }
    if (side === "left") {
        panelBox.style.left = par === true ? `-${panelBox.offsetWidth}px` : 0
    }
}

export const importConfig = async (par) => {
    const componentTag = par.htmlTag
    const confJson = componentsConfig
    const componentConf = Object.values(confJson).find(item => item.tag === componentTag)
    return componentConf.config
}

export const expandInfoPauseBox = (boolean) => {
    const infoPauseBox = document.getElementById("infoPauseBox")
    infoPauseBox.style.width = boolean ? "54px" : 0
}

export const placeTabletView = (boolean) => {
    const componentBoxContainer = document.getElementById("componentBoxContainer")
    componentBoxContainer.style.left = boolean ? "-100px" : 0
}

export const changePanelsWidth = (boolean) => {
    const inputCloseLeft = document.getElementById("listMenu").shadowRoot.getElementById("closeMenuInput")

    if (boolean) {
        inputCloseLeft.checked = false
        inputCloseLeft.dispatchEvent(new Event("change"))
    } else {
        inputCloseLeft.checked = true
        inputCloseLeft.dispatchEvent(new Event("change"))
    }
}

export const pauseTimer = async (lastAutoPauseEvent, value, component) => {
    const icon = document.getElementById("infoPauseIcon")
    const timer = document.getElementById("infoPauseTimer")
    let countDown = value
    lastAutoPauseEvent.value = value

    timer.classList.replace("toIcon", "toNumber")
    timer.textContent = countDown

    if (value === 0) {
        timer.classList.replace("toNumber", "toIcon")
        timer.textContent = "pause_circle"
        icon.textContent = ""
        return
    }

    const loop = () => {
        icon.textContent = "play_pause"
        timer.classList.replace("toIcon", "toNumber")

        if (countDown > 0) { timer.textContent = countDown }
        else {
            timer.classList.replace("toNumber", "toIcon")
            timer.textContent = "pause_circle"
            icon.textContent = ""
        }
        countDown -= 1
    }

    for (let i = countDown; i >= 0; i--) {
        loop()
        if (i === 0) return true
        await new Promise(resolve => { setTimeout(resolve, 1000) })
        if (value !== lastAutoPauseEvent.value) return
    }
}

export const applyAutoPause = async (lastEvent, value, component) => {
    component.pause.state = false
    const timer = await pauseTimer(lastEvent, value)
    if (timer === true) component.pause.state = true
}

const changeAutoPause = (value) => {
    const autoPauseRange = configMenu.shadowRoot.getElementById("pauseInput")
    autoPauseRange.applyRangeValue(value)
    autoPauseRange.applyInfoValue(value)
    autoPauseRange.applyPosition(value)
}

export const resetPauseControl = async (lastAutoPauseEvent, boolean) => {
    const pauseMode = document.getElementById("testMode")
    const configMenu = document.getElementById("configMenu")
    const menuTransition = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--barsTransition"))

    if (pauseMode && pauseMode.shadowRoot) {
        /* switch */
        expandInfoPauseBox(false)
        const input = pauseMode.shadowRoot.querySelector("input")
        input.checked = false
        /* autoPauseBox */
        await new Promise(resolve => setTimeout(resolve, menuTransition))
        configMenu.autoPauseVisible.state = false
        /* timer */
        pauseTimer(lastAutoPauseEvent, 0)
        changeAutoPause(0)
    }
}