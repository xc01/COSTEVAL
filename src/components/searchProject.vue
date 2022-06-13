<template>
    <div class="whole">
        <div class="unsearched" v-show="!searched">
            <img alt="Vue logo" class="element-plus-logo" width="50%" src="../assets/logo.gif" />
            <el-row>
                <el-col :span="12" :offset="4">
                    <el-input @select="handleSelect"
                        placeholder="请输入项目名称" v-model="keyword" class="input-with-select" @keyup.enter.native="search" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="search" />
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-button @click="addNewProject">新建项目</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table class="searched" v-show="searched"
            :data="searchList"
            style="width: 100%">
            <el-table-column label="项目名称" prop="name" />
            <el-table-column label="id" prop="id" />
            <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                    <el-autocomplete :fetch-suggestions="querySearch" @select="handleSelect" size="mini"
                        placeholder="请输入项目名称" v-model="keyword" class="input-with-select" @keyup.enter.native="search" clearable>
                        <el-button slot="append" size="mini" @click="addNewProject">新建项目</el-button>
                    </el-autocomplete>
                </template>
                <template slot-scope="scope">
                    <el-button size="mini" @click="addToProject(scope.row)">添加成员</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- <div class="searched" v-show="searched">
            <el-autocomplete :fetch-suggestions="querySearch" @select="handleSelect"
                placeholder="请输入项目名称" v-model="keyword" class="input-with-select" @keyup.enter.native="search" clearable>
                <el-button slot="append" icon="el-icon-search" @click="search" />
            </el-autocomplete>
            <el-button @click="addNewProject">新建项目</el-button>
        </div> -->
        <!-- <el-table :data="List" :key="item.id">
            <span>{{ item.name }}</span>
            <el-button @click="addToProject(item)">加入该项目</el-button>
        </li> -->
        <!-- <el-table :data="List" height="250" border style="width: 100%" v-show="searched">
            <el-table-column prop="name" label="name"  width="180" />
            <el-button @click="addToProject(item)">加入该项目</el-button>
        </el-table> -->
    </div>
</template>

<script>
import qs from 'Qs'

var fakelist = [
    {"name": "pj1", "id": 1},
    {"name": "pj2", "id": 2},
    {"name": "pj3", "id": 3},
    {"name": "pj4", "id": 4},
    {"name": "pj5", "id": 5}
]
export default {
    name: 'searchProject',
    props: ['uid'],
    data () {
        return {
            searched: false,
            keyword: "",
            List: [],
            queryParams: {
                uid: this.uid,
                pagenum: 1,
                pagesize: 20
            },
            searchList: []
        }
    }, 
    methods: {
        querySearch(queryString, cb) {
            var list = this.List;
            var results = queryString ? list.filter(this.createFilter(queryString)) : list;
            console.log(list.filter(this.createFilter(queryString)));
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (list) => {
                return (list.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        addNewProject: function() { // 添加新项目
            this.$prompt('请输入项目名', '创建新项目',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[\u4e00-\u9fa5a-z0-9]+.{2,30}/,
                inputErrorMessage: '输入长度至少为2, 请勿出现特殊字符'
            }).then(({ value }) => { // 验证成功
                // test
                // var fakedata = {
                //     name: name,
                //     id: 10
                // }
                // fakelist.push(fakedata)
                // var new_project = fakedata
                // this.$emit('addProjectSuccess', new_project) // 触发事件 addProjectSuccess, 以便父组件添加到列表
                // this.$message.success("新建项目成功！请在\"分析项目\"处查看")
                // this.List = this.getfakelist();
                var that=this;
                this.$axios.post('/api/insert_project_data/', qs.stringify({
                    "project_name": value
                })).then(function(res){
                        if (res.data.substring(0, 6) != "Sucess") {
                            that.$message.error("请输入项目名称")
                            return 1
                        }
                    // todo，添加回project list
                        var new_project = {
                            name: value,
                            id: res.id
                        }
                        that.$emit('addProjectSuccess', new_project) // 触发事件 addProjectSuccess, 以便父组件添加到列表
                        that.$message.success("新建项目成功！请在\"分析项目\"处查看")
                        that.search()
                    }, function(err){
                        that.$message.error("项目创建失败，请稍后再试")
                    })
                }).catch((err) => { // 取消
                    this.$message.info("取消添加")
                });
        },

        search: function() { // 搜索
            this.searched = true;
            var that = this;
            var list = [];
            // this.$axios.get('/api/get_all_projects/').then(function(res){
            this.$axios.get('/api/get_all_projects/').then(function(res){

                var strlist = res.data.split("}");
                console.log(strlist)
                for (var str of strlist) {
                    if (str != "") {
                        str = str.replace(/ name/, "name")
                        if (that.keyword == "" || str.split(": ")[2].search(that.keyword) >= 0) {
                            list.push(eval("("+str+"})"))
                        }
                    }
                }
            }, function(err) {
                that.$message.error("搜索请求失败, 状态码:" + err.status)
            });
            this.searchList = list;
        },

        addToProject: function(item) {
            this.$prompt('请输入用户uid', '添加成员',{
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => { // 验证成功
                // test
                // var fakedata = {
                //     name: name,
                //     id: 10
                // }
                // fakelist.push(fakedata)
                // var new_project = fakedata
                // this.$emit('addProjectSuccess', new_project) // 触发事件 addProjectSuccess, 以便父组件添加到列表
                // this.$message.success("新建项目成功！请在\"分析项目\"处查看")
                // this.List = this.getfakelist();
                var that = this;
                this.$axios.post('/api/modify_authority/', qs.stringify({
                    uid: value,
                    pid: item.id,
                    authority: "read"
                })).then(function(res){
                    if (res.data.substring(0, 6) == "Modifi") {
                        that.$message.error("已经在这个项目中了")
                        return 1;
                    } else if (res.data.substring(0, 5) == "Added") {
                        that.$message.success("加入成功");
                        return 1;
                    } else {
                        that.$message.error("加入失败")
                    }
                }).catch((err) => { // 取消
                    this.$message.info("取消添加")
                });
            });
        },
        handleSelect(item) {
            console.log(item);
        },
        
        getfakelist() {
            return fakelist;
        },
        delete_id: function(id) {
            this.List.some((item, i) => {
                console.log(item, i)
                if (item.id == id) {
                    this.List.splice(i, 1)
                    return true;
                }
            })
        },
        deleteProject: function(id) { // 添加新项目
            this.$confirm('此操作将永久删除该项目, 是否继续?', '提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => { // 验证成功
                this.delete_id(id);
                this.$emit('deleteProjectSuccess', id) // 触发事件 addProjectSuccess, 以便父组件添加到列表
                this.$message.success("删除项目成功！")
                // this.$axios.get('url', params).then(function(res){
                //     // todo，添加回project list
                //     var new_project = {
                //         name: name,
                //         id: res.id
                //     }
                //     this.$emit('addProjectSuccess', new_project) // 触发事件 addProjectSuccess, 以便父组件添加到列表
                //     this.$message.success("新建项目成功！请在\"分析项目\"处查看")
                // }, function(err){
                //     this.$message.error("项目创建失败，请稍后再试")
                // })
            }).catch((err) => { // 取消
                console.log(err);
                this.$message.info("取消删除")
            });
        }
    }
}
</script>
<style scoped>
    img {
        margin-left: -10%;
    }
    .unsearched {
        margin-top: 8%;
    }
    .whole {
        width: 95%;
    }
</style>
