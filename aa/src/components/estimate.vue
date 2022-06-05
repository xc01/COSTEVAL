<template>
  <div>
    <el-page-header @back="$emit('back')" content="评估"> </el-page-header>
    <h2>请选择评估模型</h2>
    <el-row>
      <el-col>
        <el-button @click="chooseMode('cocomo81')">COCOMO81 模型</el-button>
        <i>这是 cocomo81 模型</i>
        <el-drawer
          title="请输入 COCOMO81 模型的评估参数"
          :before-close="HandleClose"
          :visible.sync="cocomo81"
          ref="cocomo81"
        >
          <el-form>
            <el-form-item label="KDSI" :label-width="formLabelWidth">
              <el-input
                type="number"
                step="0.01"
                v-model="cocomo81_form.kdsi"
                placeholder="请输入软件代码量估计"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="a" :label-width="formLabelWidth">
              <el-input
                type="number"
                step="0.01"
                v-model="cocomo81_form.a"
                placeholder="请输入系数因子 a"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="b" :label-width="formLabelWidth">
              <el-input
                type="number"
                step="0.01"
                v-model="cocomo81_form.b"
                placeholder="请输入系数因子 b"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="7"> 成本驱动因子评级 </el-col>
              <el-col :span="16">
                <cost-driver-assess
                  name="RELY"
                  v-model="cocomo81_form.costDriver.rely"
                  :wid="formLabelWidth"
                  :disableList="[5]"
                >
                </cost-driver-assess>
                <cost-driver-assess
                  name="DATA"
                  v-model="cocomo81_form.costDriver.data"
                  :wid="formLabelWidth"
                  :disableList="[0, 5]"
                >
                </cost-driver-assess>
                <cost-driver-assess
                  name="CPLX"
                  v-model="cocomo81_form.costDriver.cplx"
                  :wid="formLabelWidth"
                  :disableList="[]"
                >
                </cost-driver-assess>
                <cost-driver-assess
                  name="TIME"
                  v-model="cocomo81_form.costDriver.time"
                  :wid="formLabelWidth"
                  :disableList="[0, 1]"
                >
                </cost-driver-assess>
                <cost-driver-assess
                  name="STOR"
                  v-model="cocomo81_form.costDriver.virt"
                  :wid="formLabelWidth"
                  :disableList="[0, 1]"
                >
                </cost-driver-assess>
                <cost-driver-assess
                  name="VIRT"
                  v-model="cocomo81_form.costDriver.virt"
                  :wid="formLabelWidth"
                  :disableList="[0, 5]"
                >
                </cost-driver-assess>
                <cost-driver-assess
                  name="TURN"
                  v-model="cocomo81_form.costDriver.turn"
                  :wid="formLabelWidth"
                  :disableList="[0, 5]"
                >
                </cost-driver-assess>
                <cost-driver-assess
                  name="ACAP"
                  v-model="cocomo81_form.costDriver.acap"
                  :wid="formLabelWidth"
                  :disableList="[5]"
                >
                </cost-driver-assess>
                <cost-driver-assess
                  name="AEXP"
                  v-model="cocomo81_form.costDriver.aexp"
                  :wid="formLabelWidth"
                  :disableList="[5]"
                >
                </cost-driver-assess>
                <cost-driver-assess
                  name="PCAP"
                  v-model="cocomo81_form.costDriver.pcap"
                  :wid="formLabelWidth"
                  :disableList="[5]"
                >
                </cost-driver-assess>
                <cost-driver-assess
                  name="VEXP"
                  v-model="cocomo81_form.costDriver.vexp"
                  :wid="formLabelWidth"
                  :disableList="[4, 5]"
                >
                </cost-driver-assess>
                <cost-driver-assess
                  name="LEXP"
                  v-model="cocomo81_form.costDriver.lexp"
                  :wid="formLabelWidth"
                  :disableList="[4, 5]"
                >
                </cost-driver-assess>
                <cost-driver-assess
                  name="MODP"
                  v-model="cocomo81_form.costDriver.modp"
                  :wid="formLabelWidth"
                  :disableList="[5]"
                >
                </cost-driver-assess>
                <cost-driver-assess
                  name="TOOL"
                  v-model="cocomo81_form.costDriver.tool"
                  :wid="formLabelWidth"
                  :disableList="[5]"
                >
                </cost-driver-assess>
                <cost-driver-assess
                  name="SCED"
                  v-model="cocomo81_form.costDriver.sced"
                  :wid="formLabelWidth"
                  :disableList="[5]"
                >
                </cost-driver-assess>
              </el-col>
            </el-row>
          </el-form>
          <el-button @click="cancelForm()">取 消</el-button>
          <el-button type="primary" @click="submit" :loading="loading">{{
            loading ? '提交中 ...' : '确 定'
          }}</el-button>
        </el-drawer>
      </el-col>
      <el-col>
        <el-button @click="chooseMode('cocomoii')">COCOMO II 模型</el-button>
        <i>这是 cocomo II 模型</i>
        <el-drawer
          title="请输入 COCOMOII 模型的评估参数"
          :before-close="HandleClose"
          :visible.sync="cocomoii"
          ref="cocomoii"
        >
          <el-form>
            <el-form-item label="EI" :label-width="formLabelWidth">
              <el-input
                type="number"
                v-model="cocomoii_form.ei"
                placeholder="外部输入功能点数"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="EO" :label-width="formLabelWidth">
              <el-input
                type="number"
                v-model="cocomoii_form.eo"
                placeholder="外部输出功能点数"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="ILF" :label-width="formLabelWidth">
              <el-input
                type="number"
                v-model="cocomoii_form.ilf"
                placeholder="内部逻辑文件功能点数"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="EIF" :label-width="formLabelWidth">
              <el-input
                type="number"
                v-model="cocomoii_form.eif"
                placeholder="外部接口文件功能点数"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="EQ" :label-width="formLabelWidth">
              <el-input
                type="number"
                v-model="cocomoii_form.eq"
                placeholder="外部查询功能点数"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-button @click="cancelForm()">取 消</el-button>
          <el-button type="primary" @click="submit" :loading="loading">{{
            loading ? '提交中 ...' : '确 定'
          }}</el-button>
        </el-drawer>
      </el-col>
      <el-col>
        <el-button @click="chooseMode('regression')">回归模型</el-button>
        <i>这是回归模型</i>
        <el-drawer
          title="请输入 Regression 模型的评估参数"
          :before-close="HandleClose"
          :visible.sync="regression"
          ref="regression"
        >
          <el-form>
            <el-form-item label="KDSI" :label-width="formLabelWidth">
              <el-input
                type="number"
                step="0.01"
                v-model="regression_form.kdsi"
                placeholder="请输入软件代码量估计"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-button @click="cancelForm()">取 消</el-button>
          <el-button type="primary" @click="submit" :loading="loading">{{
            loading ? '提交中 ...' : '确 定'
          }}</el-button>
        </el-drawer>
      </el-col>
      <el-col>
        <el-button @click="chooseMode('analogy')">类比分析</el-button>
        <i>这是类比分析模型</i>
        <el-drawer
          title="请输入 Analogy 模型的评估参数"
          :before-close="HandleClose"
          :visible.sync="analogy"
          ref="analogy"
        >
          <el-form>
            <el-form-item label="KDSI" :label-width="formLabelWidth">
              <el-input
                type="number"
                step="0.01"
                v-model="analogy_form.kdsi"
                placeholder="请输入软件代码量估计"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-button @click="cancelForm()">取 消</el-button>
          <el-button type="primary" @click="submit" :loading="loading">{{
            loading ? '提交中 ...' : '确 定'
          }}</el-button>
        </el-drawer>
      </el-col>
    </el-row>
  </div>
</template>

<script>
var cocomo81_form = {
  kdsi: 0, // 软件代码量估计值
  a: 2.4,
  b: 1.05,
  costDriver: {
    // 成本驱动因子：评级：1->very low  2->low  3->nominal  4->high  5->very high  6->extra high
    rely: 3, // 需求软件的依赖程度
    data: 3, // 数据库大小
    cplx: 3, // 产品复杂度
    time: 3, // 执行时间限制
    stor: 3, // 主存限制
    virt: 3, //
    turn: 3, // 电脑周转时间
    acap: 3, // 分析师能力
    aexp: 3, // 应用经验
    pcap: 3, // 编程能力
    vexp: 3, // 虚拟机经验
    lexp: 3, // （编程）语言经验
    modp: 3, // 使用现代化编程实践程度
    tool: 3, // 软件工具使用熟练度
    sced: 3, // 所需的开发日程
  },
}
var cocomoii_form = {
  ei: 0, // 外部输入功能点
  eo: 0, // 外部输出功能点
  ilf: 0, // 内部逻辑文件功能点
  eif: 0, // 外部接口文件功能点
  eq: 0, // 外部查询功能点
}
var regression_form = {
  kdsi: 0, // 软件代码量估计值
}
var analogy_form = {
  kdsi: 0, // 软件代码量估计值
}

// var empty_cocomo81_form = cocomo81_form
// var empty_cocomoii_form = cocomoii_form
// var empty_regression_form = regression_form
// var empty_analogy_form = analogy_form

export default {
  name: 'estimate',
  // props: ['pid'],
  data() {
    return {
      pid: this.$route.params.pid, // 读取参数
      cocomo81: false,
      cocomoii: false,
      regression: false,
      analogy: false,
      loading: false,
      cocomo81_form: cocomo81_form,
      cocomoii_form: cocomoii_form,
      regression_form: regression_form,
      analogy_form: analogy_form,
      formLabelWidth: '100px',
      selectedMode: '',
      form: null,
      url: '',
    }
  },
  methods: {
    chooseMode: function (mode) {
      switch (
        mode // 根据模型选择不同的 url 和表单内容
      ) {
        case 'cocomo81':
          this.url = 'xxx'
          this.form = this.cocomo81_form
          this.cocomo81 = true
          break
        case 'cocomoii':
          this.url = 'xxx'
          this.form = this.cocomoii_form
          this.cocomoii = true
          break
        case 'regression':
          this.url = 'xxx'
          this.form = this.regression_form
          this.regression = true
          break
        case 'analogy':
          this.url = 'xxx'
          this.form = this.analogy_form
          this.analogy = true
          break
        default:
          this.cancelForm()
          this.$message.error('打开表单出错！请稍后再试')
          return
      }
      this.selectedMode = mode
    },

    cancelForm: function () {
      // 取消表单
      this.cocomo81 = false
      this.cocomoii = false
      this.regression = false
      this.analogy = false
      this.loading = false
    },

    HandleClose: function (done) {
      if (this.loading) {
        // 加载完成前不能退出
        return
      }
      var that = this // 保存 this，因为在 axios 中不一样了
      this.$confirm('确定要离开吗？')
        .then((_) => {
          this.cancelForm()
        })
        .catch((_) => {
          return
        })
    },

    submit: function () {
      if (this.loading) {
        // 加载完成前不能退出
        return
      }
      var that = this // 保存 this，因为在 axios 中不一样了
      this.loading = true // 加载样式
      console.log(this.form)
      this.$axios.post(this.url, this.form, { timeout: 5000 }).then(
        function (res) {
          // 提交表单
          that.$message.success('提交成功！')
          that.loading = false
        },
        function (err) {
          that.$message.error('提交失败！')
          that.loading = false
        }
      )
    },
  },
}
</script>
