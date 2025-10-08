import * as element from "../../modules/elements.js"

export class rangeSlim extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = element.add(this.dom, "div", null, "container")
        this.container.innerHTML = `
            <span class="title"></span>
            <div class="fakeThumb"></div>
            <div class="rangeBox">
                <input type="range" class="range">
                <span class="valueBox"></span>
            </div> 
        `

        const style = element.add(this.dom, "style", null, null)
        style.textContent = `
            .container {
                --transition: 200ms;

                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: 100%;
                height: 50px;
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
                    top: 2px;
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
                    bottom: 10px;
                    width: 24px;
                    height: 5px;
                    border-radius: 2px;
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
                        width: calc(100% - 40px);
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
                            transition: var(--transition);
                            box-shadow: 0 0 2px var(--enphasisColor);
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
                        height: 30px;
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
            const title = this.getAttribute("title") ? this.getAttribute("title") : "empty title"
            const fontFamily1 = this.getAttribute("fontFamily1") ? this.getAttribute("fontFamily1") : "initial"
            const fontFamily2 = this.getAttribute("fontFamily2") ? this.getAttribute("fontFamily2") : "initial"
            const fontSize = this.getAttribute("fontSize") ? this.getAttribute("fontSize") : "initial"
            const fontColor = this.getAttribute("fontColor") ? this.getAttribute("fontColor") : "red"
            const trackColor = this.getAttribute("trackColor") ? this.getAttribute("trackColor") : "red"
            const progressColor = this.getAttribute("progressColor") ? this.getAttribute("progressColor") : "red"
            const enphasisColor = this.getAttribute("enphasisColor") ? this.getAttribute("enphasisColor") : "red"

            const steps = this.getAttribute("steps") ? this.getAttribute("steps") : 1
            const min = this.getAttribute("min") ? this.getAttribute("min") : 0
            const max = this.getAttribute("max") ? this.getAttribute("max") : 100
            const value = this.getAttribute("value") ? this.getAttribute("value") : min

            return {
                css: {
                    "fontFamily1": fontFamily1,
                    "fontFamily2": fontFamily2,
                    "fontSize": fontSize,
                    "fontColor": fontColor,
                    "trackColor": trackColor,
                    "progressColor": progressColor,
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

        const applyPosition = (item, fake, copyWidth) => {
            const left = ((item.value - item.min) / (item.max - item.min)) * (copyWidth - fake.offsetWidth)
            fake.style.left = `${left}px `
        }

        const main = async () => {
            const title = this.dom.querySelector(".title")
            const range = this.dom.querySelector(".range")
            const rangeWidth = range.offsetWidth
            const valueBox = this.dom.querySelector(".valueBox")
            const fakeThumb = this.dom.querySelector(".fakeThumb")
            const config = getConfig()
            title.textContent = config.logic.title

            applyConfCss(config.css)
            applyRangeConf(config.logic, range)
            applyInfoValue(range, valueBox)

            range.addEventListener("input", (e) => {
                applyInfoValue(range, valueBox)
                applyPosition(e.target, fakeThumb, rangeWidth)
                valueBox.style.color = "var(--progressColor)"
            })

            range.addEventListener("mouseup", () => {
                valueBox.style.color = "var(--fontColor)"
            })
        }

        main()
    }
}
customElements.define("range-slim", rangeSlim)