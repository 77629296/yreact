/** @jsx Yreact.createElement */
const container = document.getElementById('root')

const updateValue = (e) => {
  rerender(e.target.value)
}

const rerender = value => {
  console.log(value)
  const element = (
    <div>
      <input onInput={updateValue} value={value} />
      <h2>Hello {value}</h2>
    </div>
  )
  Yreact.render(element, container)
}

rerender("World")
