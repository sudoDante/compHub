import * as elements from "./modules/elements.js"
import { components } from "./../config/components.js"

const loadMenu = async (menuContainer) => {
    const menu = elements.create(menuContainer, "div", null, "menu relative")

    components.forEach((item, num) => {
        Object.entries(item).forEach(([key, value]) => {
            const menuOption = elements.create(menu, "label", null, "option center")
            const titleBox = elements.create(menuOption, "span", null, "titleBox")
            const expansor = elements.create(titleBox, "div", null, "expansor")
            const title = elements.create(titleBox, "div", null, "title")
            title.textContent = value.name


            const radio = elements.create(menuOption, "input", null, null, { type: "radio", name: "opt", pos: num })

            if (num === 0) radio.checked = true
        })
    })

    const hiddenBox = elements.create(menuContainer, "div", null, "hiddenBox relative")
    const closeMenu = elements.create(hiddenBox, "div", null, "closeMenu relative center")
    const icon = elements.create(closeMenu, "div", null, "icon absolute material-symbols-outlined")
    icon.textContent = "menu"
    const closeCheck = elements.create(closeMenu, "input", null, "closeCheck hiddenInput", { type: "checkbox" })
}

const setListeners = (menuContainer) => {
    const componentContainer = document.body.querySelector("main")

    Array.from(menuContainer.querySelectorAll(".option")).forEach((item, num) => {
        item.addEventListener("click", async () => {
            const path = Object.values(components[num])[0].path
            const tag = Object.values(components[num])[0].tag
            await elements.create(document.body, "script", null, null, {type: "module", src: path})
            componentContainer.innerHTML = ""
            elements.create(componentContainer, tag, null, null)
        })
    })
}

const main = async () => {
    const menuContainer = document.querySelector(".leftAside")
    await loadMenu(menuContainer)
    setListeners(menuContainer)
}

main()