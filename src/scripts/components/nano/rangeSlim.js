import * as element from "../../modules/elements.js"

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
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: 100%;
                height: 50px;
                margin-bottom: 20px;

                &:hover .title {
                    color: var(--progressColor);
                }

                .title {
                    position: absolute;
                    top: 6px;
                    display: flex;
                    width: 100%;
                    height: fit-content;
                    font-family: var(--fontFamily);
                    font-size: var(--fontSize);
                    font-style: italic;
                    color: var(--trackColor);  
                    transition: 200ms; 
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
                        width: calc(100% - 40px);
                        height: 100%;
                        background-color: transparent;
                        cursor: pointer;

                        &::-moz-range-track {
                            background-color: var(--trackColor);
                            height: 1px;
                        }

                        &::-moz-range-progress {
                            background-color: var(--enphasisColor);
                            height: 1px;
                            transition: 200ms;
                        }

                        &::-moz-range-thumb {
                            top: 40px;
                            width: 30px;
                            height: 20px;
                            border: none;
                            border-radius: 0;
                            background-color: var(--trackColor);
                            clip-path: polygon(0 76%, 100% 76%, 100% 100%, 0% 100%);
                        }
                    }

                    .valueBox {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 30px;
                        height: 30px;
                        color: var(--trackColor);
                        font-family: var(--fontFamily);
                        font-size: 14px;
                        font-style: italic; 
                        transition: 200ms;
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
            const fontColor = this.getAttribute("fontColor") ? this.getAttribute("fontColor") : "red"
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

        const main = async () => {
            const title = this.dom.querySelector(".title")
            const range = this.dom.querySelector(".range")
            const valueBox = this.dom.querySelector(".valueBox")
            const config = getConfig()
            console.log(config)
            title.textContent = config.logic.title

            applyConfCss(config.css)
            applyRangeConf(config.logic, range)
            applyInfoValue(range, valueBox)

            range.addEventListener("input", () => {
                applyInfoValue(range, valueBox)
                valueBox.style.color = "var(--enphasisColor)"
            })

            range.addEventListener("mouseup", () => {
                valueBox.style.color = "var(--trackColor)"
            })
        }

        main()
    }
}
customElements.define("range-slim", rangeSlim)