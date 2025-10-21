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
            const color = this.getAttribute("color") || false
            const event = this.getAttribute("event") || this

            return {
                css: {
                    "fontFamily": fontFamily,
                    "fontSize": fontSize,
                    "fontColor": fontColor
                },
                logic: {
                    "title": title,
                    "color": color,
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

        const colorizedPicker = (hsla) => {
            const colorBox = this.dom.querySelector(".pickerBox")
            const hueColor = `hsl(${hsla.hue}, 100%, 50%)`
            const horizontal = `linear-gradient(to right, white, ${hueColor})`
            const vertical = `linear-gradient(to bottom, transparent, black)`
            colorBox.style.background = `${vertical}, ${horizontal}`
        }

        const movePickerPointer = (hsla) => {
            const box = this.dom.querySelector(".pickerBox")
            const pointer = this.dom.querySelector(".pickerPointer")
            const pw = pointer.offsetWidth
            const ph = pointer.offsetHeight
            const rect = box.getBoundingClientRect()

            let dragging = false

            const updatePointer = (e) => {
                const rect = box.getBoundingClientRect();
                const cursorX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
                const cursorY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

                pointer.style.left = `${Math.max(0, Math.min(rect.width - pw, cursorX - pw / 2))}px`;
                pointer.style.top = `${Math.max(0, Math.min(rect.height - ph, cursorY - ph / 2))}px`;

                hsla.sat = Math.round((cursorX / rect.width) * 100);
                hsla.light = Math.round(100 * (1 - cursorY / rect.height));

                colorizedTitleColorBox(hsla);
            }
            
            box.addEventListener("mousedown", (e) => {
                dragging = true
                updatePointer(e)
            })

            window.addEventListener("mousemove", (e) => { if (dragging) updatePointer(e) })
            window.addEventListener("mouseup", () => dragging = false)
        }

        const colorizedColorBox = (hsla) => {
            const color = this.dom.querySelector(".color")
            color.style.backgroundColor = `hsla(${hsla.hue}, ${hsla.sat}%, ${hsla.light}%, ${hsla.alpha})`
            console.log(getComputedStyle(color).backgroundColor)
        }

        const rgbTohue = (rgb) => {

        }

        const rgbaToHsla = (r, g, b, a = 1) => {
            r /= 255; g /= 255; b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            const l = (max + min) / 2;
            const d = max - min;
            const s = d ? d / (1 - Math.abs(2 * l - 1)) : 0;
            const h = d
                ? ((max === r ? (g - b) / d + (g < b ? 6 : 0)
                    : max === g ? (b - r) / d + 2
                        : (r - g) / d + 4) * 60)
                : 0;
            return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100), a };
        }

        const main = () => {
            const ranges = Array.from(this.dom.querySelectorAll("input[type='range']"))
            const colorTitle = this.dom.querySelector(".color")
            const config = getConfig()
            applyConfCss(config.css)

            let hsla = { /* rgb browser conversion at customEvent */
                hue: 128,
                sat: 100,
                light: 50,
                alpha: 1
            }

            colorTitle.style.backgroundColor = config.logic.color
                ? config.logic.color
                : colorizedColorBox(hsla)

            movePointer(ranges[0], hsla)
            colorizedPicker(hsla)
            movePickerPointer(hsla)

            ranges.forEach(range => {
                range.addEventListener("input", (e) => {
                    movePointer(e.target, hsla)
                    colorizedPicker(hsla)

                })
            })
        }

        main()
    }
}

customElements.define("color-picker-rgb", colorPickerRGB)