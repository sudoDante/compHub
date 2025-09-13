/* ATTRIBUTES 
size                size in px for cells                default 30px - min 30
back                background color                    default transparent
cellColor1          border color in RGBA                default red
cellColor2          backgrounColor in RGBA              default red
*/

import * as elements from "../modules/elements.js"
import * as extra from "../modules/extra.js"

export class colorizedGrid extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = elements.create(this.dom, "div", null, "container")

        const style = elements.create(this.dom, "style")
        style.textContent = `
            :host {
                box-shadow: border-box;
                margin: 0;
                padding: 0;

                --gridCols: 3;
                --gridRows: 3;
            }

            .container {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                width: 100%;
                height: 100%;
                background-color: var(--backgroundColor);
                background-image: url("https://m.media-amazon.com/images/I/81V2hzNkcsL.jpg");
                background-size: cover;

                .row {
                    display: flex;
                    width: 100%;
                    height: var(--cellSize);

                    .cell {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        height: 100%;

                        .innerCell {
                            width: 92%;
                            height: 92%;
                            background-color: var(--cellColor);
                            border-radius: 15%;
                            transition: var(--transition);

                            .layerCell {
                                width: 100%;
                                height: 100%;
                                border-radius: 15%;
                                background-color: transparent;
                                transition: var(--transition);
                            }
                        }
                    }
                }
            }
        `
    }

    connectedCallback() {

        const getConfig = () => {
            // CSS
            const cellSize = this.getAttribute("size") && Number(this.getAttribute("size")) < 30 ? Number(this.getAttribute("size")) : 30
            const backgroundColor = this.getAttribute("back") ? this.getAttribute("back") : "transparent"
            const cellColor = this.getAttribute("color") ? this.getAttribute("color") : "rgba(255, 0, 0, 0.2)"
            // JS
            const interval = this.getAttribute("interval") ? this.getAttribute("interval") : 1000

            return {
                "cellSize": cellSize,
                "backgroundColor": backgroundColor,
                "cellColor": cellColor,
                "interval": interval
            }
        }

        const applyConfCss = (conf) => {
            console.log(conf)
            if (conf.cellSize) this.style.setProperty("--cellSize", conf.cellSize + "px")
            if (conf.backgroundColor) this.style.setProperty("--backgroundColor", conf.backgroundColor)
            if (conf.cellColor) this.style.setProperty("--cellColor", conf.cellColor)
        }

        const calcGrid = (dimensions, parSize) => {
            const width = dimensions[0]
            const height = dimensions[1]
            const size = parSize
            const cols = Math.floor(width / size)
            const rows = Math.floor(height / size)
            return { "cols": cols, "rows": rows }
        }

        const drawGrid = async (calculated) => {
            let idCounter = 0
            for (let y = 0; y < calculated.rows; y++) {
                const newRow = elements.create(this.container, "div", null, "row")
                for (let x = 0; x < calculated.cols; x++) {
                    const cell = elements.create(newRow, "div", null, "cell", { "x": x, "y": y })
                    elements.create(cell, "div", idCounter, "innerCell")
                }
            }
            return Array.from(this.dom.querySelectorAll(".innerCell"))
        }

        const insertAlphaLayer = async (array) => {
            array.forEach(item => {
                elements.create(item, "div", null, "layerCell")
            })
        }

        const colorizedAlpha = async (item, conf) => {
            let cellColor = conf.cellColor

            !conf.cellColor.includes("rgb") ? cellColor = extra.toRgba(conf.cellColor, extra.randomize(10, 50) / 100) : null

            const layerCell = item.querySelector(".layerCell")
            const colorRange = extra.randomize(30, 230)

            item.style.backgroundColor = cellColor
            layerCell.style.backgroundColor = `rgba(${colorRange}, ${colorRange}, ${colorRange}, ${extra.randomize(20, 70) / 100})`
            layerCell.style.backdropFilter = `blur(${extra.randomize(0, 3)}px)`
        }

        const colorize = async (innerCells, conf) => {

            innerCells.forEach(item => {
                colorizedAlpha(item, conf)
            })

            this.style.setProperty("--transition", "2s")

            while (true) {
                const randomCell = innerCells[extra.randomize(0, innerCells.length - 1)]
                colorizedAlpha(randomCell, conf)
                await new Promise(resolve => setTimeout(resolve, 200))
            }
        }

        const main = async () => {
            const conf = getConfig()
            applyConfCss(conf)
            const dimensions = [this.container.offsetWidth, this.container.offsetHeight]
            const calculatedGrid = calcGrid(dimensions, conf.cellSize)
            const innerCells = await drawGrid(calculatedGrid)
            insertAlphaLayer(innerCells)
            colorize(innerCells, conf)
        }

        main()
    }

}
customElements.define("colorized-grid", colorizedGrid)