<template>
  <div class="whole">
    <el-row>
        <el-col :md="24" :lg="5" :offset="1">
            <el-card class="box-card">
                <div class="user-info">
                    <el-avatar :size="104" :src="src" fit="scale-down"/>
                    <div class="usernameStyle"> 用户ID </div>
                    <div class="labelStyle"> {{usr}} </div>
                </div>
                <el-divider />
                <div class="clearfix">
                    <div class="usernameStyle">
                        <span>用户标签</span>
                    </div>
                    <div class="userTagDetailStyle">
                        <el-tag :key="index" v-for="(tag, index) in dynamicTags"
                        :disable-transitions="false" @close="handleClose(tag)" closable>
                            {{tag}}
                        </el-tag>
                        <el-input
                        class="input-new-tag" v-if="inputVisible" v-model="inputvalue" ref="saveTagInput" size="small" resize="vertical"
                        @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"
                        >
                        </el-input>
                        <el-button v-else
                        class="button-new-tag" size="mini"
                        @click="showInput" icon="el-icon-plus" />
                    </div>
                </div>
                <el-divider />
                <div class="logout">
                    <el-button @click="handleLogout">退出登录</el-button>
                </div>
            </el-card>
        </el-col>
        <el-col :md="24" :lg="16" :offset="1">
        <el-card class="tabStyle">
            <el-tabs>
                <el-tab-pane label="欢迎" index="1" style="width: 100%; padding: 24px ">
                    <welcome :usr="usr"></welcome>
                </el-tab-pane>
                <el-tab-pane label="搜索项目" index="2" style="width: 100%; padding: 24px ">
                    <search-project :uid="uid" @addProjectSuccess="updateList_create" @deleteProjectSuccess="updateList_delete" @participateNewProject="updateList_engage" />
                </el-tab-pane>
                <el-tab-pane label="分析项目" index="3" style="width: 100%; padding: 24px ">
                    <project-list :priority="1" :project="project_list_1" ref="pjL1" />
                </el-tab-pane>
                <el-tab-pane label="审计项目" index="4" style="width: 100%; padding: 24px ">
                    <project-list :priority="0" :project="project_list_0" ref="pjL0" />
                </el-tab-pane>
            </el-tabs>
            </el-card>
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
import qs from 'Qs'
var project= []
// {name: 'pj1', pid: 1, authrity: 1}

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
            project_list_0: [],
            project_list_1: [],
            login: login,
            inputVisible: false,
            inputvalue: ""
        }
    },
    methods: {
        setdata: function() {
            var temppj = []
            var that = this;
            this.$axios.post('/api/get_auth/', qs.stringify({
                uid: localStorage.getItem("uid")
            })).then(function(res){
                var strlist = res.data.split("}");
                for (var str of strlist) {
                    if (str.length > 1) {
                        var pjData = eval("("+str+"})")
                        var auth = 0;
                        switch(pjData.auth) {
                            case "creator":
                                auth = 2;
                                break;
                            case "auth":
                                auth = 2;
                                break;
                            case "user+":
                                auth = 1;
                                break;
                            default:
                                auth = 0;
                                break;
                        }
                        temppj.push(JSON.parse(JSON.stringify({name: pjData.name, pid: pjData.pid, authrity: auth})))
                    }
                }
            }, function(err) {
                that.$message.error("搜索请求失败, 状态码:" + err.status)
            });
            console.log(temppj)
        },
        handleLogout: function() { // 登出
            this.$axios.get('/api/logout/').then(function(res){
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
            this.inputvalue = ''
        }
    },
    mounted () {
        document.getElementsByTagName("body")[0].style.backgroundColor = "rgb(198, 213, 241)";
        
        if (!this.login) {
            this.$router.replace('/login');  // 如果没有登录，则到登录页面
        }

        document.addEventListener('logout', () => { // 监听登录超时事件
            this.handleLogout();
        })
        
        this.setdata()
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
.whole { 
    height: 100%; 
}
.whole .el-row { 
    height: 100%; 
    display: flex; 
    flex-wrap: wrap; 
}
.whole .el-row.el-col { 
    height: 100%; 
} 

.box-card {
    margin-top: 10%;
}

.box-card .user-info .el-avatar {
    margin: 15px;
}

.box-card {
    margin-top: 10%;
}

.usernameStyle {
    margin: 10px;
    font-size: 18px;
}

.tabStyle {
    height: 580px;
}

.input-new-tag {
    width: 70px;
}
</style>
