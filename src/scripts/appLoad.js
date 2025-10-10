import * as iface from "./interface.js"
import * as ifaceLogic from "./interfaceLogic.js"
import * as events from "./eventsControl.js"
import { appConfig } from "./../config/config.js"

const main = async () => {

    const leftPanelBox = document.getElementById("leftPanelBox")
    const rightPanelBox = document.getElementById("rightPanelBox")
/*     const componentBox = document.getElementById("componentBox")
 */    const main = document.getElementsByTagName("main")[0]

    /* main menu */
    await import("./components/appSpecific/listMenu.js")
    iface.loadMenu(leftPanelBox)
    /* config menu */
    const configMenu = await iface.loadPanelConfig(rightPanelBox)
    configMenu.style.display = "none"
    /* main bars */
    await iface.loadControls(main)
    await iface.loadInfoArea(main, appConfig.testMode)
    /* events controls bar */
    ifaceLogic.applyBacksRestart()
    events.loadInterfaceEvents()
    /* mode test auto */
    ifaceLogic.checkTestMode() === "true" ? ifaceLogic.testMode() : null
}

main()