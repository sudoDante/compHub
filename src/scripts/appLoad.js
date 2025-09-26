import * as iface from "./interface.js"

const main = async () => {
    import("./controlCustomEvents.js")
    import("./viewControls.js")

    const leftAside = document.getElementById("leftAside")
    const componentBox = document.getElementById("componentBox")

    iface.loadMenu(leftAside)
}

main()