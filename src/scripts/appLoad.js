import * as iface from "./interface.js"
import * as ifaceLogic from "./interfaceLogic.js"
import * as events from "./eventsControl.js"

const main = async () => {

    const leftAside = document.getElementById("leftAside")
    const componentBox = document.getElementById("componentBox")
    const main = document.getElementsByTagName("main")[0]

    /* main menu */
    await import("./components/appSpecific/listMenu.js")
    iface.loadMenu(leftAside)
    /* hiddensInputs */
    iface.loadHiddenInputs(main)
    /* main bars */
    await iface.loadControls(main)
    await iface.loadInfoArea(main)

    /* events */
    ifaceLogic.applyBacksRestart()
    ifaceLogic.applyViewsEvents()
    events.loadMenuEvents()
}

main()