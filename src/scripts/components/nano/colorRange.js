import * as element from "../../modules/elements.js"

export class colorRange extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = element.add(this.dom, "div", null, "container")
        this.container.innerHTML = `
            <div class="pointer"></div>
            <input type="range">
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
                border-radius: 4px;
                box-shadow: inset 2px 2px 4px rgba(65, 65, 65, 1);
                filter: grayscale(30%);
                overflow: hidden;

                .pointer {
                    position: absolute;
                    display: flex;
                    align-items: center;
                    height: 100%;                    
                    aspect-ratio: 1.4/1;
                    border-radius: 2px;
                    box-shadow: 0 0 12px rgb(28, 28, 28), inset 0 0 6px white;
                }

                input {
                    appearance: none;
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background-color: transparent;

                    &::-moz-range-thumb {
                        background: none;
                        border: none;
                    }
                }
            }
        `
    }

    static get observedAttributes() { return ["backcolor"] }
    attributeChangedCallback(name, oldValue, newValue) {

        if (name === "backcolor") {
            this.style.setProperty("--backColor", newValue)
            console.log(newValue)
        }
    }

    connectedCallback() {
        const getConfig = () => {
            const backColor = this.getAttribute("backColor") || "red"
            const rotate = this.getAttribute("rotate") || 0
            const min = this.getAttribute("min") || 0
            const max = this.getAttribute("max") || 100
            const value = this.getAttribute("value") || 0
            const mode = this.getAttribute("mode") || "normal"
            const dom = this.getAttribute("dom") || document
            const orientation = this.getAttribute("orientation") || "normal"
            const event = this.getAttribute("event") || "normal"

            return {
                css: {
                    "backColor": backColor,
                    "rotate": rotate
                },
                logic: {
                    "mode": mode,
                    "min": min,
                    "max": max,
                    "value": value,
                    "dom": dom,
                    "orientation": orientation,
                    "event": event
                }
            }
        }

        const applyConfCss = (css) => {
            Object.entries(css).forEach(([key, value]) => { this.style.setProperty(`--${key}`, value) })
        }

        const movePointer = (logic, value, pointer) => {
            const containerWidth = this.container.offsetWidth
            const pointerWidth = pointer.offsetWidth
            const containerHeight = this.container.offsetHeight
            const pointerHeight = pointer.offsetHeight


            const relativeLeft = Math.round((value / logic.max) * (containerWidth - pointerWidth))
            pointer.style.left = relativeLeft + "px"

/*             if (logic.orientation === "normal") {
                const relativeLeft = Math.round((value / logic.max) * (containerWidth - pointerWidth))
                pointer.style.left = relativeLeft + "px"
            }

            if (logic.orientation === "inverted") {
                const relativeTop = Math.round((value / logic.max) * (containerHeight - pointerHeight))
                pointer.style.top = relativeTop + "px"
            }
 */        }

        const applyRangeValues = (input, logic) => {
            input.min = logic.min
            input.max = logic.max
            input.value = logic.value
        }

        /*         const applyOrientation = (input, pointer, logic) => {
                    if (logic.orientation === "normal") {
                        pointer.style.width = "14px"
                        pointer.style.height = "100%"
                    }
        
                    if (logic.orientation === "inverted") {
                        pointer.style.width = "100%"
                        pointer.style.height = "14px"
                        input.style.transform = "rotate(90deg)"
                        input.style.width = this.container.offsetHeight + "px" // inverted rotate 
                        input.style.height = "100%" // inverted rotate
                    }
                }
         */
        const applyConfLogic = (logic) => {
/*             const deg = logic.orientation === "inverted" ? "90deg" : "180deg"
 */
            if (logic.mode === "color") this.container.style.background = "var(--backColor)"

            if (logic.mode === "tone") {
                this.container.style.background = `
                    linear-gradient(
                    to right,
                    rgb(20, 0, 0) 0%,
                    var(--backColor) 50%,
                    rgb(255, 255, 255) 100%
                `
            }                    


            if (logic.mode === "alpha") {
                this.container.style.background = `
                    linear-gradient(
                    to right,
                    var(--backColor),
                    var(--backColor)
                `

            }
        }

        const main = async () => {
            const pointer = this.dom.querySelector(".pointer")
            const input = this.dom.querySelector("input")
            const config = getConfig()

            applyConfCss(config.css)
            applyConfLogic(config.logic)
/*             applyOrientation(input, pointer, config.logic)
 */            applyRangeValues(input, config.logic)
            movePointer(config.logic, config.logic.value, pointer)

            input.addEventListener("input", (e) => {
                movePointer(config.logic, e.target.value, pointer)

                document.getElementById(config.logic.dom).dispatchEvent(new CustomEvent(config.logic.event, {
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