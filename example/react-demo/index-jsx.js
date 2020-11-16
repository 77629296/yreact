const createElement = (type, props, ...children) => {
  console.log('createElement', type, props, ...children)
  return React.createElement(type, props, ...children)
}

/** @jsx createElement */
const App = <div>
  <h1>hello</h1>
  <h2>333</h2>
</div>


ReactDOM.render(App, document.getElementById('root'))
