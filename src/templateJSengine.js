export const templateJSengine = block => {
    if ((block === undefined) || (block === null) || (block === false)) {
        return document.createTextNode(``)
    }

    if ((typeof block === `string`) || (typeof block === `number`) || (block === true)) {
        return document.createTextNode(block)
    }

    if (Array.isArray(block)) {
        return block.reduce(function (f, item) {
            f.appendChild(templateJSengine(item))

            return f
        }, document.createDocumentFragment())
    }

    const element = document.createElement(block.tag)

    element.classList.add(...[].concat(block.cls || []))

    if (block.attrs) {
        Object.keys(block.attrs).forEach(key => {
            element.setAttribute(key, block.attrs[key])
        })
    }

    if (block.content) {
        element.appendChild(templateJSengine(block.content))
    }

    return element
  }
