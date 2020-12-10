<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed-last">
      <md-app-toolbar class="md-large md-dense md-primary">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">

            <span class="md-title">Gerenciar filas e tópicos</span>
          </div>

          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button" @click="updateAll">
              <md-icon>cached</md-icon>
            </md-button>

            <md-button class="md-icon-button" @click="showCreateQueue = true">
              <md-icon>playlist_add</md-icon>
            </md-button>
          </div>
        </div>

        <div class="md-toolbar-row">
          <md-tabs class="md-primary">
            <md-tab md-label="Filas" @click="getQueues()"
            ></md-tab>
            <md-tab md-label="Topicos" @click="getTopics()"
            ></md-tab>
          </md-tabs>
        </div>
      </md-app-toolbar>

      <md-app-content>
        <md-list>
          <md-list-item v-for="(qtt, queue) in queueList" :key="queue" class="queue">
            <span class="md-list-item-text">{{ queue }}</span>
            <span class="md-list-item-text">{{ qtt }} mensagens</span>
            
            <md-button class="md-icon-button" @click="deleteQueue(queue)">
              <md-icon>person_add</md-icon>
            </md-button>
          </md-list-item>
        </md-list>
      </md-app-content>


    </md-app>


  <md-dialog :md-active.sync="showCreateQueue" class="dialog">
      <md-dialog-title style="text-align: center">Nova fila</md-dialog-title>

      <md-field>
          <label>Nome da fila</label>
          <md-input v-model="queueName"></md-input>
      </md-field>

      <md-dialog-actions>
          <md-button class="md-primary" @click="showCreateQueue = false"
              >Cancelar</md-button
          >
          <md-button class="md-primary" @click="createQueue(queueName)"
              >Criar</md-button
          >
      </md-dialog-actions>
  </md-dialog>

    </div>
    
    <!-- <div class="row">
      <md-field>
        <label>Nova fila</label>
        <md-input v-model="queueName"></md-input>
      </md-field>

      <md-button class="md-primary" @click="createQueue(queueName)">Criar nova fila</md-button>
    </div>
    
    <div class="row">
      <md-field>
        <label>Novo tópico</label>
        <md-input v-model="topicName"></md-input>
      </md-field>

      <md-button class="md-primary" @click="createTopic(topicName)">Criar novo tópico</md-button>
    </div>

    <div class="row">
      <md-field>
        <label>Novo usuário</label>
        <md-input v-model="username"></md-input>
      </md-field>

      <md-button class="md-primary" @click="createUser(username)">Criar usuário</md-button>
    </div>

    <md-list>
      <md-list-item v-for="queue in queueList" :key="queue">
        <span class="md-list-item-text">{{ queue }}</span>
      </md-list-item>
    </md-list> -->

</template>

<script>
const ipc = window.require('electron').ipcRenderer
import _ from 'lodash'

export default {
  name: 'Manager',
  data() {
    return {
      queueName: "",
      message: "",
      receiver: "",
      queueList: {},
      menuVisible: false,
      users: {},
      showCreateQueue: false
    }
  },
  computed: {
    messages: function () {
      return this.users[this.username]
    }
  },
  methods: {
      createQueue: function (queueName) {
        let result = ipc.sendSync('create-queue', queueName)
        this.queueList[queueName] = result
        console.log(this.queueList)

        this.showCreateQueue = false    
      },
      deleteQueue: function (queueName) {
        ipc.sendSync("delete-queue", queueName); 
        this.queueList = _.omit(this.queueList, queueName)

        console.log(this.queueList)
        this.showCreateQueue = false    
        
      },
      getQueues: function () {
        const URL = "http://localhost:15672/api/queues"
        const AUTH = {auth: {'username': 'guest', 'password': 'guest'}}

        this.$http.get(URL, AUTH, 
        ).then(response => (
          console.log(response)
        ))    
      },
      updateAll: function () {
        // let result = ipc.sendSync("update-all", this.queueList);
        // this.queueList = result
      }
  },
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import url("https://fonts.googleapis.com/css?family=Material+Icons");
  .row {
    display: flex;
    flex-direction: row;
  }
  .page-container {
    height: 100vh;
  }
  .md-app {
    border: 1px solid rgba(#000, .12);
  }

  .md-drawer {
    width: 400px;
    max-width: calc(100vw - 125px);
  }

  .md-dialog /deep/.md-dialog-container {
    max-width: 768px;
    padding: 30px
}
.queue:hover {
  background-color:rgb(231, 231, 231);
}


</style>
