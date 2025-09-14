import * as elements from "./modules/elements.js"
import { components } from "./../config/components.js"

const loadMenuList = async (menuContainer) => {
    const titleBox = elements.create(menuContainer, "div", null, "menuTitleBox center darkCrystal")
    const title = elements.create(titleBox, "span", null, "menuTitle center")
    title.textContent = "Component types"
    const menu = elements.create(menuContainer, "div", null, "menu relative darkCrystal")

    components.forEach((item, num) => {

        Object.entries(item).forEach(([key, value]) => {
            const menuOption = elements.create(menu, "label", null, "option center")
            const titleBox = elements.create(menuOption, "span", null, "titleBox")
            const expand = elements.create(titleBox, "div", null, "expand")
            elements.create(expand, "div", null, "rotate")
            const title = elements.create(titleBox, "div", null, "title")
            title.textContent = value.name
            const radio = elements.create(menuOption, "input", null, null, { type: "radio", name: "opt", pos: num })

            elements.create(menu, "hr", null, "bar")
            if (num === 0) radio.checked = true
        })
    })

    const closeMenu = elements.create(menuContainer, "div", null, "closeMenu relative center")
    const icon = elements.create(closeMenu, "div", null, "icon absolute material-symbols-outlined")
    icon.textContent = "menu"
    const closeCheck = elements.create(closeMenu, "input", null, "closeCheck hiddenInput", { type: "checkbox" })
}

const setListeners = async (menuContainer) => {
    const componentContainer = document.body.querySelector("main")

    Array.from(menuContainer.querySelectorAll(".option")).forEach((item, num) => {
        item.addEventListener("change", async () => {
            const path = Object.values(components[num])[0].path
            const tag = Object.values(components[num])[0].tag

            await elements.create(document.body, "script", null, null, { type: "module", src: path })
            componentContainer.innerHTML = ""
            await new Promise(resolve => setTimeout(resolve, 200)) // wait for option selected transition
            elements.create(componentContainer, tag, null, null)
        })

        // falta guardar los eventos
    })
}

const loadComponentOptions = async (optionsContainer) => {
    console.log(optionsContainer)
}

const main = async () => {
    let menuEvents = []
    const menuContainer = document.getElementById("leftAside")
    await loadMenuList(menuContainer)
    setListeners(menuContainer)

    const optionsContainer = document.getElementById("rightAside")
    const menuComponentOptions = await loadComponentOptions(optionsContainer)
}

main()