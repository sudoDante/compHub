import * as iface from "./interface.js"
import * as ifaceLogic from "./interfaceLogic.js"
import * as events from "./eventsControl.js"

const main = async () => {
    const leftPanelBox = document.getElementById("leftPanelBox")
    const rightPanelBox = document.getElementById("rightPanelBox")
    const main = document.getElementsByTagName("main")[0]

    /* main menu */
    await import("./components/appSpecific/listMenu.js")
    iface.loadMenu(leftPanelBox)

    /* config menu */
    const configMenu = await iface.loadPanelConfig(rightPanelBox)

    /* main bars */
    await iface.loadControls(main)
    await iface.loadColorSelector(main)
    await iface.loadInfoArea(main)

    /* events controls bar */
    ifaceLogic.applyBacksRestart()
    events.loadInterfaceEvents()

}

main()