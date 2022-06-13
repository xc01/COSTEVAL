<template>
    <div v-if="auth == 2">
        <el-page-header @back="$emit('back')" content="查看项目相关人员"> </el-page-header>
        <el-table class="searched"
            :data="personList"
            style="width: 95%">
            <el-table-column label="成员名称" prop="username" />
            <el-table-column label="uid" prop="uid" />
            <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                    <el-input size="mini"
                        placeholder="请输入成员名称" v-model="keyword" class="input-with-select" @keyup.enter.native="search" clearable>
                        <el-button slot="append" size="mini" @click="addUser">添加成员</el-button>
                    </el-input>
                </template>
                <template slot-scope="scope">
                    <el-button size="mini" @click="BeginEdit(scope.row)">修改权限</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-drawer
        :title="'请设置用户 ' + selectedUsr + ' 的权限'"
        :before-close="handleClose"
        :visible.sync="drawer"
        ref="drawer"
        >
            <el-form ref="form" label-width="60px">
                <el-form-item label="">
                    <el-radio-group v-model="selectedauth">
                        <el-col :span="6">
                            <el-radio label="2">管理员</el-radio>
                            <el-radio label="1">分析师</el-radio>
                            <el-radio label="0">审计师</el-radio>
                        </el-col>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <el-button @click="cancelForm">取 消</el-button>
            <el-button type="primary" @click="submit" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </el-drawer>
    </div>
    <div v-else>
        <el-page-header @back="$emit('back')" content="查看项目相关人员"> </el-page-header>
        <h2>您没有权限查看该页面</h2>
    </div>
</template>

<script>
import qs from 'Qs'
//test
// {username: "ddd", uid: 55, auth: 0}

export default {
    name: "personView",
    // props: ['pid'],
    data () {

        // if (personList == null) {
        //     this.$message.error("加载人员列表出错");
        // }
        return {
            pid: this.$route.params.pid,
            auth: this.$route.params.auth,
            keyword: '', // 搜索关键词
            personList: [],
            drawer: false,  // 抽屉是否打开
            loading: false, 
            selectedauth: 0, // 需要新设置的权限
            selectedUsr: "",
            selectedUid: 0
        }
    },

    methods: {
        async loadData(params) {
            this.personList = await this.getdata(params);
        },
        async getdata(params) {
            var data = [];
            var that=this;
            await this.$axios.post('/api/get_all_users/', qs.stringify(params)).then(function(res){
                var strlist = res.data.split("}")
                for (var str of strlist) {
                    if (str != "") {
                        str = str.replace(/name/, "name")
                        console.log(str)
                        if (that.keyword == "" || str.split(": ")[2].search(that.keyword) >= 0) {
                            data.push(eval("("+str+"})"))
                        }
                    }
                }
            }, function(err){
                that.$message.error("成员加载失败")
            })
            return data;
        },
        BeginEdit: function(row) { // 开始修改
            this.selectedUsr = row.username
            this.selectedUid = row.uid
            this.selectedauth = row.auth
            this.drawer = true // 打开抽屉进行修改
        },

        cancelForm: function() { // 取消表单
            this.loading = false
            this.drawer = false
        },

        handleClose: function(done) {
            if (this.loading) {
                return;
            }
            this.$confirm('确认要离开吗？').then(_ => {
                this.cancelForm();
            }).catch(_ => {
                return;
            });
        },

        submit: function() { // 关闭确认
            if (this.loading) {
                return;
            }
            var au = ""
            console.log(this.selectedauth)
            switch(this.selectedauth) {
                case "2":
                    au = "auth";
                    break;
                case "1":
                    au = "read+";
                    break;
                default:
                    au = "read";
                    break;
            }            
            this.loading = true;
            var that = this;
            // // test
            // if (this.selectedauth < 0) { // 删除人员
            //     for (let i = 0; i < this.personList.length; i++) {
            //         if (this.personList[i].uid == this.selectedUid) { // 找到了需要移除的人员
            //             this.personList.splice(i, 1); // 删除
            //         }
            //     }
            // }
            // that.$message.success("修改成功！");
            // this.cancelForm(); // 关闭抽屉
            
            var that=this;
            this.$axios.post('/api/modify_authority/', qs.stringify({
                pid: this.pid,
                uid: this.selectedUid,
                authority: au
            })).then(function(res){
                if (res.data.substring(0, 6) != "Modifi") {
                    that.$message.error("修改失败")
                    return 1
                }
                that.$message.success("修改成功！");
                that.cancelForm(); // 关闭抽屉
            }).catch((err) => { // 取消
                this.$message.info("取消添加")
            });
        },
         
        search: function() {
            if (this.keyword == '') {
                this.personList = personList;
                return;
            }
            var searchedPersonList = [];
            for (let i = 0; i < personList.length; i++) {
                if (personList[i].username.search(this.keyword) >= 0) {
                    searchedPersonList.push(personList[i]);
                }
            }
            this.personList = searchedPersonList;
        },
        addUser: function() {
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
                var that=this;
                this.$axios.post('/api/modify_authority/', qs.stringify({
                    uid: value,
                    pid: this.pid,
                    authority: "read"
                })).then(function(res){
                    if (res.data.substring(0, 6) != "Sucess") {
                        that.$message.error("加入失败，或已经在这个项目中了")
                        return 1
                    }
                    that.$message.success("加入成功");
                }).catch((err) => { // 取消
                    this.$message.info("取消添加")
                });
            });
        }
    },
    mounted() {
        var params = {
            pid: this.$route.params.pid
        };
        this.loadData(params);
        console.log(this.personList)
    },

    watch: {
        keyword: function() {  // 监听 keyword 变量，当有变化就调用函数
            this.search();
        }
    }
    
}
</script>