import * as insert from "./modules/insert.js"
import { components } from "./../config/components.js"

const loadMenu = async () => {
    const container = document.querySelector(".leftAside")
    components.forEach(async (item, num) => {
        const newOpt = await insert.create(container, "label", null, "option hiddenInput center borderR4")
        const title = await insert.create(newOpt, "span")
        title.textContent = item.name

        const radio = await insert.create(newOpt, "input", null, null, { type: "radio", name: "opt"})
        if (num === 0) radio.checked = true
    })
}

const main = async () => {
    loadMenu()
}

main()