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

            <md-button class="md-icon-button" @click="showCreateTopic = true">
              <md-icon>add_comment</md-icon>
            </md-button>
          </div>
        </div>

        <div class="md-toolbar-row">
          <md-tabs class="md-primary">
            <md-tab md-label="Filas" @click="getQueues()"></md-tab>
            <md-tab md-label="Topicos" @click="getTopics()"></md-tab>
          </md-tabs>
        </div>
      </md-app-toolbar>

      <md-app-content>
        <List :isTopic="isTopic"></List>
        <!-- <md-list>
          <md-list-item v-for="queue in queueList" :key="queue.name" class="queue">
            <span class="md-list-item-text">{{ queue.name }}</span>
            <span class="md-list-item-text">{{ queue.qtt }} mensagens</span>
            
            <md-button class="md-icon-button" @click="deleteQueue(queue.name)">
              <md-icon>person_add</md-icon>
            </md-button>
          </md-list-item>
        </md-list> -->
      </md-app-content>


    </md-app>

  <md-dialog :md-active.sync="showCreateQueue" class="dialog">
      <md-dialog-title style="text-align: center">Nova fila</md-dialog-title>

      <md-field>
          <label>Nome da fila</label>
          <md-input v-model="name"></md-input>
      </md-field>

      <md-dialog-actions>
          <md-button class="md-primary" @click="showCreateQueue = false"
              >Cancelar</md-button
          >
          <md-button class="md-primary" @click="createQueue(name)"
              >Criar</md-button
          >
      </md-dialog-actions>
  </md-dialog>

  <md-dialog :md-active.sync="showCreateTopic" class="dialog">
      <md-dialog-title style="text-align: center">Criar topico</md-dialog-title>

      <md-field>
          <label>Nome do topico</label>
          <md-input v-model="name"></md-input>
      </md-field>

      <md-dialog-actions>
          <md-button class="md-primary" @click="showCreateTopic = false"
              >Cancelar</md-button
          >
          <md-button class="md-primary" @click="createTopic(name)"
              >Adicionar</md-button
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
import List from './List'
import { defaultExchanges } from '../utils/defaultExchanges'
import { mapGetters } from 'vuex'

const QUEUE_URL = "http://localhost:15672/api/queues"
const TOPIC_URL = "http://localhost:15672/api/exchanges"

const AUTH = {auth: {'username': 'guest', 'password': 'guest'}}

export default {
  name: 'Manager',
  components: {
    List
  },
  data() {
    return {
      name: "",
      message: "",
      receiver: "",
      queueList: [],
      menuVisible: false,
      users: {},
      topicList: [],
      showCreateQueue: false,
      showCreateTopic: false,
      showAddTopic: false,
      isTopic: false
    }
  },
  computed: {
    ...mapGetters(['items']),
  },
  methods: {
      createQueue: function (queueName) {
        const data = {"isTopic": false, "name": queueName}

        const result = ipc.sendSync('create', data)

        this.$store.commit("insertInQueues", {"name": queueName, "qtt": result})
        this.showCreateQueue = false 
        this.name = ''  
      },
      createTopic: function (topicName) {
        const data = {"isTopic": true, "name": topicName}

        ipc.sendSync('create', data)
        
        this.$store.commit("insertInTopics", {"name": topicName})
        this.showCreateTopic = false 
        this.name = ''   
      },

      getQueues: function () {
        this.isTopic = false
        this.updateQueues()
        this.$store.commit("prepareItems", false)
      },
      getTopics() {
        this.isTopic = true
        this.updateTopics()
        this.$store.commit("prepareItems", true)
      },
      updateQueues() {
        let queues = []

        this.$http
        .get(QUEUE_URL, AUTH)
        .then((response) => {
          response.data.forEach(element => {
            queues.push({"name": element.name, "qtt": element.messages})
          });
        })

        this.$store.commit("setQueues", queues)
      },
      updateTopics() {
        let topics = []

        this.$http
        .get(TOPIC_URL, AUTH)
        .then((response) => {
          response.data.forEach(el => {
            if (!defaultExchanges.includes(el.name)) 
              topics.push({"name": el.name}) 
          }) 
        })

        this.$store.commit("setTopics", topics)
      },
      updateAll() {
        this.updateQueues()
        this.updateTopics()
        this.$store.commit("prepareItems", this.isTopic)
      }
  },
  created: function() {
    this.updateAll()
    this.$store.commit("prepareItems", false)
  }
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
