<template>
  <div class="hello">
    <div v-if="!entered">
      <el-input
        placeholder="请输入项目名称"
        v-model:value="keyword"
        class="input-with-select"
        @keyup.enter="search"
      >
        <template v-slot:append>
          <el-button icon="el-icon-search" @click="search"></el-button>
        </template>
      </el-input>

      <p>您可以{{ priority == 1 ? '分析' : '审计' }}的项目有：</p>
      <ul>
        <li v-show="project.length">
          <span>项目名称</span>
          <span>管理</span>
        </li>
        <li v-for="(pj, index) in searchedProjectList" :key="(pj, index)">
          <span>{{ pj.name }}</span>
          <el-button @click="get_code(pj.pid)">查看详情</el-button>
          <el-button v-if="priority" @click="check_persons(pj.pid)"
            >查看相关人员</el-button
          >
          <el-upload
            class="unknow"
            action="#"
            :on-success="uploadSuccess"
            :on-error="uploadProcess"
            :on-progress="uploadFail"
            multiple
          >
            <el-button size="small" type="primary">上传项目</el-button>
            <template v-slot:tip>
              <div class="el-upload__tip">请上传项目压缩包为文件</div>
            </template>
          </el-upload>
          <!-- <el-button size="small" type="primary" @click="begin_export(pj.pid)">导出项目</el-button> -->
          <el-link href="#" download="">导出</el-link>
          <el-button v-if="priority" @click="estimate(pj.pid)">分析</el-button>
        </li>
      </ul>
    </div>
    <!-- 路径的视图 -->
    <router-view v-if="entered" @back="reset"></router-view>
  </div>
</template>

<script>
import * as Vue from 'vue'
export default {
  // projectList 组件
  name: 'projectList',
  props: {
    // 接受来自父元素的数据
    priority: {
      // 优先级
      type: Number, // 限制类型是数字
      default: 0, // 默认值是 0
      required: true, // 必填
    },
    project: {
      // 权限
      type: Array,
      default: function () {
        return null
      },
      required: true,
    },
  },

  data() {
    return {
      keyword: '', // 搜索关键词
      searchedProjectList: this.project, // 搜索到的结果
      entered: false,
    }
  },

  methods: {
    import_pj: function () {
      // 新建项目，导入
      // ...
    },

    get_code: function (pid) {
      // 查看项目
      // ...
      this.entered = true
      this.$router.push({ name: 'codeView', params: { pid: pid } }) // 加载页面
    },

    export_pj: function () {
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

    check_persons: function (pid) {
      // 查看人员
      // ...
      this.entered = true
      this.$router.push({ name: 'personView', params: { pid: pid } })
    },

    estimate: function (pid) {
      // 评估项目
      // ...
      this.entered = true
      this.$router.push({ name: 'estimate', params: { pid: pid } })
    },

    search: function () {
      // 搜索
      if (this.keyword == '') {
        this.searchedProjectList = this.project
        return
      }
      var result = []
      for (let i = 0; i < this.project.length; i++) {
        if (this.project[i].name.search(this.keyword) >= 0) {
          result.push(this.project[i])
        }
      }
      this.searchedProjectList = result
    },

    uploadSuccess: function () {
      this.$message.success('上传成功')
    },
    uploadProcess: function () {
      this.$message.info('上传中。。。')
    },
    uploadFail: function () {
      this.$message.error('上传失败')
    },
    reset: function () {
      this.entered = false
      this.$router.push('/')
    },
  },

  watch: {
    // 监听
    keyword: function () {
      this.search()
    },
  },
}
</script>

<style scoped></style>
