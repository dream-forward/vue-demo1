<template>
  <div>
    <el-form :inline="true"
             class="demo-form-inline">
      <el-form-item label="姓名：">
        <el-input v-model="formMess.name"
                  placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item label="性别：">
        <el-select v-model="formMess.sex"
                   placeholder="性别">
          <el-option label="男"
                     value="M"></el-option>
          <el-option label="女"
                     value="F"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级：">
        <el-select v-model="formMess.classid"
                   placeholder="班级">
          <el-option v-for="cla in ClassesData"
                     :key="cla.cid"
                     :value="cla.cid"
                     :label="cla.classname"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="getUsers">查询</el-button>
      </el-form-item>
      <el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
    </el-form>

    <el-table :data="tableData"
              style="width: 100%">
              <el-table-column type="index" width="">
			</el-table-column>

      <el-table-column label="姓名"
                       width=""
                       prop="name">

      </el-table-column>
      <el-table-column label="性别"
                       width=""
                       prop="sex"
                       :formatter="formatterSex" sortable>

      </el-table-column>
      <el-table-column label="年龄"
                       width=""
                       prop="age" sortable>

      </el-table-column>
      <el-table-column label="班级"
                       width=""
                       prop="classname">

      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini"
                     @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini"
                     type="danger"
                     @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="5" :total="total" style="float:right;">
			</el-pagination>
		</el-col>


<!--编辑界面-->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" label="M">男</el-radio>
						<el-radio class="radio" label="F">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
                <el-form-item label="班级">
        <el-select v-model="editForm.classid"
                   placeholder="请选择">
          <el-option v-for="cla in ClassesData"
                     :key="cla.cid"
                     :value="cla.cid"
                     :label="cla.classname"></el-option>
        </el-select>
      </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			 <el-button @click.native="dialogFormVisible=false">取消</el-button>
			  <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加啊</el-button>
        <el-button v-else type="primary" @click="updateData">修改啊</el-button>
				<!-- <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button> -->
			</div>
		</el-dialog>

  </div>
  
</template>

<script>
import axios from 'axios'
import {
  editUser,
  addUser
} from "../api/api";
export default {
  data() {
    return {
      tableData: [], //学生数据
      ClassesData: [], //班级数据
      formMess: {
        name: '',
        sex: '',
        classid: '',
      },textMap: {
        update: "Edit",
        create: "Create"
      },
      dialogStatus: "",
       dialogFormVisible: false,
       //编辑界面数据
      editForm: {
        sid: 0,
        name: "",
        sex: "-1",
        age: 0,
        classid: ""
      },
      editFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      addFormVisible: false, //新增界面是否显示
      //addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      total: 0,
      page: 1,
    }
  },
  methods: {
      handleCurrentChange(val) {
          alert(val)
      this.page = val;
      this.getUsers();
    },
    //显示编辑页面
    handleEdit(index, row) {
      console.log(index, row)
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      //this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //编辑
    updateData:function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {})
            .then(() => {//点击修改啊
              //this.editLoading = true;
              //NProgress.start();
              let para = Object.assign({}, this.editForm);
              editUser(para).then(res => {
                //this.editLoading = false;
                //NProgress.done();
                if(res.data == true){
                    this.$message({
                  message: "提交成功",
                  type: "success"
                });
                }
                
                this.$refs["editForm"].resetFields();
                //this.editFormVisible = false;
                 this.dialogFormVisible = false;
                this.getUsers();//修改成功再次调用查询
              }).catch(() => {
          this.$message({
            type: 'info',
            message: '修改失败',
          })
        })
            })
            .catch(e => {//取消了
              // 打印一下错误
              console.log(e);
            });
        }
      });
    },
    //显示新增界面
    handleAdd: function() {
      this.dialogStatus = "create";
      //this.addFormVisible = true;
      this.dialogFormVisible = true;
      this.editForm = {
        sid: 0,
        name: "",
        sex: "-1",
        age: 0,
        classid: ""
			}
    },
    //新增
    createData: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {})
            .then(() => {
              //this.editLoading = true;
              //NProgress.start();
            //   this.editForm.id = (parseInt(Math.random() * 100)).toString() // mock a id
              let para = Object.assign({}, this.editForm);
              addUser(para).then(res => {
                //this.addLoading = false;
                //NProgress.done();
                if(res.data == true){
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                }
                
                this.$refs["editForm"].resetFields();
                this.dialogFormVisible = false;
                //this.addFormVisible = false;
                this.getUsers();//添加成功再次调用查询
              }).catch(() => {
          this.$message({
            type: 'info',
            message: '添加失败',
          })
        })
            })
            .catch(e => {
              // 打印一下错误
              console.log(e);
            });
        }
      });
    },
    //删除方法
    handleDelete(index, row) {
      this.$confirm('删除后本条记录将不再显示', '你确定要删除本条信息么?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          axios({
            method: 'get',
            url: 'http://localhost:8001/student/student/delStuById',
            withCredentials: false, //表示跨域请求时是否需要使用凭证
            params: {
              sid: row.sid,
            },
          }).then((res) => {
            console.log(res)
            if (res.data == true) {
              this.tableData.splice(index, 1)
              this.$message({
                type: 'success',
                message: '删除成功',
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    //格式化性别
    formatterSex(row, column) {
    //   return row.sex == 'F' ? '女' : '男'
      return row.sex == 'M' ? "男" : row.sex == 'F' ? "女" : "未知";
    },
    getUsers() {
      let formData = this.formMess
      //条件查询-查询学生
      axios({
        method: 'get',
        url: 'http://localhost:8001/student/student/queryAll',
        withCredentials: false, //表示跨域请求时是否需要使用凭证
        params: formData,
      }).then((res) => {
          this.total = res.data.data.length;
        //将查询的值重新绑定给数组
        this.tableData = res.data.data
      }).catch(function (error) {
        console.log(error)
      })
    },
  },
  mounted: function () {
    var that = this
    this.getUsers();//获取学生列表
    //查询班级
    axios
      .get('http://localhost:8001/student/student/queryClasses')
      .then(function (response) {
        console.log(response)
        that.ClassesData = response.data.data
      })
      .catch(function (error) {
        console.log(error)
      })
  },
}
</script>