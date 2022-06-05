<template>
  <el-config-provider namespace="ep">
    <BaseHeader />
    <div style="display: flex">
      <BaseSide />
      <div>
        <router-view></router-view>
      </div>
    </div>
  </el-config-provider>
</template>

<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}

.element-plus-logo {
  width: 50%;
}
</style>


<script lang="ts" setup>
  var pj1 = {name: 'pj1', pid: 1, authrity: 0}
  var pj2 = {name: 'pj2', pid: 2, authrity: 1}
  var pj3 = {name: 'pj3', pid: 3, authrity: 1}
  var pj4 = {name: 'pj4', pid: 4, authrity: 0}
  var project = [pj1, pj2, pj3, pj4]

  var project_list_0 = [], project_list_1 = []
  for (let i = 0; i < project.length; i++) { // 将数组分为两类，一类是审计权限，一类是分析权限
      if (project[i].authrity == 0)
          project_list_0.push(project[i])
      else
          project_list_1.push(project[i])
  }

  const usr = 'lalala'
  const uid = 0
  const exportPath = null

  const updateList_create = (data) => { // 在新建项目后，同步更新该界面的数据，将项目插入到其中
      project.unshift(data)
      project_list_1.unshift(data)
  }

  const updateList_engage = (data) => { // 在新建项目后，同步更新该界面的数据，将项目插入到其中
      project.unshift(data)
      project_list_0.unshift(data)
  }

  const goBack = () => {
  }
</script>
