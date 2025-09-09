export const create = (container, tag, idName = null, classNames = null, objAttr = null) => {
    if (!tag || !container) {
        console.log("module newElement: missing parameters\nnot create element")
        return
    }
    
    const createdElement = document.createElement(tag)
    container.appendChild(createdElement)
    if (idName) createdElement.id = idName
    if (classNames) createdElement.className = classNames
    if (objAttr) Object.entries(objAttr).forEach(([key, value]) => createdElement.setAttribute(key, value))

    return createdElement
}

export const css = (item, style) => {
    Object.entries(style).forEach(([key, value]) => {
        item.style[key] = value
    })
}