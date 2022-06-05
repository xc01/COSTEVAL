<template>
  <div class="hello">
    <h1>Hello! {{ usr }}</h1>
    <a href="https://www.baidu.com">指引，如何操作</a>
  </div>
</template>

<script>
import * as Vue from 'vue'
export default {
  name: 'Welcome',
  data() {
    return {}
  },
  props: ['usr'],

  methods: {},
}
</script>

<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
