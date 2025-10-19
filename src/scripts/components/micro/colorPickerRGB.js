import * as element from "../../modules/elements.js"

export class colorPickerRGB extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = element.add(this.dom, "div", null, "container")
        this.container.innerHTML = `
            <div class="titleBox">
                <span class="title">Color
                    <span class="open material-symbols-outlined">expand_more</span>
                </span>
                <div class="color"></div>
            </div>
            <div class="pickerBox relative">
                <div class="pickerPointer absolute"></div>
            </div>
            <div class="rangeBox relative">
                <div class="rgb absolute"></div>
                <span class="pointer absolute"></span> 
                <input id="rangeHue" class="hiddenInput absolute" type="range" min=0 max=255 value=128> 
            </div>
        `

        element.add(this.dom, "link", null, null, {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap"
        })

        const style = element.add(this.dom, "style", null, null)
        style.textContent = `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            :host {
                display: flex;
                width: 100%;
                height: 200px;
            }

            .relative { position: relative; }
            .absolute { position: absolute; }

            .container {
                width: 100%;
                height: 100%;
                border: 1px solid red;

                .titleBox {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    height: 30px;
                
                    .title {
                        display: flex;
                        align-items: center;
                        font-family: var(--fontFamily);
                        font-size: var(--fontSize);
                        color: var(--fontColor);
                        font-style: italic;
                        width: fit-content;
                        height: 100%;

                        .open {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 30px;
                            aspect-ratio: 1/1;
                            margin-left: 10px;
                            font-size: 24px;
                            color: var(--fontColor);
                        }
                    }

                    .color {
                        height: 30px;
                        aspect-ratio: 1/1;
                        border-radius: 4px;
                        border: 1px solid grey;
                    }
                }

                .pickerBox {
                    width: 100%;
                    height: 100px;
                    border-radius: 4px;
                    border: 1px solid red;
                    margin-top: 10px;

                    .pickerPointer {
                        width: 20px;
                        aspect-ratio: 1/1;
                        border: 2px solid blue;
                    }
                }

                .rangeBox {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 30px;
                    margin-top: 10px;
                    border-radius: 2px;
                    border: 1px solid red;

                    .rgb {
                        width: 100%; 
                        height: 6px;
                        background: linear-gradient(
                            to right,
                            rgb(255, 0, 0), 
                            rgb(255, 255, 0),
                            rgb(0, 255, 0),
                            rgb(0, 255, 255),
                            rgb(0, 0, 255),
                            rgb(255, 0, 255),
                            rgba(255, 0, 0, 1));
                    }

                    .pointer {
                        display: flex;
                        width: 30px;
                        height: 100%;
                        background-color: white;
                    }

                    .hiddenInput {
                        appearance: none;
                        background: none;
                        width: 100%;
                        height: 100%;
                        cursor: pointer;
                    }
                }
            }
        `
    }

    connectedCallback() {

        const getConfig = () => {
            const fontFamily = this.getAttribute("fontFamily") || "initial"
            const fontSize = this.getAttribute("fontSize") || "initial"
            const fontColor = this.getAttribute("fontColor") || "red"
            const title = this.getAttribute("title") || "empty title"
            const event = this.getAttribute("event") || this

            return {
                css: {
                    "fontFamily": fontFamily,
                    "fontSize": fontSize,
                    "fontColor": fontColor
                },
                logic: {
                    "title": title,
                    "event": event
                }
            }
        }

        const applyConfCss = (config) => {
            Object.entries(config).forEach(([key, value]) => {
                this.style.setProperty(`--${key}`, value)
            })
            return config
        }

        const movePointer = (target, hsla) => {
            const pointer = target.parentElement.querySelector(".pointer")
            const newLeft = Math.round((target.value / target.max) * (target.offsetWidth - pointer.offsetWidth)) + "px"
            pointer.style.left = newLeft

            if (target.id === "rangeHue") hsla.hue = Math.round((target.value / target.max) * 360)
        }

        const colorizedColorBox = (hsla) => {
            const colorBox = this.dom.querySelector(".pickerBox")
            const hueColor = `hsl(${hsla.hue}, 100%, 50%)`
            const horizontal = `linear-gradient(to right, white, ${hueColor})`
            const vertical = `linear-gradient(to bottom, transparent, black)`
            colorBox.style.background = `${vertical}, ${horizontal}`
            console.log(colorBox)
        }

        const movePickerPointer = (hsla) => {
            const box = this.dom.querySelector(".pickerBox")
            const pointer = this.dom.querySelector(".pickerPointer")
            const pw = pointer.offsetWidth
            const ph = pointer.offsetHeight
            let dragging = false

            const updatePointer = (e) => {
                const rect = box.getBoundingClientRect()
                let cursorX = e.clientX - rect.left
                let cursorY = e.clientY - rect.top
                cursorX = Math.max(0, Math.min(rect.width, cursorX))
                cursorY = Math.max(0, Math.min(rect.height, cursorY))

                const topLight = 100 - (cursorX / rect.width) * 50
                const newLight = Math.round(topLight * (1 - cursorY / rect.height))
                const pointerX = Math.max(0, Math.min(rect.width - pw, cursorX - pw / 2))
                const pointerY = Math.max(0, Math.min(rect.height - ph, cursorY - ph / 2))
                pointer.style.left = `${pointerX}px`
                pointer.style.top = `${pointerY}px`

                const newSat = Math.round((cursorX / rect.width) * 100)
                hsla.sat = newSat
                hsla.light = newLight
                colorized(hsla)
            }

            box.addEventListener("mousedown", (e) => {
                dragging = true
                updatePointer(e)
            })

            window.addEventListener("mousemove", (e) => { if (dragging) updatePointer(e) })
            window.addEventListener("mouseup", () => dragging = false)
        }

        const colorized = (hsla) => {
            const color = this.dom.querySelector(".color")
            color.style.backgroundColor = `hsla(${hsla.hue}, ${hsla.sat}%, ${hsla.light}%, ${hsla.alpha})`
            console.log(getComputedStyle(color).backgroundColor)
        }

        const main = () => {
            
            const config = getConfig()
            applyConfCss(config.css)
            const ranges = Array.from(this.dom.querySelectorAll("input[type='range']"))
            let hsla = { /* rgb browser conversion at customEvent */
                hue: 128,
                sat: 100,
                light: 50,
                alpha: 1
            }

            movePointer(ranges[0], hsla)
            colorizedColorBox(hsla)
            movePickerPointer(hsla)

            ranges.forEach(range => {
                range.addEventListener("input", (e) => {
                    movePointer(e.target, hsla)
                    colorizedColorBox(hsla)

                })
            })
        }

        main()
    }
}

customElements.define("color-picker-rgb", colorPickerRGB)