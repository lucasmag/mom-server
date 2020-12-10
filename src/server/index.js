const { ipcMain } = require('electron')
const io = require('socket.io')(4113, { serveClient: false});



var amqp = require('amqplib/callback_api');

var exec = require("child_process").exec
console.log("Initializing client...")
/*
messages = {
  ["lucas", "mat"]: [
      {"username": "lucas", "message": "eae mano"},
      {"username": "mat", "message": "tmj"},
    ]
}

*/

ipcMain.on('create-queue', (event, queueName) => {
  let qtt = 0
  amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }

      channel.assertQueue(queueName, {durable: false}, function (arr, ok) {
        console.log(ok);
        let qtt = ok["messageCount"]
      });
    });

  })

  event.returnValue = qtt
})

ipcMain.on('delete-queue', (event, queue) => {

    amqp.connect('amqp://localhost', function(error0, connection) {
      connection.on( 'error', function(err) {
        //do something
        console.log('An error occurred' + err);
      });

    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }

    channel.checkQueue(queue, function(err, ok) {
      console.log(err, ok);
    });

    channel.deleteQueue(queue)

    });
  });
      

  event.returnValue = 'fila deletada!'
})

// ipcMain.on('update-all', (event, allQueues) => {
//   amqp.connect('amqp://localhost', function(error0, connection) {
//     if (error0) {
//       throw error0;
//     }
//     connection.createChannel(function(error1, channel) {
//       if (error1) {
//         throw error1;
//       }

//       for (const [ queue, qtt ] of Object.entries(allQueues)) {
//         channel.assertQueue(queue, {durable: false}, function (arr, ok) {
//           event.returnValue = ok["messageCount"]
//         });
//       }

//       // //return { queue: 'teste', messageCount: 0, consumerCount: 0 }
//       // channel.assertQueue(queue, {durable: false}, function (arr, ok) {
//       //   console.log(ok);
//       // });

//       channel.deleteQueue(queue)
//     });
//   });
//   event.returnValue = 'fila deletada!'
// })


ipcMain.on('create-client', (event, arg) => {
  exec("yarn electron:serve", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
  
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
    let handle = {"time": getDate(), "message": data["message"], "queue": data["user"], "user": data["user"]}

    amqp.connect('amqp://localhost', function(error0, connection) {
      if (error0) {
        throw error0;
      }
      connection.createChannel(function(error1, channel) {
        if (error1) {
          throw error1;
        }
        var queue = data["queue"];
  
        channel.assertQueue(queue, {
          durable: false
        });
  
        let toSend = Buffer.from(JSON.stringify(handle))

        channel.sendToQueue(queue, toSend);
      });

    });
  });

  socket.on('sendMessage', (data) => {
    console.log(data);
    let handle = {"time": getDate(), "message": data["message"], "queue": data["user"], "user": data["user"]}

    amqp.connect('amqp://localhost', function(error0, connection) {
      if (error0) {
        throw error0;
      }
      connection.createChannel(function(error1, channel) {
        if (error1) {
          throw error1;
        }
        var queue = data["queue"];
  
        channel.assertQueue(queue, {
          durable: false
        });
  
        let toSend = Buffer.from(JSON.stringify(handle))

        channel.sendToQueue(queue, toSend);
      });

    });
  });

})
