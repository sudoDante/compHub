import * as element from "../../modules/elements.js"

export class switchSlim extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = element.add(this.dom, "div", null, "container")
        this.container.innerHTML = `
            <div class="radioBox">
                <span id="on" class="text"></span>
                <span id="off" class="text"></span>
                <div class="slice"></div> 
            </div>
            <span class="title"></span>
            <input type="checkbox" class="hiddenInput">
        `

        const style = element.add(this.dom, "style", null, null)
        style.textContent = `
            * {
                margin: 0;
                padding: 0;
                border-box: box-sizing;
            }

            :host {
                width: fit-content;
                height: 18px;

                --transition: 200ms;
            }

            .container {
                position: relative;
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: fit-content;
                height: 18px;
                margin-bottom: 20px;

                &:has(.hiddenInput:checked) .radioBox {
                    .on {color: var(--enphasisColor);}
                    .slice {
                        left: calc(100% - 20px);
                        background-color: var(--trueColor);
                        animation: var(--transition) test forwards ease-out;
                    }
                }  

                .radioBox {
                    position: relative;
                    display: flex;
                    align-items: center;
                    width: 50px;
                    height: 100%;
                    border-radius: 11px;
                    outline: 2px solid var(--backColor);

                    .text {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 50%;
                        height: 100%;
                        color: transparent;
                        font-family: var(--fontFamily2);
                        font-size: 13px;
                        transition: var(--transition);
                    }
                    
                    .slice {
                        position: absolute;
                        left: 4px;
                        height: 12px;
                        aspect-ratio: 1/1;
                        border-radius: 50%;
                        background-color: var(--falseColor);
                        transition: var(--transition);
                    }
                }

                .title {
                    display: flex;
                    width: fit-content;
                    height: 100%;
                    font-family: var(--fontFamily1);
                    font-size: var(--fontSize);
                    font-style: italic;
                    margin-left: 10px;
                    color: var(--fontColor);
                }

                .hiddenInput {
                    position: absolute;
                    top: 0;
                    appearance: none;
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                    cursor: pointer;
                }
            }
        `
        this.eventDom = document
        this.eventItem = this
        this.eventName = this
    }

    connectedCallback() {

        const getConfig = () => {
            const title = this.getAttribute("title") || "empty title"
            const fontFamily1 = this.getAttribute("fontFamily1") || "initial"
            const fontFamily2 = this.getAttribute("fontFamily2") || "initial"
            const fontSize = this.getAttribute("fontSize") || "initial"
            const fontColor = this.getAttribute("fontColor") || "red"
            const enphasisColor = this.getAttribute("enphasisColor") || "red"
            const backColor = this.getAttribute("backColor") || "red"
            const trueText = this.getAttribute("trueText") || "On"
            const falseText = this.getAttribute("falseText") || "Off"
            const trueColor = this.getAttribute("trueColor") || "red"
            const falseColor = this.getAttribute("falseColor") || "red"
            const value = this.getAttribute("value") || true

            return {
                css: {
                    "fontFamily1": fontFamily1,
                    "fontFamily2": fontFamily2,
                    "fontSize": fontSize,
                    "fontColor": fontColor,
                    "enphasisColor": enphasisColor,
                    "backColor": backColor,
                    "trueColor": trueColor,
                    "falseColor": falseColor
                },
                logic: {
                    "title": title,
                    "trueText": trueText,
                    "falseText": falseText,
                    "checked": value,
                }
            }
        }

        const applyConfCss = (config) => {
            Object.entries(config).forEach(([key, value]) => {
                this.style.setProperty(`--${key}`, value)
            })
            return config
        }

        const changeText = (input, array) => {
            array[0].style.color = input.checked ? "var(--enphasisColor)" : "transparent"
            array[1].style.color = input.checked ? "transparent" : "var(--enphasisColor)"
        }

        const main = () => {
            const title = this.dom.querySelector(".title")
            const input = this.dom.querySelector("input")
            const on = this.dom.getElementById("on")
            const off = this.dom.getElementById("off")
            const config = getConfig()
            const transition = parseFloat(getComputedStyle(this).getPropertyValue("--transition"))

            if (config.logic.checked === "true") input.checked = true

            applyConfCss(config.css)
            title.textContent = config.logic.title
            on.textContent = config.logic.trueText
            off.textContent = config.logic.falseText
            changeText(input, [on, off])

            if (config.css.fontFamily2 === "material symbols outlined") {
                on.style.fontSize = "16px"
                off.style.fontSize = "16px"
            }

            input.addEventListener("change", async () => {
                changeText(input, [on, off])
                await new Promise(resolve => setTimeout(resolve, transition))
                this.eventDom.dispatchEvent(new CustomEvent(this.eventName, { detail: input.checked }))
            })
        }
        main()
    }
}
customElements.define("switch-slim", switchSlim)