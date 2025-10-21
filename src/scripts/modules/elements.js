export const add = (container, tag, idName = null, classNames = null, objAttr = null, objProps = null) => {
    if (!tag || !container) {
        console.log("module newElement: missing parameters\nnot create element")
        return
    }
    
    const createdElement = document.createElement(tag)
    if (idName) createdElement.id = idName
    if (classNames) createdElement.className = classNames
    if (objAttr) Object.entries(objAttr).forEach(([attr, value]) => {
        if (Array.isArray(value)) createdElement[attr] = value
        if (!Array.isArray(value)) createdElement.setAttribute(attr, value)
    })
    if (objProps) Object.entries(objProps).forEach(([prop, value]) => {createdElement[prop] = value})
    container.appendChild(createdElement)
    return createdElement
}

export const css = (item, style) => {
    Object.entries(style).forEach(([key, value]) => {
        item.style[key] = value
    })
}