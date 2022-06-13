<template>
  <div class="hello">
    <div v-if="!entered">
      <p>您可以{{ priority==1 ? "分析": "审计" }}的项目有：</p>
      <el-row class="row-con">
        <el-col :span="7" v-for="(pj, index) in getList(searchedProjectList, tablePage.pageNum, tablePage.pageSize)"
        :key="index" style="margin-bottom:25px;'" :offset="index == 0 ? 0 : 1">
          <el-card class="box-card" shadow="hover" body-style="height:'0px'">
            <div slot="header" class="clearfix">
              <el-col :md="24" :lg="15" :offset="0"><span>{{ pj.name }}</span> </el-col>
              <el-col :md="24" :lg="8" :offset="1">
              <div v-if="priority">
              <el-popconfirm
                confirm-button-text='查看任务详情'
                cancel-button-text='查看相关人员'
                icon="el-icon-info"
                icon-color="green"
                title="请选择需要查看的对象" 
                @confirm="get_code(pj.pid)"
                @cancel="check_persons(pj.pid, pj.authrity)"
              >
              <el-button slot='reference' style="float: right; padding: 3px 0" type="text">查看详情</el-button>
              </el-popconfirm>
              </div>
              <div v-else>
              <el-button slot='reference' style="float: right; padding: 3px 0" type="text" @click="get_code(pj.pid)">查看任务详情</el-button>
              </div>
              </el-col>
            </div>
            <el-upload
              class="unknow"
              action="#"
              :on-success="uploadSuccess"
              :on-error="uploadProcess"
              :on-progress="uploadFail"
              multiple>
              <el-button size="big" type="primary" class="loadbutton">上传项目</el-button>
              <div slot="tip" class="el-upload__tip">请上传项目压缩包为文件</div>
            </el-upload>
            <!-- <el-button size="small" type="primary" @click="begin_export(pj.pid)">导出项目</el-button> -->
            <div class="row-foot" v-if="priority">
              <el-link href="#" download="" style="margin-right: 5px">导出</el-link>
              <el-button @click="estimate(pj.pid)">分析</el-button>
            </div>
            <div class="row-foot-2" v-else>
              <el-link href="#" download="">导出</el-link>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-pagination
        :current-page="tablePage.pageNum"
        :page-size="tablePage.pageSize"
        :total="tablePage.total"
        :hide-on-single-page=false
        layout="total, prev, pager, next"
        @current-change="handlePageChange">
      </el-pagination>
    </div>
    <!-- 路径的视图 -->
    <router-view v-if="entered" @back="reset"></router-view>
  </div>
</template>

<script>
import qs from 'Qs'
export default { // projectList 组件
  name: 'projectList',
  props: {  // 接受来自父元素的数据
    priority: {  // 优先级
        type: Number,   // 限制类型是数字
        default: 0,     // 默认值是 0
        required: true  // 必填
    },
    project: {  // 权限
        type: Array,
        default: function() { return null },
        required: true
    }
  },

  data () {
    return {
      tablePage: {
        pageNum: 1, // 第几页
        pageSize: 3, // 每页多少条
        total: this.project.length // 总记录数
      },
      keyword: "", // 搜索关键词
      searchedProjectList: this.project, // 搜索到的结果
      entered: false
    }
  },

  methods: {

    import_pj: function() { // 新建项目，导入
      // ...
    },

    get_code: function(pid) { // 查看项目
      var that = this;
      this.$axios.post('/api/read_project_data/', qs.stringify({ //todo
          uid: localStorage.getItem("uid"),
          pid: pid,
          estimate: true
      })).then(function(res){
          console.log(res.data)
          that.entered = true;
          that.$router.push({'name': 'codeView', params: {pid: pid}}) // 加载页面
      }, function(res) {
          that.$message.error("加入失败，或您已经在这个项目中了");
      })
    },

    export_pj: function() {
      var that = this
      // axios.get("url?pid=" + this.pid).then( // get 请求获取数据
      //   function(response) {
      //     // ...
      //   },
      //   function(err) {
      //     console.log(err);
      //   }
      // )
      // ... 保存到本地
    },

    check_persons: function(pid, auth) { // 查看人员
      // ...
      console.log(auth)
      this.entered = true;
      this.$router.push({'name': 'personView', params: {pid: pid, auth: auth}})
    },

    estimate: function(pid) { // 评估项目
      // ...
      this.entered = true;
      this.$router.push({'name': 'estimate', params: {pid: pid}})
    },

    search: function() { // 搜索
      if (this.keyword == '') {
            this.searchedProjectList = this.project;
            this.tablePage.total = this.project.length;
            return;
        }
        var result = [];
        for (let i = 0; i < this.project.length; i++) {
            if (this.project[i].name.search(this.keyword) >= 0) {
                result.push(this.project[i]);
            }
        }
        this.searchedProjectList = result;
    },

    uploadSuccess: function() {
      this.$message.success("上传成功");
    },
    uploadProcess: function() {
      this.$message.info("上传中。。。");
    },
    uploadFail: function() {
      this.$message.error("上传失败");
    },
    reset: function() {
      this.entered = false;
      this.$router.push('/');
    },
    
    handlePageChange(currentPage) {
      this.tablePage.pageNum = currentPage
      // 在此刷新数据
    },
    getList(data, num, size) {
      let list, total, start, end, isFirst, isLast
      total = data.length
      isFirst = total < size
      isLast = Math.ceil(total / size) === num
      start = (num - 1) * size
      end = isFirst || isLast ? start + (total % size) : start + size
      list = data.slice(start, end)
      list.forEach((item, index) => {
        item.seq = index + start
      })
      return list
    }
  },

  watch: { // 监听
    keyword: function() {
      this.search();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  li {
    list-style:none;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .el-row {
    margin-bottom: 20px;
  }

  .el-col {
    border-radius: 4px;
  }

  .row-con {
    display: flex;
    flex-flow: row wrap;
  }
  .row-con .box-card {
    height: 110%;
  }

  .clearfix span {
    margin-left: -80%;
    font: 18px bold;
  }
  .hello p {
    font: 20px bold;
  }
  .row-foot {
    position: absolute;
    margin-top: 2%;
    margin-left: 12%;
  }
  .row-foot-2 {
    position: absolute;
    margin-top: 3%;
    margin-left: 20%;
  }
  .loadbutton {
    margin-top: 8px;
  }

  .el-pagination {
    margin-top: 8%;
  }
</style>