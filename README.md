# react socket tutorial

* 1.start
* 2.socket 객체생성
* 3.class 기반
* 4.hooks 기반

## 1. start

### server

```bash
$ cd server
$ npm start
```

### client

```bash
$ cd client
$ npm start
```

[localhost:3001](http://127.0.0.1:3001) 접속

### start using docker

docker 기반 실행

* create image

```bash
$ docker build -t react.tutorial -f ./Docker/Dockerfile .
```

[localhost:3001](http://127.0.0.1:3001) 접속

> 참고: Dockerfile에서 `cmd`는 docker run시 명령어를 전달하면 실행되지 않음. `docker --it {이미지} 명령어` OR `docker exec --it {컨테이너} 명령어`처럼 실행하면 CMD는 실행되지 않는다.

OR

```bash
$ ./createImg.sh
```

* run 

```bash
$ docker run --name r.1 -p 3001:80 -p 3000:3000 react.tutorial:latest
```

OR

```bash
$ ./createContainer.sh
```

* clear

```bash
$ docker stop r.1
$ docker rm r.1
$ docker rmi react.tutorial
```

or 

```bash
$ ./clear.sh
```

## 2. socket 객체생성

**`/client/src/index.js`**

```js
window.socket = io('http://127.0.0.1:3000');
```

하나의 app서는 하나의 소켓 객체를 생성

소켓이 필요한 컴포넌트는 **`window.socket`** 이용

만약, 컴포넌트마다 io(URL)을 하면 하나의 app에서 다수의 소켓 객체생성

서버는 소켓 연결에 대해서 소켓 정보를 저장하고 있음.

## 3. class 기반

```js
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
```

해당 컴포넌트가 mount 됬을 때 on을 이용하여 이벤트 수신

unmount가 됬다면 off이용

## 4. hooks 기반

```js
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

```

hooks의 경우 data가 업데이트되면 다시 렌더링 될 때 return을 이용하여 기존 이벤트를 off한 후 다시 on

만약, return에서 off를 해주지 않으면 data가 update 될 때마다 이벤트가 계속 등록됨

> useEffect는 두 번째 인자가 바뀔 때마다 호출됨.

```js
useEffect(() => {

})
```

두 번째 인자를 전달하지 않으면 해당 컴포넌트가 **`render`** 될 때마다 실행

즉, state가 바뀔때마다 **`render`**가 이루어짐

```js
useEffect(() => {

}, [])
```

두 번째 인자로 빈 리스트([])를 전달하면 해당 컴포넌트가 mount 됬을 때 한번 호출
