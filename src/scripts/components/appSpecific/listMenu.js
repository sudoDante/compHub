/* ATTRIBUTES
list                object items list               required
title               title descrition                required
titleBackColor      title background color          no required
back                component background color      no required 
color1              color selected items menu       no required 
color2              color selected items subMenu    no required
*/

import * as element from "../../modules/elements.js"

export class listMenu extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.dom.innerHTML = `
            <div id="container" class="container">
                <div id="title" class="title center radius4"></div>
                <div id="menu" class="menu scrollHidden"></div>
            </div>
        `

        const style = element.add(this.dom, "style", null, null)
        style.textContent = `
            :host {
                box-sizing: border-box;
                padding: 0;
                margin: 0;

                --titleHeight: 40px;
                --transition: 300ms;
                --optionHeight: 46px;
                --optionSubHeight: 36px;
                --radius: 4px;
            }

            .center {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .darkCrystal {
                backdrop-filter: blur(4px);
            }

            .scrollHidden {
                overflow-y: auto;
                scrollbar-width: none;
            
                &::webkit-scrollbar {
                    display: none;
                }
            }

            .radius4 {
                border-radius: var(--radius);
            }

            .radioHidden {
                position: absolute;
                z-index: 10;
                appearance: none;
                width: 100%;
                height: 100%;
                cursor: pointer;
            }

            .container {
                width: 100%;
                height: 100%;
                background-color: var(--back);
                padding: 10px;

                .title {
                    width: 100%;
                    height: var(--titleHeight);
                    background-color: var(--titleBack);
                    font-size: 18px;
                    font-family: "anta";
                    color: rgb(60, 60, 60);
                    margin-bottom: 10px
                }

                .menu {
                    width: 100%;
                    height: calc(100% - var(--titleHeight) - 30px); 
                    color: whitesmoke;

                                        
                    & .option:has(input:not(:checked):hover) .nameBox {
                        background-color: var(--color1);
                        color: rgb(28, 28, 28);
                        transition: var(--transition);
                    }

                    & .option:has(input:checked) {
                        .nameBox {
                            background-color: var(--color3);
                            color: whitesmoke;
                            font-style: italic;
                        }

                        .expand {
                            flex: 1;
                        }
                    }
                    
                    .option {
                        position: relative;
                        width: calc(100% - 2px);
                        height: var(--optionHeight);
                        cursor: pointer;
                        transition: var(--transition);

                        .nameBox {
                            display: flex;
                            align-items: center;
                            width: 100%;
                            height: 34px;
                            padding: 0 10px;
                            transition: var(--transition);

                            .expand {
                                display: flex;
                                align-items: center;
                                width: 0px;
                                height: 100%;
                                transition: var(--transition);
                            }

                            .name {
                                width: auto;
                                height: auto;
                                padding-right: 10px;
                            }
                        }
                    }

                    .expandMenu {
                        width: calc(100% - 2px);
                        height: 0;
                        overflow-y: hidden;
                        transition: var(--transition);

                        .optionSub {
                            position: relative;
                            margin-left: 20%;
                            width: 80%;
                            height: var(--optionSubHeight);

                            &:hover .nameBoxSub {
                                background-color: var(--color1);
                                color: rgb(28, 28, 28);
                            }

                            &:has(input:checked) {
                                .nameBoxSub {
                                    background: linear-gradient(90deg ,rgba(255, 0, 0, 0) 0%, var(--color2) 50%);
                                    color: whitesmoke;
                                    font-style: italic;

                                    .expandSub {
                                        flex: 1;
                                        overflow: visible;

                                        .rotate {
                                            opacity: 0.5;

                                            &:last-of-type {
                                                animation: 8s rotate infinite linear reverse;
                                            }
                                        }
                                    }
                                }
                            }

                            .nameBoxSub {
                                display: flex;
                                align-items: center;
                                width: 100%;
                                height: 28px;
                                padding: 0 10px;
                                    transition: var(--transition);

                                .expandSub {
                                    position: relative;
                                    width: 0px;
                                    height: 100%;
                                    transition: var(--transition);
                                    overflow: hidden;

                                    .rotate {
                                        position: absolute;
                                        left: -40%;
                                        height: 20px;
                                        aspect-ratio: 1/1;
                                        border: 4px dashed whitesmoke;
                                        border-radius: 50%;
                                        opacity: 0;
                                    }
                                }

                                .nameSub {
                                    width: auto;
                                    height: auto;
                                    padding-right: 10px;
                                }
                            }
                        }
                    }
                }
            } 
                
            @keyframes rotate {
                0% {transform: rotate(0deg);}
                50% {transform: rotate(180deg);}
                100% {transform: rotate(360deg);}
            }
        `
    }

    connectedCallback() {

        const getConfig = () => {
            const list = this["list"]
            const title = this.getAttribute("title") ? this.getAttribute("title") : "Default Title"
            const titleBack = this.getAttribute("titleBack") ? this.getAttribute("titleBack") : "rgba(230, 230, 230, 1)"
            const color1 = this.getAttribute("color1") ? this.getAttribute("color1") : "rgba(230, 230, 230, 1)"
            const color2 = this.getAttribute("color2") ? this.getAttribute("color2") : "rgba(77, 157, 163, 1)"
            const color3 = this.getAttribute("color3") ? this.getAttribute("color3") : "rgba(128, 167, 155, 1)"
            const back = this.getAttribute("back") ? this.getAttribute("back") : "rgba(0, 0, 0, 0.8)"

            return {
                "list": list,
                "title": title,
                "titleBack": titleBack,
                "back": back,
                "color1": color1,
                "color2": color2,
                "color3": color3
            }
        }

        const applyConfCss = (conf) => {
            if (conf.titleBack) this.style.setProperty("--titleBack", conf.titleBack)
            if (conf.back) this.style.setProperty("--back", conf.back)
            if (conf.color1) this.style.setProperty("--color1", conf.color1)
            if (conf.color2) this.style.setProperty("--color2", conf.color2)
            if (conf.color3) this.style.setProperty("--color3", conf.color3)
        }

        /*         
                const setListeners = async (array, conf) => {
                    const transition = parseFloat(getComputedStyle(this).getPropertyValue("--transition"))
        
                    array.forEach(item => {
                        console.log(item)
                        item.addEventListener("click", () => document.dispatchEvent(
                            new CustomEvent(`listMenu_${conf.menuMode}`, {
                                detail: {
                                    pos: item.getAttribute("pos"),
                                    time: transition
                                }
                            })
                        ))
                    })
                }
         */

        const setMenu = async (conf) => {
            this.dom.querySelector("#title").textContent = conf.title

            let list = []
            Object.values(conf.list).forEach(item => {
                list.push(item)
            })

            const menu = this.dom.querySelector("#menu")

            list.forEach((item, num) => {
                const itemName = item.type
                const componentObj = item.components

                const menuOption = element.add(menu, "div", null, "option center", { pos: num })
                const nameBox = element.add(menuOption, "span", null, "nameBox  radius4")
                const expand = element.add(nameBox, "div", null, "expand")
                const name = element.add(nameBox, "div", null, "name")
                name.textContent = itemName
                const radio = element.add(menuOption, "input", null, "radioHidden", { type: "radio", name: "mainOpt", pos: num })

                const expandMenu = element.add(menu, "div", null, "expandMenu scrollHidden", { pos: num })
                componentObj.forEach(item => {
                    const optionSub = element.add(expandMenu, "div", null, "optionSub center")
                    const nameBoxSub = element.add(optionSub, "span", null, "nameBoxSub radius4")
                    const expandSub = element.add(nameBoxSub, "div", null, "expandSub center")
                    const rotate1 = element.add(expandSub, "div", null, "rotate")
                    const rotate2 = element.add(expandSub, "div", null, "rotate")
                    const nameSub = element.add(nameBoxSub, "div", null, "nameSub")
                    nameSub.textContent = item.name
                    const radioSub = element.add(optionSub, "input", null, "radioHidden", { type: "radio", name: "SubOpt", pos: num })
                })
            })

            return Array.from(menu.querySelectorAll("input[name='mainOpt']"))
        }

        const setListeners = (array) => {
            const allExpands = Array.from(this.dom.querySelectorAll(".expandMenu"))

            array.forEach(item => {
                item.addEventListener("change", () => {
                    const index = item.getAttribute("pos")
                    const expandMenu = this.dom.querySelector(`.expandMenu[pos='${index}']`)
                    allExpands.forEach(item => {
                        item.style.height = "0px"
                    })

                    const multiplier = expandMenu.children.length
                    const height = parseFloat(getComputedStyle(this).getPropertyValue("--optionSubHeight"))
                    expandMenu.style.height = `calc(${height * multiplier}px)`
                })
            })
        }

        const main = async () => {
            const conf = getConfig()
            applyConfCss(conf)
            const mainRadios = await setMenu(conf)
            setListeners(mainRadios)
        }

        main()
    }
}
customElements.define("list-menu", listMenu)