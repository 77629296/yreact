
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => typeof child === 'object' ? child: {
        type: 'TEXT_ELEMENT',
        props: {
          children: [],
          nodeValue: child
        }
      })
    }
  }
}

function createDom(fiber) {
  let dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type);
  Object.keys(fiber.props).filter(key => key !== 'children').map(key => dom[key] = fiber.props[key])
  return dom
}

function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
  }
  

  // container.appendChild(dom)
  // element.props.children.map(child => render(child, dom))
}

function workLoop(deadline) {
  let shouldYeild = false
  while (nextUnitOfWork && !shouldYeild) {
    shouldYeild = deadline.timeRemaining() < 1
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
  console.log('requestIdleCallback');
  requestIdleCallback(workLoop)
}

let nextUnitOfWork = null

function performUnitOfWork(fiber) {

  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }
  // 
  let elements = fiber.props.children
  let prevSibling = null

  elements.map((element, index) => {
    let newFiber = {
      type: element.type,
      props: element.props,
      dom: null,
      parent: fiber
    }
    
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
    
    prevSibling = newFiber
  })
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
  render
}