import * as iface from "./interface.js"

const main = async () => {
    import("./controlCustomEvents.js")
/*     import("./viewControls.js")
 */
    const leftAside = document.getElementById("leftAside")
    const componentBox = document.getElementById("componentBox")
    const main = document.getElementsByTagName("main")[0]

    iface.loadMenu(leftAside)
    iface.loadControls(main)
}

main()