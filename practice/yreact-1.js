
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => typeof child === 'object' ? child : {
        type: 'TEXT_ELEMENT',
        props: {
          children: [],
          nodeValue: child,
        }
      })
    }
  }
}

function createDom(fiber) {
  let dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type)
  Object.keys(fiber.props).filter(key => key !== 'children').map(key => dom[key] = fiber.props[key])
  return dom
}

function commitRoot() {
  commitWork(vRoot.child)
  vRoot = null
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  domParent.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function render(element, container) {
  vRoot = {
    dom: container,
    props: {
      children: [element]
    }
  }
  nextUnitOfWork = vRoot
}

let nextUnitOfWork = null
let vRoot = null

function workLoop(params) {
  while (nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
  if (!nextUnitOfWork && vRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}

function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  // if (fiber.parent) {
  //   fiber.parent.dom.appendChild(fiber.dom)
  // }

  let elements = fiber.props.children
  let prevSibling = null
  for (let index = 0; index < elements.length; index++) {
    const element = elements[index];
    let newFiber = {
      type: element.type,
      props: element.props,
      dom: null,
      parent: fiber,
    }

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
  }

  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

requestIdleCallback(workLoop)

const Yreact = {
  createElement,
  render,
}