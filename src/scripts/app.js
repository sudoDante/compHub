import * as element from "./modules/elements.js"
import { listMenu } from "./components/appSpecific/listMenu.js"
import { components } from "./../config/components.js"


const main = async () => {
    const leftAside = document.getElementById("leftAside")
    const listTypes = components.map(item => item.type)

    document.addEventListener("listMenu_primary", (e) => {
        const pos = Number(e.detail.pos)
        const delay = `${parseFloat(e.detail.time) + 60}ms`
        console.log(pos, delay)

        // funcion de borrado del contenedor y creacion del nuevo componente
    })
    const typesMenu = element.add(leftAside, "list-menu", null, "listMenu", {"list": listTypes})

}

main()