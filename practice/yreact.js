/**
 *
 * @param {*} type
 * @param {*} props
 * @param  {...any} children
 * @return element 自定义的dom对象
 */
function createElement(type, props, ...children) {
  console.log('createElement', type, props, ...children)
  return {
    type,
    props,
    props: {
      ...props,
      // 如果是文本类型 直接返回字符串 如果是对象 说明有子节点
      children: children.map((child) =>
        typeof child === 'object'
          ? child
          : {
              type: 'TEXT_ELEMENT',
              props: {
                children: [],
                nodeValue: child,
              },
            }
      ),
    },
  }
}

function render(element, container) {
  console.log('render', element, container)
  let dom =
    element.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(element.type)
  Object.keys(element.props)
    .filter((key) => key !== 'children')
    .map((key) => (dom[key] = element.props[key]))

  element.props.children.map(child => render(child, dom))

  container.appendChild(dom)
}

const Yreact = {
  createElement,
  render,
}
