import * as element from "../../modules/elements.js"

export class colorRange extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = element.add(this.dom, "div", null, "container")
        this.container.innerHTML = `
            <div class="pointer"></div>
            <input id="pickerSelector" type="range" min=0 max=255 value=128>
        `

        const style = element.add(this.dom, "style", null, null)
        style.textContent = `
            * {
                margin: 0;
                padding:0;
                box-sizing: border-box;
            }

            :host {
                display: flex;
                width: 100%;
                height: 100%;
            }

            .container {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                border: 1px solid grey;
                border-radius: 4px;

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
                    transform: rotate(var(--rotate));
                    background-color: transparent;

                    &::-moz-range-thumb {
                        background: none;
                        border: none;
                    }
                }
            }
        `
    }

    static get observedAttributes() { return ["backColor"] }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "backColor") this.style.setProperty("--backColor", newValue)
    }

    connectedCallback() {
        const getConfig = () => {
            const backColor = this.getAttribute("backColor") || "red"
            const rotate = this.getAttribute("rotate") || 0
            const mode = this.getAttribute("mode") || "normal"
            const id = this.getAttribute("id") || document
            const event = this.getAttribute("event") || "normal"

            return {
                css: {
                    "backColor": backColor,
                    "rotate": rotate
                },
                logic: {
                    "mode": mode,
                    "id": id,
                    "event": event
                }
            }
        }

        const applyConfCss = (css) => {
            Object.entries(css).forEach(([key, value]) => { this.style.setProperty(`--${key}`, value) })
        }

        const movePointer = (value, pointer, pointerHeight, fakeHeight) => {
            const relativeTop = Math.round((1 - value / 255) * (fakeHeight - pointerHeight))
            pointer.style.top = `${relativeTop}px`
        }

        const applyConfLogic = (logic) => {
            if (logic.mode === "normal") this.container.style.background = "var(--backColor)"

            if (logic.mode === "tone") this.container.style.background = `
                    linear-gradient(
                    180deg,
                    rgba(255, 255, 255, 1) 0%,
                    var(--backColor) 50%,
                    rgba(20, 0, 0, 1) 100%)
                `
        }

        const main = async () => {
            const containerHeight = this.container.offsetHeight
            const pointer = this.dom.querySelector(".pointer")
            const config = getConfig()

            applyConfCss(config.css)
            applyConfLogic(config.logic)

            const input = this.dom.querySelector("input")
            input.addEventListener("input", (e) => {
                movePointer(e.target.value, pointer, pointer.offsetHeight, containerHeight)
                document.getElementById(config.logic.id).dispatchEvent(new CustomEvent(config.logic.event, {
                    detail: {
                        item: config.logic.mode,
                        value: e.target.value
                    }
                }))
            })
        }

        main()
    }
}

customElements.define("color-range", colorRange)