const { ipcMain } = require('electron')
const io = require('socket.io')(4113, { serveClient: false});
import axios from 'axios'
var amqp = require('amqplib/callback_api');

console.log("Initializing client...")
const QUEUE_URL = "http://localhost:15672/api/queues"
const AUTH = {auth: {'username': 'guest', 'password': 'guest'}}

ipcMain.on('create', (event, data) => {
  let qtt = 0
  amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
      console.log("rapaaaaaaz da pra conectar nao");;
      
    } else {

      connection.createChannel(function(error1, channel) {
        if (error1) {
          throw error1;
        }
        let qtt = 0

        if(!data.isTopic) {
          channel.assertQueue(data.name, {durable: false}, function (arr, ok) {
            console.log(ok);
            qtt = ok["messageCount"]
          });
        } else {
          channel.assertExchange(data.name, 'fanout', {
            durable: false
          });
        }

      });
    }

  })

  event.returnValue = qtt
})

ipcMain.on('delete', (event, data) => {

    amqp.connect('amqp://localhost', function(error0, connection) {
      if (error0) {
        console.log("rapaaaaaaz da pra conectar nao");;
        
      }
      connection.on( 'error', function(err) {
        //do something
        console.log('An error occurred' + err);
      });

    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }

    if(!data.isTopic) {
      channel.deleteQueue(data.name)
    } else {
      channel.deleteExchange(data.name)
    }

    });
  });
      

  event.returnValue = 'fila deletada!'
})

// Sockets

function getDate(){
  let d = new Date()
  let datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
  d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  
  return datestring
}

io.on('connection', function (socket) {
  socket.on('sendMessage', (data) => {
    console.log(data);
    let handle = {
      ...data,
      "time": getDate(),
    }

    amqp.connect('amqp://localhost', function(error0, connection) {
      if (error0) {
        throw error0;
      }
      connection.createChannel(function(error1, channel) {
        if (error1) {
          throw error1;
        }
        if(!data.isTopic) {    
          channel.assertQueue(data.sentTo, {
            durable: false
          });
    
          let toSend = Buffer.from(JSON.stringify(handle))
          channel.sendToQueue(data.sentTo, toSend);

        } else {
          channel.assertExchange(data.sentTo, 'fanout', {
            durable: false
          });
          channel.publish(data.sentTo, '', Buffer.from(JSON.stringify(handle)));
        }
      });

      setTimeout(function() { 
        connection.close(); 
        }, 500);

    });
  });


  socket.on('userExists', (user, callback) => {    
    axios
    .get(QUEUE_URL, AUTH)
    .then((response) => {
      let queues = response.data.map(element => element.name)
      queues.includes(user) ? callback(true) : callback(false)
    })    
  }) 
})
