import * as element from "../../modules/elements.js"

export class configMenu extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = element.add(this.dom, "div", null, "container")
        this.container.innerHTML = `
            <div id="configBox" class="configBox"></div>
            <div class="closeBox radius4">
                <span class="icon material-symbols-outlined">arrow_menu_open</span>
                <input id="buttonClose" class="hiddenInput" type="checkbox">
            </div>
        `

        element.add(this.dom, "link", null, null, {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap"
        })

        const style = element.add(this.dom, "style", null, null)
        style.textContent += `
            * {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
            }

            .container {
                position: relative;
                width: 100%;
                height: 100%;
                background-color: var(--backColor);
                transition: var(--transition);

                .configBox {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                    padding: 20px;
                    overflow-Y: auto;
                }

                .closeBox {
                    position: absolute;
                    left: calc(-1 * var(--buttonSize) - 10px);
                    top: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: var(--buttonSize);
                    aspect-ratio: 1/1;
                    background-color: var(--backColor);
                    border-radius: 4px;
                    transition: var(--transition);

                    .icon {
                        color: whitesmoke;
                        font-size: 22px;
                        transition: var(--transition);
                    }

                    .hiddenInput { 
                        position: absolute; 
                        width: 100%;
                        height: 100%;
                        z-index: 10; 
                        appearance: none; 
                        cursor: pointer; 
                    }
                }
            }
        `
    }

    connectedCallback() {

        const getConfig = () => {
            const backColor = this.getAttribute("back") ? this.getAttribute("back") : "red"
            const buttonSize = this.getAttribute("buttonSize") ? this.getAttribute("buttonSize") : "30px"
            const transition = this.getAttribute("transition") ? this.getAttribute("transition") : "30px"

            return {
                "backColor": backColor,
                "buttonSize": buttonSize,
                "transition": transition
            }
        }

        const applyConfCss = (conf) => {
            this.style.setProperty("--backColor", conf.backColor)
            this.style.setProperty("--buttonSize", conf.buttonSize)
            this.style.setProperty("--transition", conf.transition)
        }

        const controlMenuDisplay = (input, size) => {
            const hostContainer = this.parentElement
            hostContainer.style.right = input.checked ? 0 : `${hostContainer.offsetWidth * -1}px`

            const closeBox = this.dom.querySelector(".closeBox")
            closeBox.style.top = input.checked ? "10px" : `calc(100% - ${size} - 10px`
            closeBox.querySelector(".icon").style.color = input.checked ? "whitesmoke" : "grey"
        }

        const main = async () => {
            const conf = await getConfig()
            applyConfCss(conf)

            const closeButton = this.dom.querySelector("#buttonClose")
            closeButton.addEventListener("change", () => {
                controlMenuDisplay(closeButton, conf.buttonSize)
                const state = closeButton.checked
                document.dispatchEvent(new CustomEvent("menuVisibility", { detail: { item: this.id, "state": state } }))
            })

            /* initial animation */
/*             closeButton.checked = true
            controlMenuDisplay(closeButton, conf.buttonSize)
 */        }

        main()
    }
}
customElements.define("config-menu", configMenu)