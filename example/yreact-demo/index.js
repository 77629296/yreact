/** @jsx Yreact.createElement */
let dom = []
for(let i = 0; i < 100; i++) {
  dom.push({
    type: 'span',
    props: {
      children: [{
        type: 'TEXT_ELEMENT',
        props: {
          nodeValue: i,
          children: []
        }
      }]
    }
  })
}

const App = (
  <div>
    <h1>yreact-text</h1>
    <h2>yreact-demo</h2>
    {
    {
      type: 'div',
      props: {
        children: dom
      }
    }
    }
  </div>
)
const container = document.getElementById('root')
Yreact.render(App, container)
