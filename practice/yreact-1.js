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

function render(element, container) {
  // if (element.type === 'h1') return

  // element.props.children.map(child => render(child, dom))
  // container.appendChild(dom)
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  }
}

let nextUnitOfWork = null

function workLoop(deadline) {
  let showYield = false
  while (nextUnitOfWork && !showYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    showYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }

  const elements = fiber.props.children
  let index = 0
  let prevSibling = null

  while(index < elements.length) {
    const element = elements[index]
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    }

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index ++
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

const Yreact = {
  createElement,
  render,
}
