import * as event from "./modules/customEvents.js"
import { componentsConfig } from "./../config/componentsConfig.js"
import * as element from "./modules/elements.js"

export const loadComponent = async (par) => {
    const container = identifyBoxes("active")
    const url = par.url
    const tag = par.htmlTag
    const name = par.defaultName
    await import(url)
    const component = await element.add(container, tag, name, name)
    return component
}

export const applyBacksRestart = () => {
    const restartBackImage = document.getElementById("restartBackImage")

    restartBackImage.addEventListener("click", () => {
        const imageInputSelected = Array.from(document.querySelectorAll("input[name='backImage']")).find(item => item.checked === true)
        if (imageInputSelected) imageInputSelected.checked = false
    })
}

export const changeView = async (view, fullscreen) => {
    console.log(fullscreen)

    const inactiveBox = identifyBoxes("inactive")
    inactiveBox.innerHTML = ""
    const widthBox = window.innerWidth
    const heightBox = window.innerHeight
    const componentBoxContainer = document.getElementById("componentBoxContainer")

    if (view === "computerView") {
        componentBoxContainer.style.height = `${heightBox}px`
        componentBoxContainer.style.width = `${widthBox}px`
        componentBoxContainer.style.borderRadius = "0px"
    }
    if (view === "tabletView") {
        componentBoxContainer.style.height = `${heightBox * 0.8}px`
        componentBoxContainer.style.width = `${16 / 9 * (0.8 * heightBox)}px`
        componentBoxContainer.style.borderRadius = "16px"
    }
    if (view === "mobileView") {
        componentBoxContainer.style.height = `${heightBox * 0.8}px`
        componentBoxContainer.style.width = `${9 / 16 * (0.8 * heightBox)}px`
        componentBoxContainer.style.borderRadius = "16px"
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
    const configClose = document.getElementById("configMenu").shadowRoot.querySelector("#closeButton")
    const menuClose = document.getElementById("configMenu").shadowRoot.querySelector("#closeInput")
    const closeButton = side === "right" ? configClose : menuClose

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

export const componentPause = async (component) => {
    component.setAttribute("pause", "")
}

export const checkTestMode = () => {
    return localStorage.getItem("testMode")
}

export const testMode = () => {
        document.dispatchEvent(new CustomEvent("selectionMenu", {
        detail: {
            type: "Background",
            defaultName: "test",
            url: "/src/scripts/components/_backgrounds/emptyTest.js",
            htmlTag: "empty-test",
            time: 400
        }
    }))
}