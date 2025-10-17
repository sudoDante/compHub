import * as element from "../../modules/elements.js"

export class colorPicker extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = element.add(this.dom, "div", null, "container")
        this.container.innerHTML = `
            <section class="colors">
                <div class="colorBox">
                    <div class="finalColorBox">
                        <div class="backGrid"></div>
                        <div class="color"></div>
                    </div>
                    <ul class="vertical">
                        <li class="char">H</li>
                        <li class="char">S</li>
                        <li class="char">L</li>
                        <li class="char">A</li>
                    </ul>
                </div>
                <div class="listRangesBox">
                    <div class="rangeBox">
                        <div class="pointer"></div>
                        <input type="range" id="rangeHue" min=0 max=360>
                    </div>
                    <div class="rangeBox">
                        <div class="pointer"></div>
                        <input type="range" id="rangeSat" min=0 max=100>
                    </div>
                    <div class="rangeBox">
                        <div class="pointer"></div>
                        <input type="range" id="rangeLight" min=0 max=100>
                    </div>
                    <div class="rangeBox" id="alphaBox">
                        <div class="backGrid"></div>
                        <div class="color"></div>
                        <div class="pointer"></div>
                        <input type="range" id="rangeAlpha" min=0 max=1 step=0.01>
                    </div>
                </div>
            </section>
            <div class="infoBox">
                <span class="info">Hsla</span>
                <span class="info"></span>
                <span class="info"></span>
                <span class="info"></span>
                <span class="info"></span>
                <div class="open"></div>
            </div>
        `

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

            .backGrid {
                position: absolute;
                z-index: 10;
                width: 100%;
                height: 100%;

                .cell {
                    width: 100%;
                    height: 100%;
                }
            }

            .color {
                position: absolute;
                z-index: 11;
                width: 100%;
                height: 100%;
                border-radius: 4px;
                box-shadow: inset 3px 3px 8px rgb(28,28,28);
            }

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
                            position: relative;
                            display: flex;
                            width: 60px;
                            height: 100%;
                            border-radius: 4px;
                            border: 1px solid grey; 
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
                                color: var(--fontColor2);
                                font-family: var(--fontFamily);
                                font-size: 14px;
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
                            position: relative;
                            display: flex;
                            width: 100%;
                            height: 20px;
                            border-radius: 4px;
                            overflow: hidden;
                            box-shadow: inset 3px 3px 8px rgb(28,28,28);    

                            .pointer {
                                position: absolute;
                                z-index: 12;
                                display: flex;
                                align-items: center;
                                width: 10px;
                                height: 100%;                    
                                border-radius: 2px;
                                box-shadow: 0 0 10px rgb(28, 28, 28), inset 0 0 10px white;
                            }

                            input {
                                position: absolute;
                                appearance: none;
                                z-index: 13;
                                width: 100%;
                                height: 100%;
                                background-color: transparent;
                                cursor: pointer;

                                &::-moz-range-thumb {
                                    background: none;
                                    border: none;
                                }
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

                            &:nth-of-type(2) {
                                background: linear-gradient(to right, rgb(128, 128, 128) 0%, hsl(var(--hueColor), 100%, 50%, 1) 100%);
                            }
                                
                            &:nth-of-type(3) {
                                background: linear-gradient(to right, rgb(0, 0, 0) 0%, hsl(var(--hueColor), 100%, 50%, 1) 50%, rgb(255, 255, 255) 100%);
                            }

                            &:nth-of-type(4) .color {
                                background: linear-gradient(to right, hsl(var(--hueColor), 100%, 50%, 0) 0%, hsl(var(--hueColor), 100%, 50%, 1) 100%);
                            }
                        }
                    }
                }

                .infoBox {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    width: 100%;
                    height: 30px;
                    padding: 4px;
                    border-radius: 4px;
                    background-color: rgba(221, 221, 221, 1);
                    box-shadow: inset 3px 3px 8px rgb(28,28,28);

                    .info,
                    .open {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: calc(100% / 7);
                        height: 100%;
                    }
                    
                    .info {
                        color: var(--fontColor1);
                        font-family: var(--fontFamily);
                        font-size: var(--fontSize);
                        font-style: italic;
                    }

                }
            }
        `
    }

    connectedCallback() {
        const getConfig = () => {
            const backColor = this.getAttribute("backColor") || "red"
            const fontFamily = this.getAttribute("fontFamily") || "inset 2px 2px 6px rgb(58, 58, 58)"
            const fontSize = this.getAttribute("fontSize") || "inset 2px 2px 6px rgb(58, 58, 58)"
            const fontColor1 = this.getAttribute("fontColor1") || "initial"
            const fontColor2 = this.getAttribute("fontColor2") || "initial"

            return {
                css: {
                    "backColor": backColor,
                    "fontFamily": fontFamily,
                    "fontSize": fontSize,
                    "fontColor1": fontColor1,
                    "fontColor2": fontColor2
                }
            }
        }

        const applyConfCss = (css) => {
            this.style.setProperty("--backColor", css.backColor)
            this.style.setProperty("--fontFamily", css.fontFamily)
            this.style.setProperty("--fontSize", css.fontSize)
            this.style.setProperty("--fontColor1", css.fontColor1)
            this.style.setProperty("--fontColor2", css.fontColor2)
        }

        const drawGridBack = async (box) => {
            console.log(box)
            const size = box.id === "alphaBox" ? 1 : 7
            const boxWidth = box.offsetWidth
            const boxHeight = box.offsetHeight
            const itemsRow = Math.floor(boxHeight / size) + 1
            const itemsCol = Math.floor(boxWidth / size) + 1
            const backLayer = box.querySelector(".backGrid")

            backLayer.style.display = "grid"
            if (box.id === "alphaBox") {
                backLayer.style.gridTemplateRows = `repeat(1, 1fr)`
                backLayer.style.gridTemplateColumns = `repeat(${itemsCol}, 1fr)`
            } else {
                backLayer.style.gridTemplateRows = `repeat(${itemsRow}, 1fr)`
                backLayer.style.gridTemplateColumns = `repeat(${itemsCol}, 1fr)`
            }

            for (let i = 0; i <= itemsCol * itemsRow; i++) await element.add(backLayer, "div", null, "cell")
            const cells = box.querySelectorAll(".cell")
            box.id === "alphaBox"
                ? cells.forEach((item, index) => { if (index % 4 === 0) item.style.backgroundColor = "rgba(200,200,200, 0.5)" })
                : cells.forEach((item, index) => { if (index % 2 === 0) item.style.backgroundColor = "rgba(200,200,200, 0.2)" })
            console.log(backLayer)
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

        const resetDefaultValues = async (ranges) => {
            ranges[0].value = 180
            ranges[1].value = 100
            ranges[2].value = 50
            ranges[3].value = 1
        }

        const main = async () => {
            const ranges = this.dom.querySelectorAll("input")
            const config = getConfig()
            const hsla = {
                hue: 180,
                sat: 100,
                light: 50,
                alpha: 1
            }

            applyConfCss(config.css)
            colorizedColorBox(hsla)
            await resetDefaultValues(ranges)
            movePointer(ranges[0], hsla)
            movePointer(ranges[1], hsla)
            movePointer(ranges[2], hsla)
            movePointer(ranges[3], hsla)
            updateInfo(hsla)

            await drawGridBack(this.dom.querySelector(".colorBox"))
            await drawGridBack(this.dom.getElementById("alphaBox"))
            this.style.setProperty("--hueColor", hsla.hue)

            ranges.forEach((range) => {
                range.addEventListener("input", (e) => {
                    movePointer(e.target, hsla)
                    colorizedColorBox(hsla)
                    updateInfo(hsla)
                    this.style.setProperty("--hueColor", hsla.hue)

                })
            })
        }

        main()
    }
}
customElements.define("color-picker", colorPicker)