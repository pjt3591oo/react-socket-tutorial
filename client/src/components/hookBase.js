import React, {useState, useEffect} from 'react';

const HookBase = props => {
  let [data, setData] = useState([])

  useEffect(() => {
    console.log('hookBase renderer')
  })
  useEffect(() => {
    console.log('component mount')
  }, [])

  useEffect(() => {
    let cb = msg => {
      let dump = [...data]  
      dump.push(msg)
      console.log('hookBase receive data update')
      setData(dump)
    }
    window.socket.on('/data', cb)
    
    // off가 없다면 data가 변경될 때마다 .on(/data)이 n개만큼 등록됨
    return () => {
      window.socket.off('/data', cb)
    }
  }, [data]) // data가 변경될 때마다 호출

  const sendData = () => {
    
    window.socket.emit('/data', {data: new Date().getTime()})
  }

  return (
    <div className="App">
      <h2> hook base</h2>
      <button onClick={sendData}>click</button>
      <ul>
        {data.map((item, idx) => (
          <li key={idx}>{item.data}</li>
        ))}
      </ul>
    </div>
  );
}

export default HookBase;
