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
  // element.props.children.forEach((child) => render(child, dom))
  // container.appendChild(dom)
}

function render(element, container) {
  console.log('start render', nextUnitOfWork)
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  }
  console.log('render end')
}

let nextUnitOfWork = null

function workLoop(deadline) {
  // console.log(deadline, deadline.timeRemaining())
  let shouldYield = false

  // 存在下一个节点 有空闲时间片 执行任务
  while (nextUnitOfWork && !shouldYield) {
    // not only performs the work but also returns the next unit of work.

    /**
     * 梳理每一步的数据结构 方便理解
     * 第一次nextUnitOfWork
     */
    var firstFiber = {
      // 第二次运行后 dom中增加div
      dom: '<div id="root"></div> -> <div id="root"><div></div></div>',
      props: {
        children: [
          {
            type: 'div',
            props: {
              children: [
                {
                  type: 'h1',
                  props: {
                    children: [
                      {
                        type: 'TEXT_ELEMENT',
                        props: {
                          nodeValue: 'yreact-text',
                          children: [],
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'h2',
                  props: {
                    children: [
                      {
                        type: 'TEXT_ELEMENT',
                        props: {
                          nodeValue: 'yreact-demo',
                          children: [],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      // 第二次nextUnitOfWork
      // 第一次运行后 增加child
      child: {
        type: 'div',
        props: {
          children: [
            {
              type: 'h1',
              props: {
                children: [
                  {
                    type: 'TEXT_ELEMENT',
                    props: {
                      nodeValue: 'yreact-text',
                      children: [],
                    },
                  },
                ],
              },
            },
            {
              type: 'h2',
              props: {
                children: [
                  {
                    type: 'TEXT_ELEMENT',
                    props: {
                      nodeValue: 'yreact-demo',
                      children: [],
                    },
                  },
                ],
              },
            },
          ],
        },
        parent: firstFiber,

        // 第二次运行后
        dom: 'null -> <div></div>',
        // 第三次运行后
        dom: '<div></div> -> <div><h1></h1></div>',
        // 第五次运行
        dom: '<div></div> -> <div><h1></h1><h2></h2></div>',

        // 第三次nextUnitOfWork
        child: {
          type: 'h1',
          props: {
            children: [
              {
                type: 'TEXT_ELEMENT',
                props: {
                  nodeValue: 'yreact-text',
                  children: [],
                },
              },
            ],
          },
          // parent: firstFiber.child,

          // 第四次nextUnitOfWork
          child: {
            type: 'TEXT_ELEMENT',
            props: {
              nodeValue: 'yreact-text',
              children: [],
            },
            // parent: firstFiber.child.child,
            // 第四次运行后
            dom: 'null -> yreact-text',
          },
          // 第三次运行后
          dom: 'null -> <h1></h1>',
          // 第四次运行后
          dom: 'null -> <h1>yreact-text</h1>',

          // 第五次nextUnitOfWork
          sibling: {
            type: 'h2',
            props: {
              children: [
                {
                  type: 'TEXT_ELEMENT',
                  props: {
                    nodeValue: 'yreact-demo',
                    children: [],
                  },
                },
              ],
            },
            // parent: firstFiber.child,

            // 第六次nextUnitOfWork
            child: {
              type: 'TEXT_ELEMENT',
              props: {
                nodeValue: 'yreact-demo',
                children: [],
              },
              // parent: firstFiber.child.child,
              // 第六次运行后
              dom: 'null -> yreact-demo',
            },
            // 第五次运行后
            dom: 'null -> <h2></h2>',
            // 第六次运行后
            dom: '<h2></h2> -> <h2>yreact-demo</h2>',
          },
        },
      },
    }

    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
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
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }

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
