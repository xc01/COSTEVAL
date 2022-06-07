<template>
    <div>
        <el-page-header @back="$emit('back')" content="查看项目详情"> </el-page-header>
        <h1>代码</h1>
    </div>
</template>

<script>
export default {
    name: "codeView"
}
</script>
