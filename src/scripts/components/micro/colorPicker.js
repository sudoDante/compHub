import * as element from "../../modules/elements.js"

export class colorPicker extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = element.add(this.dom, "div", null, "container relative")
        this.container.innerHTML = `
            <section class="expand absolute">
                <div class="marginBox"></div>
            </section>

            <section class="colors">
                <div class="colorBox">
                    <div class="finalColorBox relative">
                        <div class="backGrid absolute"></div>
                        <div id="colorLayer" class="color shadowBox absolute"></div>
                    </div>
                    <ul class="vertical">
                        <li class="char">H</li>
                        <li class="char">S</li>
                        <li class="char">L</li>
                        <li class="char">A</li>
                    </ul>
                </div>
                <div class="listRangesBox">
                    <div class="rangeBox shadowBox relative">
                        <div class="pointer absolute"></div>
                        <input type="range" id="rangeHue" class="hiddenInput shadowInset absolute" min=0 value=180 max=360>
                    </div>
                    <div class="rangeBox shadowBox relative">
                        <div class="pointer absolute"></div>
                        <input type="range" id="rangeSat" class="hiddenInput shadowInset absolute" min=0 value=100 max=100>
                    </div>
                    <div class="rangeBox shadowBox relative">
                        <div class="pointer absolute"></div>
                        <input type="range" id="rangeLight" class="hiddenInput shadowInset absolute" min=0 value=50  max=100>
                    </div>
                    <div class="rangeBox shadowBox relative" id="alphaBox">
                        <div class="backGrid absolute"></div>
                        <div class="color absolute"></div>
                        <div class="pointer absolute"></div>
                        <input type="range" id="rangeAlpha" class="hiddenInput shadowInset absolute" min=0 max=1 value= 100 step=0.01>
                    </div>
                </div>
            </section>

            <section class="infoSection">
                <div class="infoBox shadowBox">
                    <span class="info">HSLA</span>
                    <span class="info"></span>
                    <span class="info"></span>
                    <span class="info"></span>
                    <span class="info"></span>
                </div>
                <div class="open relative">expand_more
                    <input class="hiddenInput absolute expandInput" type="checkbox">
                </div>
            </section> 
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
                list-style: none;
            }

            :host {
                width: 100%;
                height: 100%;
            }

            .relative { position: relative; }
            .absolute { position: absolute; }

            .backGrid {
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 100%;
                height: 100%;

                .line {
                    display: flex;
                    width: 100%;
                    height: 50%;

                    .cell {
                        height: 100%;
                        aspect-ratio: 1/1;
                    }

                    .colorCell {
                        background-color: rgba(128, 128, 128, 0.77);
                    }
                }
            }

            .color {
                width: 100%;
                height: 100%;
            }

            .hiddenInput {
                appearance: none;
                width: 100%;
                height: 100%;
                background-color: transparent;
                cursor: pointer;

                &::-moz-range-thumb {
                    background: none;
                    border: none;
                }
            }

            .shadowBox { box-shadow: inset 1px 1px 4px rgb(28,28,28); }    

            .container {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: 100%;
                height: 100%;
                background-color: var(--backColor);
                border-radius: 4px;
                padding: 10px;
                backdrop-filter: blur(4px);

                .expand {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    left: 0;
                    top: 100%;
                    width: 100%;
                    height: 130px;
                    border-radius: 4px;
                    background-color: var(--backColor);
                    overFlow: hidden;
                    clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
                    opacity: 0;
                    transition: 250ms;

                    .marginBox {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        width: calc(100% - 20px);
                        height: calc(100% - 20px);
                    
                        .paletteRow {
                            display: flex;
                            justify-content: space-between;
                            width: 100%;
                            height: 30px;

                            .colorPalette {
                                width: 30px;
                                aspect-ratio: 1/1;
                                border-radius: 4px;
                                cursor: pointer;
                            }
                        }
                    }
                }

                .colors {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    height: calc(100% - 40px);
                
                    .colorBox {
                        display: flex;
                        justify-content: space-between;
                        width: 86px;
                        height: 100%;

                        .finalColorBox {
                            display: flex;
                            width: 60px;
                            height: 100%;
                            border-radius: 4px;
                            overflow: hidden;
                        }

                        .vertical {
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            width: 20px;
                            height: 100%;

                            .char {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                width: 20px;
                                height: 20px;
                                text-align: right;
                                color: var(--fontColor);
                                font-family: var(--fontFamily);
                                font-size: 14px;
                                border: 1px solid grey;
                                border-radius: 4px;
                            }
                        }
                    }

                    .listRangesBox {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        width: calc(100% - 96px);
                        height: 100%;

                        .rangeBox {
                            display: flex;
                            width: 100%;
                            height: 20px;
                            border-radius: 4px;
                            overflow: hidden;

                            .pointer {
                                display: flex;
                                align-items: center;
                                width: 10px;
                                height: 100%;                    
                                border-radius: 2px;
                                box-shadow: 0 0 10px rgb(28, 28, 28), inset 0 0 10px white;
                            }

                            &:first-of-type {
                                background: linear-gradient(
                                    to right,
                                    rgb(255, 0, 0), 
                                    rgb(255, 255, 0),
                                    rgb(0, 255, 0),
                                    rgb(0, 255, 255),
                                    rgb(0, 0, 255),
                                    rgb(255, 0, 255),
                                    rgb(255, 0, 0));
                            }

                            &:nth-of-type(2) { background: linear-gradient(to right, rgb(128, 128, 128) 0%, hsl(var(--hueColor), 100%, 50%, 1) 100%); }
                            &:nth-of-type(3) { background: linear-gradient(to right, rgb(0, 0, 0) 0%, hsl(var(--hueColor), 100%, 50%, 1) 50%, rgb(255, 255, 255) 100%); }
                            &:nth-of-type(4) .color { background: linear-gradient(to right, hsl(var(--hueColor), 100%, 50%, 0) 0%, hsl(var(--hueColor), 100%, 50%, 1) 100%); }
                        }
                    }
                }

                .infoSection {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    height: 30px;

                    .infoBox {
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        width: calc(100% - 50px);
                        height: 100%;
                        border-radius: 4px;
                        background-color: whitesmoke;
                        
                        .info {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: calc(100% / 5);
                            height: 100%;
                            color: var(--fontColor);
                            font-family: var(--fontFamily);
                            font-size: var(--fontSize);
                            font-style: italic;
                        }
                    }

                    .open {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 40px;
                        height: 100%;
                        font-family: material symbols outlined;
                        font-size: 26px;
                        color: var(--fontColor);
                        border: 1px solid grey;
                        border-radius: 4px;
                    }
                }

                &:has(.infoSection .open .expandInput:checked) .expand {
                    top: calc(100% + 10px);
                    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
                    opacity: 1;
                }
            }
        `
    }

    connectedCallback() {
        const getConfig = () => {
            const backColor = this.getAttribute("backColor") || "red"
            const fontFamily = this.getAttribute("fontFamily") || "inset 2px 2px 6px rgb(58, 58, 58)"
            const fontSize = this.getAttribute("fontSize") || "inset 2px 2px 6px rgb(58, 58, 58)"
            const fontColor = this.getAttribute("fontColor") || "initial"
            const event = this.getAttribute("event") || this.id

            return {
                css: {
                    "backColor": backColor,
                    "fontFamily": fontFamily,
                    "fontSize": fontSize,
                    "fontColor": fontColor
                },
                logic: { "event": event }
            }
        }

        const applyConfCss = (css) => {
            this.style.setProperty("--backColor", css.backColor)
            this.style.setProperty("--fontFamily", css.fontFamily)
            this.style.setProperty("--fontSize", css.fontSize)
            this.style.setProperty("--fontColor", css.fontColor)
        }

        const drawGridBack = async (box) => {
            const boxWidth = box.offsetWidth
            const size = 5
            const rowsNum = Math.floor(box.offsetHeight / size)
            const itemsRow = Math.floor(boxWidth / size)
            const backLayer = box.querySelector(".backGrid")

            for (let i = 1; i <= rowsNum; i++) {
                const line = await element.add(backLayer, "div", i, "line")
                for (let x = 1; x <= itemsRow; x++) element.add(line, "div", null, "cell")
                const cells = Array.from(line.querySelectorAll(".cell"))

                cells.forEach((item, num) => {
                    Number(item.parentElement.id % 2) === 0
                        ? num % 2 === 0 ? item.classList.add("colorCell") : null
                        : (num + 1) % 2 === 0 ? item.classList.add("colorCell") : null
                })
            }

        }

        const movePointer = (target, hsla) => {
            const pointer = target.parentElement.querySelector(".pointer")
            const newLeft = Math.round((target.value / target.max) * (target.offsetWidth - pointer.offsetWidth)) + "px"
            pointer.style.left = newLeft

            if (target.id === "rangeHue") hsla.hue = target.value
            if (target.id === "rangeSat") hsla.sat = target.value
            if (target.id === "rangeLight") hsla.light = target.value
            if (target.id === "rangeAlpha") hsla.alpha = target.value

        }

        const colorizedColorBox = (hsla) => {
            const colorBox = this.dom.querySelector(".color")
            colorBox.style.backgroundColor = `hsla(${hsla.hue}, ${hsla.sat}%, ${hsla.light}%, ${hsla.alpha})`
        }

        const updateInfo = (hsla) => {
            const infos = this.dom.querySelectorAll(".info")
            infos[1].textContent = hsla.hue
            infos[2].textContent = hsla.sat + "%"
            infos[3].textContent = hsla.light + "%"
            infos[4].textContent = hsla.alpha
        }

        const addPalette = async () => {
            const expand = this.dom.querySelector(".marginBox")

            for (let rowCont = 1; rowCont <= 3; rowCont++) {
                const row = element.add(expand, "ul", null, "paletteRow")

                for (let box = 1; box <= 7; box++) { const colorPalette = element.add(row, "li", null, "colorPalette shadowBox") }
            }
            return Array.from(this.dom.querySelectorAll(".colorPalette"))
        }

        const colorizedPalette = (hue) => {
            const paletteItems = Array.from(this.dom.querySelectorAll(".colorPalette"))
            const light = (94 - 6) / (paletteItems.length - 1)

            paletteItems.forEach((item, num) => {
                item.style.backgroundColor = `hsl(${hue}, 100%, ${Math.round(light * num + 6)}%)`  /* ojo!!! +6 para compensar el min y no empezar en 0*/
                item.setAttribute("hsla", `hsl(${hue}, 100%, ${Math.round(light * num + 6)}%)`)
            })
        }

        const main = async () => {
            const ranges = this.dom.querySelectorAll("input[type='range']")
            const config = getConfig()
            const hsla = {
                hue: 180,
                sat: 100,
                light: 50,
                alpha: 1
            }

            applyConfCss(config.css)
            colorizedColorBox(hsla)
            movePointer(ranges[0], hsla)
            movePointer(ranges[1], hsla)
            movePointer(ranges[2], hsla)
            movePointer(ranges[3], hsla)
            updateInfo(hsla)

            await drawGridBack(this.dom.querySelector(".colorBox"))
            await drawGridBack(this.dom.getElementById("alphaBox"))
            this.style.setProperty("--hueColor", hsla.hue)
            const boxesPalette = await addPalette()
            colorizedPalette(hsla.hue)

            ranges.forEach((range) => {
                range.addEventListener("input", (e) => {
                    movePointer(e.target, hsla)
                    colorizedColorBox(hsla)
                    updateInfo(hsla)
                    this.style.setProperty("--hueColor", hsla.hue)
                    colorizedPalette(hsla.hue)
                })
            })

            boxesPalette.forEach(box => {
                box.addEventListener("click", (e) => {
                    const newHsla = e.target.getAttribute("hsla")
                    document.dispatchEvent(new CustomEvent(config.logic.event, { detail: newHsla }))
                })
            })

            ranges.forEach(range => {
                range.addEventListener("input", () => {
                    const newHsla = `hsla(${hsla.hue}, ${hsla.sat}%, ${hsla.light}%, ${hsla.alpha})`
                    document.dispatchEvent(new CustomEvent(config.logic.event, { detail: newHsla }))
                })
            })
        }

        main()
    }
}
customElements.define("color-picker", colorPicker)