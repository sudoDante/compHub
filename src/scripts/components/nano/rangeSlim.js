import * as element from "../../modules/elements.js"

export class rangeSlim extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = element.add(this.dom, "div", null, "container")
        this.container.innerHTML += `
            <span class="title"></span>
            <div class="fakeThumb"></div>
            <div class="rangeBox">
                <input type="range" class="range">
                <span class="valueBox"></span>
            </div> 
        `

        const style = element.add(this.dom, "style", null, null)
        style.textContent += `
            :host {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            .container {
                --transition: 200ms;

                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: 100%;
                height: 40px;
                margin-bottom: 20px;

                &:hover .title {
                    text-indent: 8px;
                    color: var(--enphasisColor)
                }

                &:hover .fakeThumb {
                    background-color: var(--enphasisColor);
                }

                .title {
                    position: absolute;
                    top: -4px;
                    display: flex;
                    width: 100%;
                    height: fit-content;
                    font-family: var(--fontFamily1);
                    font-size: var(--fontSize);
                    font-style: italic;
                    color: var(--fontColor);  
                    transition: var(--transition); 
                }

                .fakeThumb {
                    position: absolute;
                    bottom: 4px;
                    width: 40px;
                    height: 4px;
                    border-radius: 10px;
                    background-color: var(--trackColor);
                    transition: background-color var(--transition); 
                }

                .rangeBox {
                    position: absolute;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    height: 100%;

                    .range {
                        -webkit-appearance: none;
                        appearance: none;
                        position: relative;
                        bottom: -1px;
                        width: calc(100% - 44px);
                        height: 100%;
                        background-color: transparent;
                        cursor: pointer;
                        margin: 0; /* reset for browsers */

                        &::-moz-range-track {
                            background-color: var(--trackColor);
                            height: 1px;
                        }

                        &::-moz-range-progress {
                            background-color: var(--progressColor);
                            height: 3px;
                            border-radius: 4px;
                            transition: var(--transition);
                        }

                        &::-moz-range-thumb {
                            opacity: 0;
                        }
                    }

                    .valueBox {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 30px;
                        height: 100%;
                        color: var(--fontColor);  
                        font-family: var(--fontFamily2);
                        font-size: 14px;
                        font-style: italic; 
                        transition: var(--transition);
                    }
                }
            }
        `
    }
    connectedCallback() {

        const getConfig = () => {
            const fontFamily1 = this.getAttribute("fontFamily1") || "initial"
            const fontFamily2 = this.getAttribute("fontFamily2") || "initial"
            const fontSize = this.getAttribute("fontSize") || "initial"
            const fontColor = this.getAttribute("fontColor") || "red"
            const trackColor = this.getAttribute("trackColor") || "red"
            const progressColor = this.getAttribute("progressColor") || "red"
            const enphasisColor = this.getAttribute("enphasisColor") || "red"
            const title = this.getAttribute("title") || "empty title"
            const min = this.getAttribute("min") || 0
            const max = this.getAttribute("max") || 100
            const value = this.getAttribute("value") || min
            const eventItem = this.getAttribute("eventItem") || this
            const eventName = this.getAttribute("eventName") || this

            return {
                css: {
                    "fontFamily1": fontFamily1,
                    "fontFamily2": fontFamily2,
                    "fontSize": fontSize,
                    "fontColor": fontColor,
                    "trackColor": trackColor,
                    "progressColor": progressColor,
                    "enphasisColor": enphasisColor,
                },
                logic: {
                    "title": title,
                    "min": Number(min),
                    "max": Number(max),
                    "value": Number(value),
                    "eventItem": eventItem,
                    "eventName": eventName
                }
            }
        }

        const applyConfCss = (config) => {
            Object.entries(config).forEach(([key, value]) => {
                this.style.setProperty(`--${key}`, value)
            })
            return config
        }

        const applyLogicConf = (config, input) => {
            Object.entries(config).forEach(([key, value]) => {
                input.setAttribute(key, value)
            })
        }

        const applyInfoValue = (range, valueBox) => {
            valueBox.textContent = range.value
        }

        const applyPosition = (item, fake, copyWidth) => {
            const left = ((item.value - item.min) / (item.max - item.min)) * (copyWidth - fake.offsetWidth)
            fake.style.left = `${left}px `
        }

        const main = async () => {
            const title = this.dom.querySelector(".title")
            const input = this.dom.querySelector(".range")
            const rangeWidth = input.offsetWidth
            const valueBox = this.dom.querySelector(".valueBox")
            const fakeThumb = this.dom.querySelector(".fakeThumb")
            const config = getConfig()
            title.textContent = config.logic.title

            applyConfCss(config.css)
            applyLogicConf(config.logic, input)
            applyInfoValue(input, valueBox)
            applyPosition(input, fakeThumb, rangeWidth)

            input.addEventListener("input", (e) => {
                applyInfoValue(input, valueBox)
                applyPosition(e.target, fakeThumb, rangeWidth)
                valueBox.style.color = "var(--enphasisColor)"
                valueBox.style.color = "var(--fontColor)"

                this.eventDom.dispatchEvent(new CustomEvent(this.eventName, { detail: { [this.eventItem]: Number(input.value) } }))
            })
        }

        main()
    }
}
customElements.define("range-slim", rangeSlim)