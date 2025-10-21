import * as element from "../../modules/elements.js"

export class colorPickerRGB extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = element.add(this.dom, "div", null, "container")
        this.container.innerHTML = `
            <div class="titleBox">
                <span class="title">Color</span>
                <div class="colorBox relative">
                    <div class="color absolute"></div>
                    <input type="checkbox" class="hiddenInput">
                </div>
            </div>
            <div class="rangeBox center relative">
                <div class="range rgb absolute"></div>
                <span class="pointer absolute"></span> 
                <input id="rangeColor" class="hiddenInput absolute" type="range" min=0 max=255> 
            </div>
            <div class="pickerBox center relative">
                <div class="degraded absolute"></div>
                <div id="interactiveLayer" class="degraded absolute"></div>                
                <div class="pickerPointer center material-symbols-outlined absolute">left_click</div>
            </div>
            <div class="rangeBox center relative">
                <div class="grid range absolute"></div>
                <div class="range alpha absolute"></div>
                <span class="pointer absolute"></span> 
                <input id="rangeAlpha" class="hiddenInput absolute" type="range" min=0 max=100> 
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
                height: fit-content;
            }

            .relative { position: relative; }
            .absolute { position: absolute; }

            .hiddenInput {
                width: 100%;
                height: 100%;
                opacity: 0;
                cursor: pointer;
            }

            .center {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .container {
                width: 100%;
                height: 100%;

                .titleBox {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    height: 24px;
                    margin-bottom: 10px;
                
                    .title {
                        display: flex;
                        align-items: center;
                        font-family: var(--fontFamily);
                        font-size: var(--fontSize);
                        color: var(--fontColor);
                        font-style: italic;
                        width: fit-content;
                        height: 100%;
                    }

                    .colorBox {
                        width: 42px;
                        height: 100%;
                        border-radius: 4px;
                        overflow: hidden;

                        .color {
                            width: 100%;
                            height: 100%;
                        }
                    }
                }

                .pickerBox {
                    width: 100%;
                    height: 100px;
                    border-radius: 4px;
                    overflow: hidden;

                    .degraded {
                        width: 100%;
                        height: 100%;
                    }

                    .pickerPointer {
                        width: 0;
                        aspect-ratio: 1/1;
                        color: whitesmoke;
                        font-size: 60px;
                        opacity: 0.3;
                    }
                }

                .rangeBox {
                    width: 100%;
                    height: 26px;
                    border-radius: 2px;

                    .range {
                        width: 100%; 
                        height: 8px;
                        border-radius: 2px;
                        overflow: hidden;
                    }

                    .rgb {
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
                        width: 24px;
                        height: 18px;
                        border-radius: 4px;
                        border: 2px solid rgba(255, 255, 255, 0.79);
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

        const nameToRGB = async (colorName) => {
            const paintedElement = element.add(this.dom, "div", null, null)
            paintedElement.style.width = 0
            paintedElement.style.height = 0
            paintedElement.style.background = colorName
            const rgb = getComputedStyle(paintedElement).background
            paintedElement.remove()
            return rgb
        }

        const rangeToRGB = async (value, rgb) => {
            const h = (value / 255) * 360
            const c = 1, x = 1 - Math.abs((h / 60) % 2 - 1)
            let r = 0, g = 0, b = 0

            if (h < 60) { r = 1; g = x; b = 0 }
            else if (h < 120) { r = x; g = 1; b = 0 }
            else if (h < 180) { r = 0; g = 1; b = x }
            else if (h < 240) { r = 0; g = x; b = 1 }
            else if (h < 300) { r = x; g = 0; b = 1 }
            else { r = 1; g = 0; b = x }

            rgb.r = Math.round(r * 255)
            rgb.g = Math.round(g * 255)
            rgb.b = Math.round(b * 255)
        }

        const RGBToRange = async (rgb) => {
            const c = rgb.split("(")[1].split(")")[0].split(",")
            const r = +c[0], g = +c[1], b = +c[2]
            const max = Math.max(r, g, b), min = Math.min(r, g, b)
            const d = max - min
            let h = 0

            if (d) {
                if (max === r) h = (g - b) / d
                else if (max === g) h = 2 + (b - r) / d
                else h = 4 + (r - g) / d
            }

            h = (h * 42.5 + 255) % 255
            return Math.round(h)
        }

        const rgbString = (rgb, alpha = false) => {
            return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha ? rgb.a : 1})`
        }

        const applyColorTotitleBox = (rgb) => {
            const box = this.dom.querySelector(".color")
            box.style.background = rgbString(rgb, true)
        }

        const applyDegradedBacks = (rgb) => {
            const layers = Array.from(this.dom.querySelectorAll(".degraded"))
            layers[0].style.background = `linear-gradient(to right, white, ${rgbString(rgb, false)})`
            layers[1].style.background = `linear-gradient(to bottom, transparent, black)`
            const alphaRange = this.dom.querySelector(".alpha")
            alphaRange.style.background = `linear-gradient(to right, transparent, ${rgbString(rgb, false)})`
        }

        const moveRangePointer = (target) => {
            const pointer = target.parentElement.querySelector(".pointer")
            const newLeft = Math.round((target.value / target.max) * (target.offsetWidth - pointer.offsetWidth)) + "px"
            pointer.style.left = newLeft
        }

        const changePickerPointer = (pointer) => {
            pointer.textContent = ""
            pointer.classList.remove("material-symbols-outlined")
            pointer.style.width = "20px"
            pointer.style.border = "1px solid white"
            pointer.style.borderRadius = "4px"
            pointer.style.boxShadow = "inset 0 0 4px white, 0 0 4px black"
        }

        const drawGridBack = async (box) => {
            const boxWidth = box.offsetWidth
            const size = 4
            const rowsNum = Math.floor(box.offsetHeight / size)
            const itemsRow = Math.floor(boxWidth / size)

            const newLayer = element.add(box, "div", null, "absolute")
            newLayer.style.display = "flex"
            newLayer.style.flexDirection = "column"
            newLayer.style.alignItems = "center"
            newLayer.style.justifyContent = "center"
            newLayer.style.width = "100%"
            newLayer.style.height = "100%"
            box.insertBefore(newLayer, box.children[0])

            for (let i = 1; i <= rowsNum; i++) {
                const line = await element.add(newLayer, "div", i, "line")
                line.style.display = "flex"
                line.style.width = "100%"
                line.style.height = size + "px"

                for (let x = 1; x <= itemsRow; x++) {
                    const cell = element.add(line, "div", null, "cell")
                    cell.style.width = size + "px"
                    cell.style.height = size + "px"
                }

                const cells = Array.from(line.querySelectorAll(".cell"))
                cells.forEach((item, num) => {
                    Number(item.parentElement.id % 2) === 0
                        ? num % 2 === 0 ? item.style.background = "rgba(128, 128, 128, 0.4)" : null
                        : (num + 1) % 2 === 0 ? item.style.background = "rgba(128, 128, 128, 0.4)" : null
                })
            }
        }

        const updateRanges = async (range, initialRGB, rgb) => {
            range.value = range.id === "rangeColor"
                ? await RGBToRange(initialRGB)
                : rgb.a * 100
            moveRangePointer(range)
        }

        const main = async () => {
            const colorBox = this.dom.querySelector(".colorBox")
            const ranges = Array.from(this.dom.querySelectorAll("input[type='range']"))
            const pickerInteractiveLayer = this.dom.getElementById("interactiveLayer")
            const pickerPointer = this.dom.querySelector(".pickerPointer")
            let pickerActive = false
            const config = getConfig()

            const initialRGB = config.logic.color.includes("rgb")
                ? config.logic.color
                : await nameToRGB(config.logic.color)

            const string = initialRGB.split("(")[1].split(")")[0]
            const rgb = {
                r: Number(string.split(",")[0]),
                g: Number(string.split(",")[1]),
                b: Number(string.split(",")[2]),
                a: Number(string.split(",")[3]),
            }

            applyConfCss(config.css)
            applyColorTotitleBox(rgb)
            applyDegradedBacks(rgb)
            drawGridBack(colorBox)
            drawGridBack(this.dom.querySelector(".grid"))
            updateRanges(ranges[0], initialRGB, rgb)
            updateRanges(ranges[1], initialRGB, rgb)

                ;[pickerInteractiveLayer, pickerPointer].forEach(item => {
                    item.addEventListener("mousedown", () => {
                        if (!pickerActive) {
                            changePickerPointer(pickerPointer)
                            pickerActive = true
                        }
                    })
                })

            ranges.forEach(item => {
                item.addEventListener("input", (e) => {
                    if (item === ranges[0]) {
                        rangeToRGB(e.target.value, rgb)
                    } else {
                        rgb.a = e.target.value / 100
                    }

                    applyColorTotitleBox(rgb)
                    applyDegradedBacks(rgb)
                    moveRangePointer(e.target)
                    console.log(rgb)
                })
            })
        }

        main()
    }
}

customElements.define("color-picker-rgb", colorPickerRGB)