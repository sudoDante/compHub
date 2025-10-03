import * as element from "./../../modules/elements.js"

export class rangeSlim extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = element.add(this.dom, "div", null, "container")
        this.container.innerHTML = `
            <span class="title"></span>
            <div class="rangeBox">
                <input type="range" class="range">
                <span class="valueBox"></span>
            </div> 
        `

        const style = element.add(this.dom, "style", null, null)
        style.textContent = `
            .container {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: 100%;
                height: 50px;
                margin-bottom: 30px;

                .title {
                    display: flex;
                    width: fit-content;
                    height: fit-content;
                    font-family: var(--fontFamily);
                    font-size: var(--fontSize); 
                    color: var(--fontColor);   
                }

                .rangeBox {
                    position: relative;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    height: 30px;

                    .range {
                        -webkit-appearance: none;
                        appearance: none;
                        position: relative;
                        bottom: -1px;
                        width: calc(100% - 68px);
                        height: 30px;
                        background-color: transparent;
                        cursor: pointer;

                        &::-moz-range-track {
                            background-color: var(--trackColor);
                            height: 1px;
                        }

                        &::-moz-range-progress {
                            background-color: var(--progressColor);
                            height: 2px;
                        }

                        &::-moz-range-thumb {
                            width: 12px;
                            height: 12px;
                            background-color: red;
                            border: none;
                            border-radius: 50%;
                            background-color: var(--thumbColor);
                        }
                    }

                    .valueBox {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 30px;
                        height: 30px;
                        color: grey;
                        font-family: var(--fontFamily);
                        font-style: italic; 
                    }
                }
            }
        `
    }
    connectedCallback() {

        const getConfig = () => {
            const title = this.getAttribute("title") ? this.getAttribute("title") : "empty title"
            const fontFamily = this.getAttribute("fontFamily") ? this.getAttribute("fontFamily") : "initial"
            const fontSize = this.getAttribute("fontSize") ? this.getAttribute("fontSize") : "initial"
            const fontColor = this.getAttribute("fontColor") ? this.getAttribute("fontColor") : "initial"
            const trackColor = this.getAttribute("trackColor") ? this.getAttribute("trackColor") : "red"
            const progressColor = this.getAttribute("progressColor") ? this.getAttribute("progressColor") : "red"
            const thumbColor = this.getAttribute("thumbColor") ? this.getAttribute("thumbColor") : "red"
            const enphasisColor = this.getAttribute("enphasisColor") ? this.getAttribute("enphasisColor") : "red"

            const steps = this.getAttribute("steps") ? this.getAttribute("steps") : 1
            const min = this.getAttribute("min") ? this.getAttribute("min") : 0
            const max = this.getAttribute("max") ? this.getAttribute("max") : 100
            const value = this.getAttribute("value") ? this.getAttribute("value") : min

            return {
                css: {
                    "fontFamily": fontFamily,
                    "fontSize": fontSize,
                    "fontColor": fontColor,
                    "trackColor": trackColor,
                    "progressColor": progressColor,
                    "thumbColor": thumbColor,
                    "enphasisColor": enphasisColor
                },
                logic: {
                    "title": title,
                    "steps": Number(steps),
                    "min": Number(min),
                    "max": Number(max),
                    "value": Number(value)
                }
            }
        }

        const applyConfCss = (config) => {
            Object.entries(config).forEach(([key, value]) => {
                this.style.setProperty(`--${key}`, value)
            })
            return config
        }

        const applyRangeConf = (config, range) => {
            Object.entries(config).forEach(([key, value]) => {
                range.setAttribute(key, value)
            })
        }

        const applyInfoValue = (range, valueBox) => {
            valueBox.textContent = range.value
        }

        const colorizeValue = async (item, par, color) => {
            if (par === true) {
                item.style.transition = "0s"
                item.style.transform = "scale(140%)"
                item.style.color = color
            } else {
                item.style.transition = "1400ms ease-in-out"
                item.style.transform = "scale(100%)"
                item.style.color = "grey"
            }
        }

        const main = async () => {
            const title = this.dom.querySelector(".title")
            const range = this.dom.querySelector(".range")
            const valueBox = this.dom.querySelector(".valueBox")
            const config = getConfig()
            title.textContent = config.logic.title

            applyConfCss(config.css)
            applyRangeConf(config.logic, range)
            applyInfoValue(range, valueBox)

            range.addEventListener("input", () => {
                colorizeValue(valueBox, true, config.css.enphasisColor)
                applyInfoValue(range, valueBox)
            })

            range.addEventListener("mouseup", () => colorizeValue(valueBox, false))
        }

        main()
    }
}
customElements.define("range-slim", rangeSlim)