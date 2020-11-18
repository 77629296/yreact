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
                children: [],
                nodeValue: child,
              },
            }
      ),
    },
  }
}

function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
  }
  
}

function createDom(fiber) {
  let dom =
  fiber.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type)

  Object.keys(fiber.props)
    .filter((key) => key !== 'children')
    .map((key) => (dom[key] = fiber.props[key]))
  return dom
}

function workLoop(deadline) {
  let showYeild = false
  while (nextUnitOfWork && !showYeild) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    showYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}

function performUnitOfWork(fiber) {
  if(!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  if(fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }

  const elements = fiber.props.children
  let prevSibling = null
  for (let index = 0; index < elements.length; index++) {
    const element = elements[index];
    const newFiber = {
      dom: null,
      props: element.props,
      parent: fiber,
      type: element.type
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
  while(nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

requestIdleCallback(workLoop)

let nextUnitOfWork = null

const Yreact = {
  createElement,
  render,
}
