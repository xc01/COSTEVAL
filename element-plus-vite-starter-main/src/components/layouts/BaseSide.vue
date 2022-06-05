<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :router = true
    @open="handleOpen"
    @close="handleClose"
  >
  
    <el-menu-item index="0" route="home">
      <el-icon><Eleme /></el-icon>
      <template #title>欢迎页面</template>
    </el-menu-item>
    <el-menu-item index="1" route="search">
      <el-icon><Search /></el-icon>
      <template #title>搜索项目</template>
    </el-menu-item>
    <!--
    <el-sub-menu index="1">
      <template #title>
        <el-icon><Eleme /></el-icon>
        <span>Navigator One</span>
      </template>
      <el-menu-item-group>
        <template #title><span>Group One</span></template>
        <el-menu-item index="1-1">item one</el-menu-item>
        <el-menu-item index="1-2">item two</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="Group Two">
        <el-menu-item index="1-3">item three</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="1-4">
        <template #title><span>item four</span></template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    -->
    <el-menu-item index="2" route="analyse">
      <el-icon><DataAnalysis /></el-icon>
      <template #title>分析项目</template>
    </el-menu-item>
    <el-menu-item index="3" route="audit">
      <el-icon><UserFilled /></el-icon>
      <template #title>审计项目</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import {
  Search,
  DataAnalysis,
  UserFilled,
  Eleme,
} from '@element-plus/icons-vue'

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>
