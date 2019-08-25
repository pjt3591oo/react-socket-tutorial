module.exports = (io) => {
  io.on('connection', socket => {
    console.log('connection')
    socket.on('/data', msg => {
      console.log('/data')
      console.log('receive data:', msg)
      io.emit('/data', msg)
    })
  })
};