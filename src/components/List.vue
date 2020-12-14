<template>
      <md-list>
          <md-list-item v-for="item in items" :key="item.name" class="queue">
            <span class="md-list-item-text">{{ item.name }}</span>
            <span v-if="!isTopic" class="md-list-item-text">{{ item.qtt }} mensagens</span>
            
            <md-button class="md-icon-button" @click="deleteItem(item.name)">
              <md-icon>delete</md-icon>
            </md-button>
          </md-list-item>
        </md-list>
</template>

<script>
const ipc = window.require('electron').ipcRenderer
import { mapGetters } from 'vuex'

export default {
    name: "Chat",
    props: ["isTopic"],
    computed: {
      ...mapGetters(['items']),
    },
    methods: {
      deleteItem: function (name) {
        const data = {"isTopic": this.isTopic, "name": name}
        ipc.sendSync("delete", data); 

        if(!this.isTopic)
          this.$store.commit("removeFromQueues", name)
        else
          this.$store.commit("removeFromTopics", name)

        this.$store.commit("prepareItems", this.isTopic)
      }

    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
