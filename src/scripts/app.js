import * as elements from "./modules/elements.js"
import { components } from "./../config/components.js"

const loadMenu = async () => {
    const container = document.querySelector(".leftAside")
    components.forEach((item, num) => {
        const newOpt = elements.create(container, "label", null, "option hiddenInput center borderR4")
        const title = elements.create(newOpt, "span")
        title.textContent = item.name

        const radio = elements.create(newOpt, "input", null, null, { type: "radio", name: "opt"})
        if (num === 0) radio.checked = true
    })
}

const main = async () => {
    loadMenu()
}

main()