import * as element from "./modules/elements.js"
import { components } from "../config/components.js"

// importacion manual
import { listMenu } from "./components/appSpecific/listMenu.js"


const main = async () => {
    import("./controlCustomEvents.js")
    import("./viewControls.js")
    
    const leftAside = document.getElementById("leftAside")

    document.addEventListener("listMenu_primary", async (e) => {
        const pos = Number(e.detail.pos)
        const delay = Number(`${parseFloat(e.detail.time) + 60}`)
        console.log(pos, delay)

    })
    const typesMenu = element.add(leftAside, "list-menu", null, "listMenu", { "list": components, title: "Components by type", close: true, button: "fall" })

}

main()