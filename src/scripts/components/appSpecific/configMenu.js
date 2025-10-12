import * as element from "../../modules/elements.js"

export class configMenu extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = element.add(this.dom, "div", null, "container")
        this.container.innerHTML = `
            <div id="configBox" class="configBox"></div>
            <div class="closeBox">
                <span class="icon material-symbols-outlined">page_info</span>
                <input id="closeInput" class="hiddenInput" type="checkbox">
            </div>
        `

        element.add(this.dom, "link", null, null, {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap"
        })

        const style = element.add(this.dom, "style", null, null)
        style.textContent += `
            * {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
            }

            :host {
                width: 100%;
                height: 100%;
            }

            .container {
                position: relative;
                width: 100%;
                height: 100%;
                background-color: var(--backColor);
                transition: var(--transition);

                .configBox {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                    padding: 20px;
                    overflow-Y: auto;

                    .section {
                    margin-bottom: 30px;

                        .titleBox {
                            display: flex;
                            font-family: var(--fontFamily);
                            font-size: var(--fontSize);
                            color: var(--fontColor); 
                            margin-bottom: 28px; 
                        }
                    }
                }

                .closeBox {
                    position: absolute;
                    left: calc(-1 * var(--buttonSize) - 10px);
                    display: none;
                    opacity: 0;
                    top: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: var(--buttonSize);
                    aspect-ratio: 1/1;
                    background-color: var(--backColor);
                    border-radius: 4px;
                    transition: var(--transition);

                    .icon {
                        color: whitesmoke;
                        font-size: 22px;
                        transition: var(--transition);
                        color: grey;
                        font-size: 20px;
                    }

                    .hiddenInput { 
                        position: absolute; 
                        width: 100%;
                        height: 100%;
                        z-index: 10; 
                        appearance: none; 
                        cursor: pointer; 
                    }

                    &:has(input:not(:checked)) {
                        top: calc(100% - var(--buttonSize) - 10px);
                    }
                }
            }
        `
    }

    connectedCallback() {
        const getConfig = () => {
            const backColor = this.getAttribute("back") || "red"
            const buttonSize = this.getAttribute("buttonSize") || "30px"
            const transition = this.getAttribute("transition") || "0s"
            const fontFamily = this.getAttribute("fontFamily") || "initial"
            const fontColor = this.getAttribute("fontColor") || "initial"
            const fontSize = this.getAttribute("fontSize") || "initial"

            return {
                css: {
                    "backColor": backColor,
                    "buttonSize": buttonSize,
                    "transition": transition,
                    "fontFamily": fontFamily,
                    "fontColor": fontColor,
                    "fontSize": fontSize
                }
            }
        }

        const applyConfCss = (css) => {
            this.style.setProperty("--backColor", css.backColor)
            this.style.setProperty("--buttonSize", css.buttonSize)
            this.style.setProperty("--transition", css.transition)
            this.style.setProperty("--fontFamily", css.fontFamily)
            this.style.setProperty("--fontColor", css.fontColor)
            this.style.setProperty("--fontSize", css.fontSize)
        }

        const controlMenuDisplay = (input) => {
            const hostContainer = this.parentElement
            hostContainer.style.right = input.checked ? 0 : `${hostContainer.offsetWidth * -1}px`
        }

        const drawConfig = async (config) => {
            const configBox = this.dom.getElementById("configBox")
            configBox.innerHTML = ""

            for (const obj of config.detail) {
                const section = element.add(configBox, "div", null, "section")
                const titleBox = element.add(section, "span", null, "titleBox")
                titleBox.textContent = obj.title

                const configObject = obj.items
                for (const item of configObject) {

                    if (item.type === "range") {
                        await import("../nano/rangeSlim.js")
                        element.add(section, "range-slim", null, null, {
                            "title": item.label,
                            "min": item.min,
                            "max": item.max,
                            "value": item.value,
                            "fontFamily1": "Nunito Sans",
                            "fontFamily2": "Anta",
                            "fontSize": "13px",
                            "fontColor": "rgba(129, 129, 129, 1)",
                            "enphasisColor": "rgba(174, 232, 240, 0.76)",
                            "trackColor": "rgba(80, 80, 80, 1)",
                            "progressColor": "rgba(200, 200, 200, 1)",
                            "event": item.event
                        })
                    }

                    if (item.type === "switch") {
                        await import("../nano/switchSlim.js")
                        element.add(section, "switch-slim", null, null, {
                            "title": item.label,
                            "fontColor": "rgba(129, 129, 129, 1)",
                            "enphasisColor": "rgba(174, 232, 240, 0.76)",
                            "fontFamily1": "Nunito Sans",
                            "fontFamily2": "Anta",
                            "fontSize": "13px",
                            "backColor": "rgba(53, 53, 53, 1)",
                            "trueText": "V",
                            "falseText": "H",
                            "trueColor": "whitesmoke",
                            "falseColor": "whitesmoke",
                            "value": item.value,
                            "event": item.event
                        })
                    }
                }
            }
        }

        const main = async () => {
            const closeButton = this.dom.querySelector("#closeInput")
            closeButton.checked = true
            const closeBox = this.dom.querySelector(".closeBox")

            const conf = await getConfig()
            applyConfCss(conf.css)

            closeButton.addEventListener("change", (e) => controlMenuDisplay(e.target))
            this.dom.addEventListener("loadConfig", async (e) => {
                await drawConfig(e.detail)
                document.dispatchEvent(new Event("configLoaded"))
                closeBox.style.display = "flex"
                closeBox.style.opacity = 1
            })
        }

        this.dom.addEventListener("DOMContentLoaded", main())
    }
}
customElements.define("config-menu", configMenu)