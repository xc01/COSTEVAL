<template>
    <div>
        <el-page-header @back="$emit('back')" content="查看项目相关人员"> </el-page-header>
        <el-input placeholder="请输入用户名称" v-model="keyword" class="input-with-select" @keyup.enter.native="search">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <ul>
            <li v-for="person in personList" :key="person.uid">
                <span>{{ person.username }}</span>
                <el-button @click="BeginEdit(person.name, person.uid, person.priority)">修改权限</el-button>
            </li>
        </ul>
        <el-drawer
        :title="'请设置用户 ' + selectedUsr + ' 的权限'"
        :before-close="handleClose"
        :visible.sync="drawer"
        ref="drawer"
        >
            <el-form ref="form" label-width="60px">
                <el-form-item label="选择权限">
                    <el-radio-group v-model="selectedPriority">
                        <el-col :span="6">
                            <el-radio label="1">分析师</el-radio>
                            <el-radio label="0">审计师</el-radio>
                            <el-radio label="-1">从项目中删除该成员</el-radio>
                        </el-col>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <el-button @click="cancelForm">取 消</el-button>
            <el-button type="primary" @click="submit" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </el-drawer>
    </div>
</template>

<script>
//test
var personList = [
    {username: "aaa", uid: 22, priority: 0},
    {username: "bbb", uid: 33, priority: 1},
    {username: "ccc", uid: 44, priority: 1},
    {username: "ddd", uid: 55, priority: 0}
];

export default {
    name: "personView",
    // props: ['pid'],
    data () {
        var params = {
            pid: this.$route.params.pid
        };

        // personList = this.loadData(params);
        // if (personList == null) {
        //     this.$message.error("加载人员列表出错");
        // }

        return {
            pid: this.$route.params.pid,
            keyword: '', // 搜索关键词
            personList: personList,
            drawer: false,  // 抽屉是否打开
            loading: false, 
            selectedPriority: 0, // 需要新设置的权限
            selectedUsr: "",
            selectedUid: 0
        }
    },

    methods: {
        loadData: function(params) {
            var data = null;
            this.$axios.get('url', params).then(function(res){
                data = res.data
            })
            return data;
        },

        BeginEdit: function(name, uid, prio) { // 开始修改
            this.selectedUsr = name
            this.selectedUid = uid
            this.selectedPriority = prio
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
            
            this.loading = true;
            var that = this;
            var params = {
                pid: this.pid,
                uid: this.selectedUid,
                prio: this.selectedPriority
            }
            console.log(params);
            // test
            if (this.selectedPriority < 0) { // 删除人员
                for (let i = 0; i < this.personList.length; i++) {
                    if (this.personList[i].uid == this.selectedUid) { // 找到了需要移除的人员
                        this.personList.splice(i, 1); // 删除
                    }
                }
            }
            that.$message.success("修改成功！");
            this.cancelForm(); // 关闭抽屉
            // this.$axios.post('url', params, {timeout: 5000}).then(function(res) {
            //     if (this.selectedPriority < 0) { // 删除人员
            //         for (let i = 0; i < this.personList.length; i++) {
            //             if (this.personList[i].uid == that.selectedUid) { // 找到了需要移除的人员
            //                 this.personList.splice(i, 1); // 删除
            //             }
            //         }
            //     }
            //     that.$message.success("修改成功！");
            //     this.cancelForm(); // 关闭抽屉
            // }, function(err){
            //     that.$message.error("修改失败");
            //     that.loading = false;
            // })
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
        }
    },

    watch: {
        keyword: function() {  // 监听 keyword 变量，当有变化就调用函数
            this.search();
        }
    }
    
}
</script>