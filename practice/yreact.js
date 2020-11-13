
function createElement(type, props, ...children) {
  console.log('createElement', type, props, children);
  // 拼接数据
  return {
    type,
    props: {
      ...props,
      children: children.map(child => typeof child === 'string' ? {
        type: 'TEXT_ELEMENT',
        props: {
          nodeValue: child,
          children: []
        }
      } : child)
    }
  }
}

function render(element, container) {
  const dom = element.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(element.type)

  // if (element.type === 'h2') return
  console.log('render', element.type, element, container);
  Object.keys(element.props)
  
  Object.keys(element.props).filter(key => key !== 'children').map(key => dom[key] = element.props[key])
  element.props.children.map(child => render(child, dom))

  container.appendChild(dom)
}

const Yreact = {
  createElement,
  render
}