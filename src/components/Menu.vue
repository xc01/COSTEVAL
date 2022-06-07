<template>
  <div class="whole">
    <el-row>
        <el-col :span="3">
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
            <!-- <router-view></router-view> -->
            <welcome v-show="selected_index == 1" :usr="usr"></welcome>
            <search-project v-show="selected_index == 2" :uid="uid" @addProjectSuccess="updateList_create" @deleteProjectSuccess="updateList_delete" @participateNewProject="updateList_engage" />
            <project-list v-show="selected_index == 3" :priority="1" :project="project_list_1" ref="pjL1" />
            <project-list v-show="selected_index == 4" :priority="0" :project="project_list_0" ref="pjL0" />
        </el-col>
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
            exportPath: null, // 导出到的文件夹
            project_list_0: project_list_0,
            project_list_1: project_list_1,
            login: login
        }
    },
    methods: {
        handleLogout: function() { // 登出
            localStorage.clear(); // 清空缓存
            localStorage.setItem("login", "0");
            this.login = false;
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

<style>
body {
    background-color: #fff;
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
.logout {
    position: relative;
    margin-top: 200%;
}
</style>
