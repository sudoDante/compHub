import * as element from "../../modules/elements.js"

export class colorPicker extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = element.add(this.dom, "div", null, "container")
        this.container.innerHTML = `
            <div class="inputBox">
                <div class="fakeInput"></div>
                <div class="pointer"></div>
                <input id="pickerSelector" type="range" min=0 max=255 value=128>
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

/*             :host {
                width: 100%;
                height: 180px;
            }
 */
            .container {
                display: flex;
                justify-content: space-between;
                width: 100%;
                height: 180px;
                background-color: var(--backColor);
                border-radius: 4px;
                padding: 10px;
                box-shadow: var(--boxShadow);
                border: 10px solid red;

                .inputBox {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 40px;
                    height: 100%;
                    border-radius: 4px;
                    overFlow: hidden;

                    .fakeInput {
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(180deg,rgba(255, 255, 255, 1) 0%, rgba(255, 50, 50, 1) 50%, rgba(20, 0, 0, 1) 100%);
                        border-radius: 4px;
                        border: 1px solid grey;
                    }

                    .pointer {
                        position: absolute;
                        display: flex;
                        align-items: center;
                        width: 100%;
                        height: 20px;
                        border: 1px solid rgba(255, 255, 255, 0.5);
                        border-radius: 4px;
                        box-shadow: 0 0 8px rgb(28, 28, 28);
                    }

                    input {
                        appearance: none;
                        position: absolute;
                        width: var(--fakeInputHeight);
                        height: 60px;
                        transform: rotate(-90deg);
                        background-color: transparent;

                        &::-moz-range-thumb {
                            background: none;
                            border: none;
                        }
                    }
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
            const rotate = this.getAttribute("rotate") || "inset 2px 2px 6px rgb(58, 58, 58)"

            return {
                css: {
                    "backColor": backColor,
                    "rotate": rotate,
                }
            }
        }

        const applyConfCss = (css) => {
            this.style.setProperty("--backColor", css.backColor)
            this.style.setProperty("--rotate", css.rotate)
        }

        const verticalRangeStyle = async () => {
            this.style.setProperty("--fakeInputHeight", `${this.dom.querySelector(".fakeInput").offsetHeight}px`)
        }

        const movePointer = (value, pointer, pointerHeight, fakeHeight) => {
            const relativeTop = Math.round((1 - value / 255) * (fakeHeight - pointerHeight))
            pointer.style.top = `${relativeTop}px`
        }

        const main = async () => {
            const pickerSelector = this.dom.getElementById("pickerSelector")
            const fakeInputHeight = this.dom.querySelector(".fakeInput").offsetHeight
            const pointer = this.dom.querySelector(".pointer")

            const config = await getConfig()
            await applyConfCss(config.css)
            await verticalRangeStyle()

            pickerSelector.addEventListener("input", (e) => {
                movePointer(e.target.value, pointer, pointer.offsetHeight, fakeInputHeight)
            })
        }

        main()
    }
}
customElements.define("color-picker", colorPicker)