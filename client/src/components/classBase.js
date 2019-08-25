import React from 'react';

class ClassBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };

    this.sendData = this.sendData.bind(this)
    this.cb = this.cb.bind(this)
  }

  cb (msg) {
    let dump = [...this.state.data]  
    dump.push(msg)
    console.log('classBase receive data update')
    this.setState({
      data: dump
    })
  }

  componentDidMount () {
    console.log('component mount')
    window.socket.on('/data', this.cb)
  }

  componentWillUnmount () {
    window.socket.off('/data', this.cb)
  }

  sendData() {
    window.socket.emit('/data', {data: new Date().getTime()})
  }

  render () {
    console.log('classBase renderer')
    return (
      <div className="app">
        <h2>classBase</h2>
        <button onClick={this.sendData}>click</button>
        <ul>
          {this.state.data.map((item, idx) => (
            <li key={idx}>{item.data}</li>
          ))}
        </ul>
      </div>
    )
  }
}

export default ClassBase