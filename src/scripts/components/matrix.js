/* ATTRIBUTES 
size            size in px of cells                     default 20px - min 20
direction       horizontal or vertical animation        default vertical
back            background color                        default transparent
interval        time between selections                 default 160ms
steps           time between cells animation            default 50ms
*/


import * as elements from "/src/scripts/modules/elements.js"
import { randomize } from "/src/scripts/modules/extra.js"

export class matrix extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = elements.create(this.dom, "div", "container", "container")

        const style = elements.create(this.dom, "style")
        style.textContent = `
            :host {
                box-shadow: border-box;
                margin: 0;
                padding: 0;
            }

            .container {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                width: 100%;
                height: 100%;
                background-color: var(--backgroundColor);

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

                        .matrixCellDefault {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            width: 100%;
                            height: 100%;
                            color: transparent;
                            font-size: 80%;
                            font-family: impact;
                        }

                        .matrixCellDrawing {
                            color: var(--symbolsColor2);
                            font-size: 120%;
                        }

                        .matrixCellVisible {
                            color: var(--symbolsColor1);
                        }

                        .matrixCellInvisible {
                            color: transparent;
                            transition: 1000ms;
                        }
                    }
                }
            }
        `
    }

    connectedCallback() {

        const getConfig = () => {
            // CSS
            const cellSize = this.getAttribute("size") && Number(this.getAttribute("size")) < 20 ? Number(this.getAttribute("size")) : 20
            const backgroundColor = this.getAttribute("back") ? this.getAttribute("back") : "transparent"
            const symbolsColor1 = this.getAttribute("color1") ? this.getAttribute("color1") : "grey"
            const symbolsColor2 = this.getAttribute("color2") ? this.getAttribute("color2") : "black"
            // JS
            const direction = ["horizontal", "vertical"].includes(this.getAttribute("direction")) ? this.getAttribute("direction") : "vertical"
            const interval = this.getAttribute("interval") ? this.getAttribute("interval") : 160
            const steps = this.getAttribute("steps") ? this.getAttribute("steps") : 50

            return {
                "cellSize": cellSize,
                "backgroundColor": backgroundColor,
                "symbolsColor1": symbolsColor1,
                "symbolsColor2": symbolsColor2,
                "direction": direction,
                "interval": interval,
                "steps": steps
            }
        }

        const applyConfCss = (conf) => {
            if (conf.cellSize) this.style.setProperty("--cellSize", conf.cellSize + "px")
            if (conf.backgroundColor) this.style.setProperty("--backgroundColor", conf.backgroundColor)
            if (conf.symbolsColor1) this.style.setProperty("--symbolsColor1", conf.symbolsColor1)
            if (conf.symbolsColor2) this.style.setProperty("--symbolsColor2", conf.symbolsColor2)
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
            for (let y = 0; y < calculated.rows; y++) {
                const newRow = elements.create(this.dom.querySelector("#container"), "div", null, "row")
                for (let x = 0; x < calculated.cols; x++) {
                    elements.create(newRow, "div", null, "cell", { "x": x, "y": y })
                }
            }
            return Array.from(this.dom.querySelectorAll(".cell"))
        }

        const identifyGroup = (number, direction, arrayCells) => {
            const x_y = direction === "vertical" ? "x" : "y"
            const group = arrayCells.filter(item => item.parentNode.getAttribute(x_y) === String(number))
            return group
        }

        const randomIndex = async (activeGroup, availableNums, conf, calculated, cells) => {
            const length = conf.direction === "vertical" ? calculated.cols : calculated.rows
            availableNums = [...Array(length).keys()]

            while (true) {
                let waiting = conf.interval

                const index = randomize(0, availableNums.length - 1)
                const selectedNum = availableNums[index]
                activeGroup.push(selectedNum)
                const indexOfNumInAvailables = availableNums.findIndex(item => item === selectedNum)
                availableNums.splice(indexOfNumInAvailables, 1)

                if (activeGroup.length === length || availableNums.length === 0) waiting = 5000
                animatingGroup(activeGroup, availableNums, selectedNum, conf, cells)
                await new Promise(resolve => setTimeout(resolve, waiting))
            }
        }

        const addSymbols = async (arrayMatrixCells) => {
            const katakana = [
                "ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ", "サ", "シ", "ス", "セ", "ソ", "タ", "チ", "ツ", "テ", "ト", "ナ", "ニ", "ヌ", "ネ",
                "ハ", "ヒ", "フ", "ヘ", "ホ", "マ", "ミ", "ム", "メ", "モ", "ヤ", "ユ", "ヨ", "ラ", "リ", "ル", "レ", "ロ", "ワ", "ヲ", "ン", "ペ", "ポ", "ノ",
                "ガ", "ギ", "グ", "ゲ", "ゴ", "ザ", "ジ", "ズ", "ゼ", "ゾ", "ダ", "ヂ", "ヅ", "デ", "ド", "バ", "ビ", "ブ", "ベ", "ボ", "パ", "ピ", "プ"
            ]

            arrayMatrixCells.forEach(item => {
                item.textContent = katakana[randomize(0, katakana.length - 1)]
            })
        }

        const insertMatrixCells = async (arrayCells) => {
            arrayCells.forEach(item => {
                elements.create(item, "div", null, "matrixCellDefault")
            })
            return Array.from(this.dom.querySelectorAll(".matrixCellDefault"))
        }

        const animatingGroup = async (activeGroup, availableNums, selectedNum, conf, cells) => {
            const group = identifyGroup(selectedNum, conf.direction, cells)
            const animationTempo = conf.steps

            for (let i = 0; i < group.length * 3; i++) {

                if (i < group.length) group[i].classList.add("matrixCellDrawing")
                if (i < group.length && group[i - 1]) group[i - 1].classList.replace("matrixCellDrawing", "matrixCellVisible")

                if (i === group.length) group[i - 1].classList.replace("matrixCellDrawing", "matrixCellVisible")
                if (i >= group.length && i < group.length * 2) group[i - group.length].classList.replace("matrixCellVisible", "matrixCellInvisible")

                if (i === group.length * 3 - 3) {
                    group.forEach(item => item.classList.remove("matrixCellInvisible"))

                    const index = activeGroup.findIndex(item => item === selectedNum)
                    activeGroup.splice(index, 1)
                    availableNums.push(selectedNum)
                }

                await new Promise(resolve => setTimeout(resolve, animationTempo))
            }
        }

        const main = async () => {
            const conf = getConfig()
            applyConfCss(conf)
            const dimensions = [this.container.offsetWidth, this.container.offsetHeight]
            const calculatedGrid = calcGrid(dimensions, conf.cellSize)
            const cells = await drawGrid(calculatedGrid)

            const initMatrix = async () => {
                const matrixCells = await insertMatrixCells(cells)
                await addSymbols(matrixCells)
                let activeGroup = []
                let availableNums = []
                randomIndex(activeGroup, availableNums, conf, calculatedGrid, matrixCells)
            }

            initMatrix()

            /* left to implement attributeChangedCallback REACTIVE*/
        }

        main()
    }
}

customElements.define("matrix-efect", matrix)