import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

Vue.config.productionTip = false

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      items: [],
      queues: [],
      topics: []
    },
    mutations: {
      prepareItems: function (state, isTopic){
        state.items = isTopic ? state.topics : state.queues
      },
      insertInQueues: (state, queue) => { 
        if(!_.map(state.queues, (q) => q.name).includes(queue.name))
          state.queues.push(queue) 
      },
      insertInTopics: (state, topic) => {
        if(!_.map(state.topics, (t) => t.name).includes(topic.name))
          state.topics.push(topic)
      },
      setQueues: (state, queues) => state.queues = queues,
      setTopics: (state, topics) => state.topics = topics,
      removeFromQueues: (state, queueName) => 
        state.queues = _.reject(state.queues, (queue) => queue.name === queueName),
      removeFromTopics: (state, topicName) => 
        state.topics = _.reject(state.topics, (topic) => topic.name === topicName)
    },
    getters: {
      items: state => state.items,
    }
})