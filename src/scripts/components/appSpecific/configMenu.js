import * as element from "../../modules/elements.js"
import { switchSlim } from "../nano/switchSlim.js"
import { rangeSlim } from "../nano/rangeSlim.js"
import { colorPickerRGB } from "../micro/colorPickerRGB.js"

export class configMenu extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = element.add(this.dom, "div", null, "container")
        this.container.innerHTML = `
            <div class="testModeBox">
                <span class="titleTest"></span>
            </div>
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

                --testBoxHeight: 100px;
                --fastTransition: 300ms ease-in-out;
            }

            .container {
                position: relative;
                width: 100%;
                height: 100%;
                transition: var(--transition);

                .testModeBox {
                    position: relative;
                    top: calc(-1 * var(--testBoxHeight));
                    width: 100%;
                    height: var(--testBoxHeight);
                    padding: 10px 20px 0 20px;
                    background: linear-gradient(90deg,rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%); 
                    backdrop-filter: blur(4px);
                    overflow: hidden;
                    transition: var(--fastTransition);

                    .iconBack {
                        position: absolute;
                        top: -10px;
                        left: -40px;
                        width: 100%;
                        height: 100%;
                        font-family: material symbols outlined;
                        font-size: 200px;
                        color: rgba(0, 0, 0, 0.11);
                        filter: blur(4px);
                    }

                    .titleTest {
                        display: flex;
                        justify-content: right;
                        width: 100%;
                        font-family: var(--fontFamily);
                        font-size: calc(var(--fontSize) * 1.2);
                        font-weight: bolder:
                        letter-spacing: 4px;
                        color: rgba(40, 40, 40, 1); 
                        margin-bottom: 14px; 
                    }

                    .pauseInput {
                        position: relative;
                        z-index: 10;
                    }
                }


                .configBox {
                    position: relative;
                    top: calc(-1 * var(--testBoxHeight));
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                    padding: 20px;
                    background-color: var(--backColor);
                    overflow-Y: auto;
                    backdrop-filter: blur(4px);
                    transition: var(--fastTransition);

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

        this.autoPauseVisible = new Proxy({ state: false }, {
            set: (target, prop, value) => {
                target[prop] = value

                if (prop === "state") this.moveTestBox(value)
                return true
            }
        })
    }

    moveTestBox = (boolean) => {
        const testModeBox = this.dom.querySelector(".testModeBox")
        const configBox = this.dom.querySelector(".configBox")
        const testBoxHeight = parseFloat(getComputedStyle(this).getPropertyValue("--testBoxHeight"))

        if (boolean) {
            testModeBox.style.top = 0
            configBox.style.top = 0
        } else {
            testModeBox.style.top = `${testBoxHeight * -1}px`
            configBox.style.top = `${testBoxHeight * -1}px`
        }
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

        const drawTestMode = async () => {
            const testModeBox = this.dom.querySelector(".testModeBox")
            const iconBack = element.add(testModeBox, "div", null, "iconBack")
            iconBack.textContent = "timer_pause"
            testModeBox.querySelector(".titleTest").textContent = "Pause Mode"
            const range = await element.add(testModeBox, "range-slim", "pauseInput", "pauseInput", {
                "title": "Auto-pause",
                "min": 0,
                "max": 30,
                "value": 0,
                "fontFamily1": "Nunito Sans",
                "fontFamily2": "Anta",
                "fontSize": "13px",
                "fontColor": "rgba(85, 85, 85, 1)",
                "enphasisColor": "rgba(40, 40, 40, 1)",
                "trackColor": "rgba(85, 85, 85, 1)",
                "progressColor": "rgba(40, 40, 40, 1)",
                "eventItem": "autoPause",
                "eventName": "pause"
            }, {
                eventDom: document,
                eventName: "autoPause"
            })
        }

        const drawConfig = async (config, container) => {
            container.innerHTML = ""

            for (const obj of config.detail) {
                const section = element.add(container, "div", null, "section")

                const titleBox = element.add(section, "span", null, "titleBox")
                titleBox.textContent = obj.title

                const configObject = obj.items
                for (const item of configObject) {

                    if (item.type === "range") {
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
                            "eventName": "config",
                            "eventItem": item.event
                        })
                    }

                    if (item.type === "switch") {
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
                            "eventName": "config",
                            "eventItem": item.event
                        })
                    }

                    if (item.type === "colorPickerRGB") {
                        const color = await element.add(section, "color-picker-rgb", null, null, {
                            "title": item.label,
                            "fontColor": "rgba(129, 129, 129, 1)",
                            "fontFamily": "Anta",
                            "fontSize": "13px",
                            "color": "rgba(126, 240, 132, 1)",
                            "eventName": "config",
                            "eventItem": item.event
                        }, {
                            eventDom: document
                        })
                    }
                }
            }
        }

        const main = async () => {
            const closeButton = this.dom.querySelector("#closeInput")
            closeButton.checked = true
            const closeBox = this.dom.querySelector(".closeBox")
            const configBox = this.dom.getElementById("configBox")


            const conf = await getConfig()
            applyConfCss(conf.css)

            closeButton.addEventListener("change", (e) => controlMenuDisplay(e.target))
            this.dom.addEventListener("loadConfig", async (e) => {
                await drawTestMode()
                await drawConfig(e.detail, configBox)
                document.dispatchEvent(new Event("configLoaded"))
                closeBox.style.display = "flex"
                closeBox.style.opacity = 1
            })

            this.dom.addEventListener("testMode", (e) => {
                Object.entries(e.detail).forEach(([key, value]) => {
                    if (key === "rangeValue") {
                        const rangeInput = this.dom.getElementById("pauseInput")
                        rangeInput.applyRangeValue(value)
                        rangeInput.applyInfoValue()
                        rangeInput.applyPosition()
                    }
                })
            })
        }

        this.dom.addEventListener("DOMContentLoaded", main())
    }
}
customElements.define("config-menu", configMenu)