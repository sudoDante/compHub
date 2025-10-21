import * as element from "../../modules/elements.js"

export class colorPickerRGB extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = element.add(this.dom, "div", null, "container")
        this.container.innerHTML = `
            <div class="titleBox">
                <span class="title"></span>
                <div class="colorBox relative">
                    <div class="color absolute"></div>
                    <input type="checkbox" class="hiddenInput">
                </div>
            </div>
            <div class="expand">
                <div class="rangeBox center relative">
                    <div class="range rgb absolute"></div>
                    <span class="pointer absolute"></span> 
                    <input id="rangeColor" class="hiddenInput absolute" type="range" min=0 max=255> 
                </div>
                <div class="pickerBox center relative">
                    <div class="degraded absolute"></div>
                    <div id="topDegraded" class="degraded absolute"></div>                
                    <div class="pickerPointer center material-symbols-outlined absolute">left_click</div>
                </div>
                <div class="rangeBox center relative">
                    <div class="grid range absolute"></div>
                    <div class="range alpha absolute"></div>
                    <span class="pointer center absolute"></span> 
                    <input id="rangeAlpha" class="hiddenInput absolute" type="range" min=0 max=100> 
                </div>
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
                margin-bottom: 20px;

                &:has(.titleBox .colorBox .hiddenInput:checked) .expand {
                    height: 152px;
                }

                .titleBox {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    height: 20px;
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

                .expand {
                    width: 100%;
                    height: 0;
                    overflow: hidden;
                    transition: 300ms ease-in-out;
                
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
                            cursor: pointer; 
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
            }
        `

        this.config = {}
    }

    connectedCallback() {

        const eventDom = this.eventDom || document

        const getConfig = async () => {
            const fontFamily = this.getAttribute("fontFamily") || "initial"
            const fontSize = this.getAttribute("fontSize") || "initial"
            const fontColor = this.getAttribute("fontColor") || "red"
            const title = this.getAttribute("title") || "empty title"
            const color = this.getAttribute("color") || false
            const eventName = this.getAttribute("eventName") || this
            const eventItem = this.getAttribute("eventItem") || this

            return {
                css: {
                    "fontFamily": fontFamily,
                    "fontSize": fontSize,
                    "fontColor": fontColor
                },
                logic: {
                    "title": title,
                    "color": color,
                    "eventName": eventName,
                    "eventItem": eventItem,
                }
            }
        }

        const applyConfCss = async () => {
            Object.entries(this.config.css).forEach(([key, value]) => {
                this.style.setProperty(`--${key}`, value)
            })
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

        const rgbToString = (rgb, alpha = false) => {
            return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha ? rgb.a : 1})`
        }

        const applyColorTotitleBox = (rgb) => {
            const box = this.dom.querySelector(".color")
            box.style.background = rgbToString(rgb, true)
        }

        const applyDegradedBacks = (rgb) => {
            const layers = Array.from(this.dom.querySelectorAll(".degraded"))
            layers[0].style.background = `linear-gradient(to right, white, ${rgbToString(rgb, false)})`
            layers[1].style.background = `linear-gradient(to bottom, transparent, black)`
            const alphaRange = this.dom.querySelector(".alpha")
            alphaRange.style.background = `linear-gradient(to right, transparent, ${rgbToString(rgb, false)})`
        }

        const moveRangePointer = (target) => {
            const pointer = target.parentElement.querySelector(".pointer")
            const newLeft = Math.round((target.value / target.max) * (target.offsetWidth - pointer.offsetWidth)) + "px"
            pointer.style.left = newLeft
        }

        const changePickerPointer = (pointer) => {
            pointer.textContent = ""
            pointer.classList.remove("material-symbols-outlined")
            pointer.style.width = "28px"
            pointer.style.border = "5px solid white"
            pointer.style.borderRadius = "50%"
            pointer.style.opacity = 0.3
            const subPointer = element.add(pointer, "div", null, null)
            subPointer.style.width = "20px"
            subPointer.style.aspectRatio = "1/1"
            subPointer.style.border = "3px solid rgba(0, 0, 0, 1)"
            subPointer.style.borderRadius = "50%"
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

        const movePickerPointer = (callback, rgb) => {
            const box = this.dom.querySelector(".pickerBox")
            const pointer = this.dom.querySelector(".pickerPointer")
            let dragging = false


            const updatePointer = (e) => {
                const rect = box.getBoundingClientRect()
                const pw = pointer.offsetWidth
                const ph = pointer.offsetHeight
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top

                const clampedX = Math.max(0, Math.min(rect.width, x))
                const clampedY = Math.max(0, Math.min(rect.height, y))
                const left = clampedX - pw / 2
                const top = clampedY - ph / 2

                pointer.style.left = `${left}px`
                pointer.style.top = `${top}px`

                if (callback) callback({
                    x: Math.round(clampedX),
                    y: Math.round(clampedY),
                    boxX: box.offsetWidth,
                    boxY: box.offsetHeight
                },
                    rgb
                )
            }

            box.addEventListener("mousedown", (e) => {
                dragging = true
                updatePointer(e)
            })

            window.addEventListener("mousemove", (e) => {
                if (dragging) {
                    updatePointer(e)
                }
            })
            window.addEventListener("mouseup", () => dragging = false)
        }

        const updateFinalColor = (sat, lum, rgbFinal, baseRGB) => {
            rgbFinal.r = Math.round((255 * (1 - sat) + baseRGB.r * sat) * lum)
            rgbFinal.g = Math.round((255 * (1 - sat) + baseRGB.g * sat) * lum)
            rgbFinal.b = Math.round((255 * (1 - sat) + baseRGB.b * sat) * lum)
            applyColorTotitleBox(rgbFinal)
            sendCustomEvents()
        }

        const sendCustomEvents = () => {
            const colorBox = this.dom.querySelector(".color")
            const realRGB = getComputedStyle(colorBox).background

            eventDom.dispatchEvent(new CustomEvent(this.config.logic.eventName, {
                detail: {
                    item: this.config.logic.eventItem,
                    value: realRGB
                }
            }))
        }

        const main = async () => {
            this.config = await getConfig()

            const titleBox = this.dom.querySelector(".title")
            const colorBox = this.dom.querySelector(".colorBox")
            const ranges = Array.from(this.dom.querySelectorAll("input[type='range']"))
            const pickerTopDegraded = this.dom.getElementById("topDegraded")
            const pickerPointer = this.dom.querySelector(".pickerPointer")
            let pickerActive = false

            const initialRGB = this.config.logic.color.includes("rgb")
                ? this.config.logic.color
                : await nameToRGB(this.config.logic.color)

            const string = initialRGB.split("(")[1].split(")")[0]
            const baseRGB = {
                r: Number(string.split(",")[0]),
                g: Number(string.split(",")[1]),
                b: Number(string.split(",")[2])
            }

            const rgbFinal = { ...baseRGB, a: Number(string.split(",")[3] || 1) }

            titleBox.textContent = this.config.logic.title
            applyConfCss()
            applyColorTotitleBox(rgbFinal)
            applyDegradedBacks(baseRGB)
            drawGridBack(colorBox)
            drawGridBack(this.dom.querySelector(".grid"))
            updateRanges(ranges[0], initialRGB, rgbFinal)
            updateRanges(ranges[1], initialRGB, rgbFinal)

                ;[pickerTopDegraded, pickerPointer].forEach(item => {
                    item.addEventListener("mousedown", (e) => {
                        if (!pickerActive) {
                            changePickerPointer(pickerPointer)
                            pickerActive = true
                        }
                    })
                })

            movePickerPointer(({ x, y, boxX, boxY }) => {
                const sat = x / boxX
                const lum = 1 - y / boxY
                updateFinalColor(sat, lum, rgbFinal, baseRGB)
            }, rgbFinal)

            ranges[0].addEventListener("input", async (e) => {
                await rangeToRGB(e.target.value, baseRGB)
                applyDegradedBacks(baseRGB)
                moveRangePointer(e.target)

                const px = (parseFloat(pickerPointer.style.left) || 0) + pickerPointer.offsetWidth / 2
                const py = (parseFloat(pickerPointer.style.top) || 0) + pickerPointer.offsetHeight / 2
                const sat = px / pickerPointer.parentElement.offsetWidth
                const lum = 1 - py / pickerPointer.parentElement.offsetHeight
                updateFinalColor(sat, lum, rgbFinal, baseRGB)
            })

            ranges[1].addEventListener("input", (e) => {
                rgbFinal.a = e.target.value / 100
                applyColorTotitleBox(rgbFinal)
                moveRangePointer(e.target)
                sendCustomEvents()
            })
        }

        main()
    }
}

customElements.define("color-picker-rgb", colorPickerRGB)