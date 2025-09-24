export class emptyTest extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({mode: "open"})
        this.container = document.createElement("div")
        this.container.classList.add("container")
        this.dom.appendChild(this.container)

        const style = document.createElement("style")
        this.dom.appendChild(style)
        style.textContent = `
            :host {
                width: 100%;
                height: 100%;
            }

            .container {
                width: 100%;
                height: 100%;
                background-color: grey;
            }
        `

        console.log(this.container, style)
    }
}
customElements.define("empty-test", emptyTest)