/**@jsx Yreact.createElement */
const App = (
  <div>
    <h1>text-h1</h1>
    <h2>text-h2</h2>
  </div>
)

const container = document.getElementById('#root')
Yreact.render(<App/>, container)