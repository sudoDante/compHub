import * as element from "../../modules/elements.js"
import { colorRange } from "../nano/colorRange.js"

export class colorPicker extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = element.add(this.dom, "div", null, "container")
        this.container.innerHTML = `
            <div id="inputBox" class="inputBox">

            </div>

            <div class="pickerBox">
                <div class="rangesBox"></div>
                <div class="paletteBox"></div>
            </div>
        `

        const style = element.add(this.dom, "style", null, null)
        style.textContent = `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            :host {
                width: 100%;
                height: 100%;
            }

            .container {
                display: flex;
                justify-content: space-between;
                width: 100%;
                height: 100%;
                background-color: var(--backColor);
                border-radius: 4px;
                padding: 10px;
                box-shadow: var(--boxShadow);

                .inputBox {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 40px;
                    height: 100%;
                    border-radius: 4px;
                    overFlow: hidden;
                }

                .pickerBox {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    width: calc(100% - 50px);
                    height: 100%;

                    .rangesBox {
                        width: 100%;
                        height: calc(100% - 40px);
                        border: 1px solid red;
                    }

                    .paletteBox {
                        width: 100%;
                        height: 30px;
                        border: 1px solid red;
                    }
                }
            }
        `
    }

    connectedCallback() {
        const getConfig = () => {
            const backColor = this.getAttribute("backColor") || "red"
            const boxShadow = this.getAttribute("boxShadow") || "inset 2px 2px 6px rgb(58, 58, 58)"

            return {
                css: {
                    "backColor": backColor,
                    "boxShadow": boxShadow,
                }
            }
        }

        const applyConfCss = (css) => {
            this.style.setProperty("--backColor", css.backColor)
            this.style.setProperty("--boxShadow", css.boxShadow)
        }

        const loadComponents = async (box, componentTag, id, componentConf) => {
            return element.add(box, componentTag, id, null, componentConf)
        }

        const loadListeners = () => {
            this.addEventListener("user", (e) => {
                console.log(e.detail)
            })
        }


        const main = async () => {
            const inputBox = this.dom.getElementById("inputBox")
            const config = getConfig()

            const confRangeTone = {
                "backColor": "green",
                "rotate": "-90deg",
                "mode": "tone",
                "id": this.id,
                "event": "user"
            }

            applyConfCss(config.css)
            loadListeners()

            const rangeTone = await loadComponents(inputBox, "color-range", "pickerTone", confRangeTone)
        }

        main()
    }
}
customElements.define("color-picker", colorPicker)