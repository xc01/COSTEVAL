<template>
<div style="position: absolute;top:0;left:0;width:100%;height:100%; ">
  <el-container>
    <el-main>
      <div id="app">
        <router-view/>
      </div>
    </el-main>
    <el-footer height="35px">
      <div class="fontset">
        <svg-icon icon-class="github-aa-brightgreen"/>
        <el-link href="https://github.com/xc01/aa/tree/master">powered by: lmf xc qxw</el-link>
      </div>
    </el-footer>
  </el-container>
</div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
:root,
body {
  height: 80%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 100%;
}
.el-footer {
  background-color: white;
  position: absolute;
  bottom: 0px;
  width: 100%;
  align-items: center;
}

</style>
<style scoped>
@font-face {
  font-family: Pacifico;
  src: url('./fonts/Pacifico.ttf');
}
.fontset {
  text-align: center;
  font-family: Pacifico;
  font-size: 120%;
}
</style>
