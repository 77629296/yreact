function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === 'object'
          ? child
          : {
              type: 'TEXT_ELEMENT',
              props: {
                nodeValue: child,
                children: [],
              },
            }
      ),
    },
  }
}

function render(element, container) {
  const dom =
    element.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(element.type)
  Object.keys(element.props)
    .filter((key) => key !== 'children')
    .map((key) => (dom[key] = element.props[key]))
  element.props.children.map((child) => render(child, dom))
  container.appendChild(dom)
}

const Yreact = {
  createElement,
  render,
}
