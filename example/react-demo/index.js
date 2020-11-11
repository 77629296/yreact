function App(props) {
  return <h1>{props.name} demo!</h1>
}

ReactDOM.render(<App name={'react'} />, document.getElementById('root'))
