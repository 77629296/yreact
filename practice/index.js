/**@jsx Yreact.createElement */
const testDom = {
  type: 'div',
  props: {
    children: []
  }
}
for(let i = 0; i < 100000; i++) {
  testDom.props.children.push({
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: i,
      children: []
    }
  })
}
// new Array(100).forEach(item => testDom.push({
//   type: 'TEXT_ELEMENT',
//   props: {
//     nodeValue: item,
//     children: []
//   }
// }))
console.log(testDom);
const App = (
  <div>
    <h1>text-h1</h1>
    <h2>text-h2</h2>
    {
      testDom
      
    }
  </div>
)

const container = document.getElementById('root')
Yreact.render(App, container)