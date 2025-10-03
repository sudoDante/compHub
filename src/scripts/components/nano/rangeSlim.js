import * as element from "./../../modules/elements.js"

export class rangeSlim extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = element.add(this.dom, "div", null, "container")
        this.container.innerHTML = `
            <span class="title"></span>
            <div class="rangeBox">
                <div class="range">
                    <div class="bar"></div>
                    <div class="pointer">
                    </div>
                </div>
                <span class="valueBox"></span>
            </div> 
        `

        const style = element.add(this.dom, "style", null, null)
        style.textContent = `
            .container {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: 100%;
                height: 50px;
                margin-bottom: 30px;

                .title {
                    display: flex;
                    width: fit-content;
                    height: fit-content;
                    font-family: var(--font);
                    color: var(--fontColor);   
                }

                .rangeBox {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    height: 30px;
                    padding: 0 20px 0 20px;
                    border: 1px solid red;

                    .range {
                        position: relative;
                        width: calc(100% - 68px);
                        height: 20px;
                        cursor: pointer;

                        .bar {
                            position: absolute;
                            bottom: 14px;
                            width: 100%;
                            height: 2px;
                            background-color: rgba(255, 255, 255, 0.1);
                            border-radius: 10px;
                        }

                        .pointer {
                            position: absolute;
                            bottom: 11px;
                            left: 0;
                            width: 20px;
                            height: 8px;
                            background-color: rgba(255, 255, 255, 1);
                            outline: 8px solid transparent;
                            border-radius: 2px;
                            background-color: whitesmoke;
                        }                
                    }

                    .valueBox {
                        width: 30px;
                        height: 30px;
                        color: grey;
                        font-family: var(--font);
                        font-size: 14px; 
                        font-style: italic; 
                        valueBox.style.transform = "scale(100%)" 
                    }
                }
            }
        `
    }
    connectedCallback() {

        const write = () => {
            const title = this.dom.querySelector(".title")
            if (this.getAttribute("title")) title.textContent = this.getAttribute("title")
            if (this.getAttribute("font")) this.style.setProperty("--font", this.getAttribute("font"))
            if (this.getAttribute("fontSize")) title.style.fontSize = this.getAttribute("fontSize")
            if (this.getAttribute("fontColor")) this.style.setProperty("--fontColor", this.getAttribute("fontColor"))
        }

        const activeDrag = () => {
            const range = this.dom.querySelector(".range")
            const min = Number(this.getAttribute("min"))
            const max = Number(this.getAttribute("max"))
            const value = Number(this.getAttribute("value"))
            const selected = this.dom.querySelector(".pointer")
            const valueBox = this.dom.querySelector(".valueBox")

            const boxWidth = range.offsetWidth
            const initialValue = ((value - min) / (max - min)) * boxWidth
            selected.style.left = `${initialValue}px`
            valueBox.textContent = value

            const select = () => {
                document.addEventListener("mousemove", move)
                document.addEventListener("mouseup", release)
            }

            const move = (e) => {
                if (selected) {
                    let x = e.clientX - range.getBoundingClientRect().left
                    if (x >= 0 && x <= boxWidth) {
                        selected.style.left = `${x}px`
                        let userValue = Math.round(min + ((max - min) * (x / boxWidth)))
                        valueBox.textContent = userValue
                        valueBox.style.transition = "200ms"
                        valueBox.style.color = "greenyellow"
                        valueBox.style.transform = "scale(140%)"
                    }
                } else { return }
            }

            const release = () => {
                valueBox.style.color = "grey"
                valueBox.style.transform = "scale(100%)"
                valueBox.style.transition = "3000ms"
                document.removeEventListener("mousemove", move)
                document.removeEventListener("mouseup", release)
            }

            range.addEventListener("mousedown", move)
            range.addEventListener("mousedown", select)
            selected.addEventListener("mousedown", select)
        }

        write()
        activeDrag()
    }
}
customElements.define("range-slim", rangeSlim)