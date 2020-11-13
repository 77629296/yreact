/** @jsx Yreact.createElement */
const App = (
  <div>
    <h1 style={{ color: 'red' }}>text-h1</h1>
    <h2>text-h2<span>22</span></h2>
  </div>
)

const container = document.getElementById('root')
Yreact.render(App, container)
