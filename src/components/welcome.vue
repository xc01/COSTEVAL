<template>
  <div class="hello">
    <h1>Hello! {{ usr }}</h1>
    <a href="https://www.baidu.com">指引，如何操作</a>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  data () {
    return {

    }
  },
  props: ['usr'],

  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
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
