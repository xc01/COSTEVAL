<template>
    <project-list :priority="0" :project="project_list_1" ref="pjL1"></project-list>
</template>
<script lang="ts">
var pj1 = {name: 'pj1', pid: 1, authrity: 0}
var pj2 = {name: 'pj2', pid: 2, authrity: 1}
var pj3 = {name: 'pj3', pid: 3, authrity: 1}
var pj4 = {name: 'pj4', pid: 4, authrity: 0}
var project = [pj1, pj2, pj3, pj4]

export default {
    name: "Menu",
    data () {
        // axios.get('url?...').then( // 获取该用户参与的所有列表
        //   function(response) {
        //     project = response
        //   },
        //   function(err) {
        //     console.log(err)
        //   }
        // )

        var project_list_0 = [], project_list_1 = []
        for (let i = 0; i < project.length; i++) { // 将数组分为两类，一类是审计权限，一类是分析权限
            if (project[i].authrity == 0)
                project_list_0.push(project[i])
            else
                project_list_1.push(project[i])
        }

        return {
            selected_index: 1,
            usr: 'lalala',
            uid: 0,
            exportPath: null, // 导出到的文件夹
            project_list_0: project_list_0,
            project_list_1: project_list_1
        }
    },
    methods: {
        HandleSelected: function(id) {
            // this.$router.push({name: path, params: {id: 1}})
            this.selected_index = parseInt(id)
            if (this.selected_index == 3) {
                this.$refs.pjL1.reset(); // 重置 entered
            }
            else if (this.selected_index == 4) {
                this.$refs.pjL0.reset();
            }
            else if (this.$route.fullPath != '/') {
                this.$router.push('/');
            }
        },

        updateList_create: function(data) { // 在新建项目后，同步更新该界面的数据，将项目插入到其中
            project.unshift(data)
            this.project_list_1.unshift(data)
        },

        updateList_engage: function(data) { // 在新建项目后，同步更新该界面的数据，将项目插入到其中
            project.unshift(data)
            this.project_list_0.unshift(data)
        },

        goBack: function() {

        }
    }
}
</script>
