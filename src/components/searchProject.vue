<template>
    <div>
        <el-input placeholder="请输入项目名称" v-model="keyword" class="input-with-select" @keyup.enter.native="search">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <el-button @click="addNewProject">新建项目</el-button>
        <ul>
            <li v-for="item in List" :key="item.pid">
                <span>{{ item.name }}</span>
                <el-button @click="addToProject(item)">加入该项目</el-button>
            </li>
        </ul>
    </div>
</template>

<script>
var fakelist = [
    {name: 'pj1', pid: 1},
    {name: 'pj2', pid: 2},
    {name: 'pj3', pid: 3},
    {name: 'pj4', pid: 4},
    {name: 'pj5', pid: 5},
]
export default {
    name: 'searchProject',
    props: ['uid'],
    data () {
        return {
            keyword: "",
            List: [],
            queryParams: {
                uid: this.uid,
                pagenum: 1,
                pagesize: 20
            }
        }
    }, 
    methods: {
        addNewProject: function() { // 添加新项目
            this.$prompt('请输入项目名', '创建新项目',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[\u4e00-\u9fa5a-z0-9]+/gi,
                inputErrorMessage: '输入长度至少为2, 请勿出现特殊字符'
            }).then(({ value }) => { // 验证成功
                var params = {
                    name: value
                }
                // test
                var fakedata = {
                    name: value,
                    pid: 10
                }
                fakelist.push(fakedata)
                var new_project = fakedata
                this.$emit('addProjectSuccess', new_project) // 触发事件 addProjectSuccess, 以便父组件添加到列表
                this.$message.success("新建项目成功！请在\"分析项目\"处查看")
                // this.$axios.get('url', params).then(function(res){
                //     // todo，添加回project list
                //     var new_project = {
                //         name: value,
                //         pid: res.pid
                //     }
                //     this.$emit('addProjectSuccess', new_project) // 触发事件 addProjectSuccess, 以便父组件添加到列表
                //     this.$message.success("新建项目成功！请在\"分析项目\"处查看")
                // }, function(err){
                //     this.$message.error("项目创建失败，请稍后再试")
                // })
            }).catch(() => { // 取消
                this.$message.info("取消添加")
            });
        },

        search: function() { // 搜索
            // test
            var fakeResultList = []
            for (let i = 0; i < fakelist.length; i++) {
                if (fakelist[i].name.search(this.keyword) >= 0) {
                    fakeResultList.push(fakelist[i])
                }
            }
            this.List = fakeResultList;
            var that = this;
            // this.$axios.get('url', queryParams).then(function(res){
            //     that.List = res.data;
            // }, function(err) {
            //     that.$message.error("搜索请求失败, 状态码:" + err.status)
            // });
        },

        addToProject: function(item) {
            // test
            this.$emit('participateNewProject', item); // 触发事件 participateNewProject , 使主页面更新
            this.$message.success("加入成功");
            // var that = this;
            // var params = {
            //     uid: this.uid,
            //     pid: item.pid
            // };
            // this.$axios.get('url', params).then(function(res){
            //     that.$emit('participateNewProject', item); // 触发事件 participateNewProject , 使主页面更新
            //     that.$message.success("加入成功");
            // }, function(res) {
            //     that.$message.error("加入失败，或您已经在这个项目中了");
            // })
        }
    }
}
</script>
