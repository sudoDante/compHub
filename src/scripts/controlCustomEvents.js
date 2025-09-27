import { componentsConfig } from "../config/componentsConfig.js"
import * as component from "./component.js"
import * as iface from "./interface.js"

console.log("Custom events control READY: waiting")

// COMPONENTS MENU
let componentInfo
const componentBox = document.getElementById("componentBox")
const info = document.getElementById("info")
const configBox = document.getElementById("rightAside")

document.addEventListener("selectionMenu", async (e) => {
    componentInfo = e.detail
    await iface.loadInfo(componentInfo, info)
    /* inyectar animacion de cambio para la salida del componente */
    await iface.loadConfig(componentInfo, componentBox)
    component.load(componentInfo, componentBox)
})

/* evento para cargar componente de configuracion especifico */

document.addEventListener("viewChange", (e) => {
    componentInfo ? component.load(componentInfo, componentBox) : null
})