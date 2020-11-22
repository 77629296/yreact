function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === 'object' ? child : createTextElement(child)
      ),
    },
  }
}

function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

function createDom(fiber) {
  console.error('createDom', fiber)
  // if (fiber.type === 'h2') throw new Error('33')
  const dom =
    fiber.type == 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type)
  const isProperty = (key) => key !== 'children'
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name]
    })

  return dom
}

function commitRoot() {
  commitWork(wipRoot.child)
  wipRoot = null
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
  console.log('start render', nextUnitOfWork)
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  }
  nextUnitOfWork = wipRoot
  console.log('render end')
}

let nextUnitOfWork = null
let wipRoot = null

function workLoop(deadline) {
  // console.log(deadline, deadline.timeRemaining())
  let shouldYield = false

  // 存在下一个节点 有空闲时间片 执行任务
  while (nextUnitOfWork && !shouldYield) {
    // not only performs the work but also returns the next unit of work.

    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    // deadline.timeRemaining() 返回当前空闲时间的剩余时间
    shouldYield = deadline.timeRemaining() < 1
  }

  if(!nextUnitOfWork && wipRoot) {
    commitRoot()
  }

  // 递归调用
  requestIdleCallback(workLoop)
}

// 首次加载调用一次
requestIdleCallback(workLoop)

/**
 * @param {*} fiber
 */
function performUnitOfWork(fiber) {
  console.log(
    'performUnitOfWork',
    fiber,
    fiber.dom,
    fiber.parent,
    fiber.props.children
  )

  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  // if (fiber.parent) {
  //   fiber.parent.dom.appendChild(fiber.dom)
  // }

  const elements = fiber.props.children
  let index = 0
  let prevSibling = null

  /**
   * 遍历children
   * 子元素创建新的fiber节点
   * 首次进入 遍历[{type: div, props: {children: []}}]
   */
  while (index < elements.length) {
    const element = elements[index]
    console.warn('element', element)
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    }
    // 第一个节点 挂到fiber.child上
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }

  // 有子元素 直接返回
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber

  // 直到找到兄弟节点返回
  while (nextFiber) {
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
