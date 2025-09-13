import * as elements from "../modules/elements.js"
import * as extra from "../modules/extra.js"

export class test extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = elements.create(this.dom, "div", null, null)


        const style = elements.create(this.dom, "style")
        style.textContent = `
            :host {
                box-shadow: border-box;
                margin: 0;
                padding: 0;

                --cellSize: 20px;
                --backgroundColor: transparent;
                --cellColor: rgba(255, 0, 0, 0.2);
                --gridCols: 3;
                --gridRows: 3;
                --transition: 0s;
            }
        `
        console.log(this.container, style)
    }

}
customElements.define("test-1", test)