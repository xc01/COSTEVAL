<template>
  <div class="hello">
    <img alt="Vue logo" class="element-plus-logo" width="50%" src="../assets/logo.gif" />
    <div class="fontset">
      <h1 >Hello! {{ usr }}</h1>
    </div>
    <a href="https://www.baidu.com">点击查看操作引导</a>
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
.hello {
  margin-top: 8%;
}
@font-face {
  font-family: malvie;
  src: url('../fonts/malvie.ttf');
}
.fontset {
  font-family: malvie;
  font-size: 120%;
}
</style>
