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

  updateDom(dom, {}, fiber.props)
  // const isProperty = (key) => key !== 'children'
  // Object.keys(fiber.props)
  //   .filter(isProperty)
  //   .forEach((name) => {
  //     dom[name] = fiber.props[name]
  //   })

  return dom
}

const isEvent = (key) => key.startsWith('on')
const isProperty = (key) => key !== 'children' && !isEvent(key)
const isNew = (prev, next) => (key) => prev[key] !== next[key]
const isGone = (prev, next) => (key) => !(key in next)

function updateDom(dom, prevProps, nextProps) {
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2)
      dom.removeEventListener(eventType, prevProps[name])
    })

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = ''
    })

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name]
    })

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, nextProps[name])
    })
}

function commitRoot() {
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom

  if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
    domParent.appendChild(fiber.dom)
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
    updateDom(fiber.com, fiber.alternate.props, fiber.props)
  } else if (fiber.effectTag === 'DELETION') {
    domParent.removeChild(fiber.dom)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function render(element, container) {
  console.log('start render', nextUnitOfWork, currentRoot)
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  }
  deletions = []
  nextUnitOfWork = wipRoot
  console.log('end render')
}

let nextUnitOfWork = null
let currentRoot = null
let wipRoot = null
let deletions = null

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
    // deadline.timeRemaining() 返回当前空闲时间的剩余时间
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextUnitOfWork && wipRoot) {
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

  const elements = fiber.props.children

  reconcileChildren(fiber, elements)

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

function reconcileChildren(wipFiber, elements) {
  console.log('reconcileChildren', wipFiber)
  let index = 0
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child
  let prevSibling = null

  while (index < elements.length || oldFiber != null) {
    const element = elements[index]
    let newFiber = null

    const sameType = oldFiber && element && element.type == oldFiber.type

    // 节点类型相同 复用原节点 更新
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        // commit阶段使用
        effectTag: 'UPDATE',
      }
    }

    // 节点类型不同 新增
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT',
      }
    }

    // 删除
    if (oldFiber && !sameType) {
      oldFiber.effectTag = 'DELETION'
      deletions.push(oldFiber)
    }

    // compare oldFiber
    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      wipFiber.child = newFiber
    } else if (element) {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }

  // let index = 0
  // let prevSibling = null

  /**
   * 遍历children
   * 子元素创建新的fiber节点
   * 首次进入 遍历[{type: div, props: {children: []}}]
   */
  // while (index < elements.length) {
  //   const element = elements[index]
  //   console.warn('element', element)
  //   const newFiber = {
  //     type: element.type,
  //     props: element.props,
  //     parent: fiber,
  //     dom: null,
  //   }
  //   // 第一个节点 挂到fiber.child上
  //   if (index === 0) {
  //     fiber.child = newFiber
  //   } else {
  //     prevSibling.sibling = newFiber
  //   }

  //   prevSibling = newFiber
  //   index++
  // }
}

const Yreact = {
  createElement,
  render,
}
