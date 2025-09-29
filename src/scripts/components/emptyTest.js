export class emptyTest extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({mode: "open"})
        this.container = document.createElement("div")
        this.container.classList.add("container")
        this.container.innerHTML = `
            <span>Test Mode</span>
        `
        this.dom.appendChild(this.container)

        const style = document.createElement("style")
        this.dom.appendChild(style)
        style.textContent = `
            :host {
                width: 100%;
                height: 100%;
            }

            .container {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                background-color: rgba(28, 28, 28, 0.78);

                span {
                    padding: 16px 40px;
                    border-radius: 8px;
                    background-color: rgba(0, 0, 0, 0.4);
                    font-size: 30px;
                    font-family: anta;
                    color: rgba(255, 255, 255, 0.85);
                    font-style: italic;
                }
            }
        `

        console.log(this.container, style)
    }
}
customElements.define("empty-test", emptyTest)