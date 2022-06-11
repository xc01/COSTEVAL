<template>
  <div class="whole">
    <el-row :gutter="20">
        <el-col :md="24" :lg="7">
            <el-card class="box-card">
                <div class="user-info">
                    <el-avatar :size="104" :src="src" :fit="scale-down"/>
                    <div class="usernameStyle"> Welcome! </div>
                    <div class="labelStyle"> {{usr}} </div>
                </div>
                <el-divider />
                <div class="userTagStyle">
                    <div class="clearfix">
                        <span>用户标签</span>
                    </div>
                    <div class="userTagDetailStyle">
                        <el-tag :key="tag" v-for="tag in dynamicTags"
                        :disable-transitions="false" @close="handleClose(tag)" closable>
                            {{tag}}
                        </el-tag>
                        <el-input
                        class="input-new-tag" v-if="inputVisible" v-model="inputvalue" ref="saveTagInput" size="small"
                        @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"
                        >
                        </el-input>
                        <el-button v-else
                        class="button-new-tag" size=" small"
                        @click="showInput" icon="el-icon-plus" />
                    </div>
                </div>
                <el-divider />
                <div class="logout">
                    <el-button @click="handleLogout">退出登录</el-button>
                </div>
            </el-card>
        </el-col>
        <el-col :md="24" :lg="17">
            <el-tabs class="tabStyle" value="first">
                <el-tab-pane label="欢迎" index="1" style="width: 100%; padding: 24px ">
                    <welcome :usr="usr"></welcome>
                </el-tab-pane>
                <el-tab-pane label="管理项目" index="2" style="width: 100%; padding: 24px ">
                    <search-project :uid="uid" @addProjectSuccess="updateList_create" @deleteProjectSuccess="updateList_delete" @participateNewProject="updateList_engage" />
                </el-tab-pane>
                <el-tab-pane label="分析项目" index="3" style="width: 100%; padding: 24px ">
                    <project-list :priority="1" :project="project_list_1" ref="pjL1" />
                </el-tab-pane>
                <el-tab-pane label="审计项目" index="4" style="width: 100%; padding: 24px ">
                    <project-list :priority="0" :project="project_list_0" ref="pjL0" />
                </el-tab-pane>
            </el-tabs>
        </el-col>

        <!-- <el-col :span="3">
            <el-menu default-active="1" mode="vertical" @select="HandleSelected">
                <el-menu-item index="1">欢迎</el-menu-item>
                <el-menu-item index="2">管理项目</el-menu-item>
                <el-menu-item index="3">分析项目</el-menu-item>
                <el-menu-item index="4">审计项目</el-menu-item>
            </el-menu>
            <div class="logout">
                <el-button @click="handleLogout">退出登录</el-button>
            </div>
        </el-col>
        <el-col :span="20" :push="1">
            <welcome v-show="selected_index == 1" :usr="usr"></welcome>
            <search-project v-show="selected_index == 2" :uid="uid" @addProjectSuccess="updateList_create" @deleteProjectSuccess="updateList_delete" @participateNewProject="updateList_engage" />
            <project-list v-show="selected_index == 3" :priority="1" :project="project_list_1" ref="pjL1" />
            <project-list v-show="selected_index == 4" :priority="0" :project="project_list_0" ref="pjL0" />
        </el-col> -->
    </el-row>
  </div>
</template>

<script>

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

        var login = localStorage.getItem("login"); // 获取登录状态
        if (login != "1") {
            login = false;
        } else {
            login = true;
        }

        return {
            selected_index: 1,
            usr: localStorage.getItem("username"),
            uid: 0,
            dynamicTags: ["新人审计师"],
            src: "https://api.ixiaowai.cn/gqapi/gqapi.php",
            exportPath: null, // 导出到的文件夹
            project_list_0: project_list_0,
            project_list_1: project_list_1,
            login: login,
            inputVisible: false,
            inputvalue: ""
        }
    },
    methods: {
        handleLogout: function() { // 登出
            this.$axios.get('http://139.196.225.67:8008/logout/').then(function(res){
                localStorage.clear(); // 清空缓存
                localStorage.setItem("login", "0");
                this.login = false;
            }, function(err) {
                that.$message.error("登出请求失败, 状态码:" + err.status)
            });
        },

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
        delete_pid: function(pj, pid) {
            pj.some((item, i) => {
                console.log(item, i)
                if (item.pid == pid) {
                    pj.splice(i, 1)
                    return true;
                }
            })
        },
        updateList_delete: function(pid) { // 在新建项目后，同步更新该界面的数据，将项目插入到其中
            this.delete_pid(project, pid)
            this.delete_pid(this.project_list_1, pid)
            // project.unshift(data)
            // this.project_list_1.unshift(data)
        },

        updateList_engage: function(data) { // 在新建项目后，同步更新该界面的数据，将项目插入到其中
            project.unshift(data)
            this.project_list_0.unshift(data)
        },

        delete_tag: function(tag) {
            this.dynamicTags.some((item, i) => {
                if (item == tag) {
                    this.dynamicTags.splice(i, 1)
                    return true;
                }
            })
        },
        handleClose: function(tag) {
            this.delete_tag(tag)
        },

        showInput: function() {
            this.inputVisible = true
        },

        handleInputConfirm: function() {
            this.dynamicTags.push(this.inputvalue)
            this.inputVisible = false
        }
    },

    mounted () {
        document.getElementsByTagName("body")[0].style.backgroundColor = "#fff";
        
        if (!this.login) {
            this.$router.replace('/login');  // 如果没有登录，则到登录页面
        }

        document.addEventListener('logout', () => { // 监听登录超时事件
            this.handleLogout();
        })
    },

    watch: {
        'login'(nv, ov) { // 如果登录过时，则返回登录界面
            if (nv == "0" || nv == false) {
                this.$message.info("已退出登录");
                this.$router.replace('/login');
            }
        }
    }
}
</script>

<style scoped>
body {
    background: rgb(198, 213, 241);
}
.whole {
    height: 80%;
}
.el-row {
  height: 80%;
}
.el-col {
  height: 80%;
}
</style>
