import * as event from "./modules/customEvents.js"

const normal = document.getElementById("normalView")
const fullscreen = document.getElementById("fullscreenView")
const tablet = document.getElementById("tabletView")
const mobile = document.getElementById("mobileView")
const componentBox = document.getElementById("componentBox")
const backsForm = document.getElementById("backsControlBox")
/* backsForm.reset()
 */
const changeView = async (view) => {
    componentBox.innerHTML = ""
    const widthBox = document.body.offsetWidth
    const heightBox = document.body.offsetHeight

    if (view === "computerView") {
        componentBox.style.height = `${heightBox}px`
        componentBox.style.width = `${widthBox}px`
        componentBox.style.borderRadius = "none"
    }
    if (view === "tabletView") {
        componentBox.style.height = `${heightBox * 0.8}px`
        componentBox.style.width = `${16 / 9 * (0.8 * heightBox)}px`
        componentBox.style.borderRadius = "16px"
    }
    if (view === "mobileView") {
        componentBox.style.height = `${heightBox * 0.8}px`
        componentBox.style.width = `${9 / 16 * (0.8 * heightBox)}px`
        componentBox.style.borderRadius = "8px"
    }
    componentBox.addEventListener("transitionend", () => { event.send(document, "viewChange", { detail: view }) }, { once: true })
}

normal.addEventListener("change", () => {
    changeView("computerView")
})

tablet.addEventListener("change", () => {
    changeView("tabletView")
})

mobile.addEventListener("change", () => {
    changeView("mobileView")
})

fullscreen.addEventListener("change", (e) => {
    if (e.target.checked) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
})


