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

function createDom(fiber) {
  const dom =
    fiber.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type)
  Object.keys(fiber.props)
    .filter((key) => key !== 'children')
    .map((key) => (dom[key] = fiber.props[key]))
  return dom
  // fiber.props.children.map((child) => render(child, dom))
  // container.appendChild(dom)
}

/**
 * 递归调用
 * 1.属性赋值 1.逐级添加节点
 *
 * 缺点:
 * 1.一气呵成，结束前不释放主进程，节点多导致卡顿 改为任务分片
 */
function render(element, container) {
  // 首次调用
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
  // 有时间 且有节点 更新任务
  while (nextUnitOfWork && !showYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    showYield = deadline.timeRemaining() < 1
  }

  // 递归调用 检查任务片
  requestIdleCallback(workLoop)
}

// 浏览器空闲时间调用
requestIdleCallback(workLoop)

// 执行任务片 返回下一个任务
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
    if(nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

const Yreact = {
  createElement,
  render,
}
