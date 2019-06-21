<template>
  <div class="account-manage">
     <!-- 批量删除 -->
    <div class="bottomButtom">
      <el-button @click="Delete()">批量删除</el-button>
      <el-button @click="Select()">取消选择</el-button>
    </div>
    <!-- 显示列表 -->
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"  @selection-change="handleSelectionChange">
      
      <el-table-column type="selection" width="55"></el-table-column>

      <el-table-column prop="account" label="姓名" width="120"></el-table-column>

       <el-table-column
        prop="usergroup"
        label="用户组"
        >
      </el-table-column>


      <el-table-column prop="ctm" label="创建时间" width="200">
        <template slot-scope="scope">{{ scope.row.ctm | filterCtime }}</template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 编辑按钮 -->
          <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">
            <i class="el-icon-edit"></i>
            编辑
          </el-button>
          <!-- 删除按钮 -->
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">
            <i class="el-icon-delete"></i>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block" style="margin-top:30px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes='[1,3,5,10]'
        :page-size="pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
   
    <!--修改的弹出框-->
    <el-dialog title="用户名修改" width="400px" :visible.sync="flag">
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
        <el-form-item label="用户名" prop="account">
          <el-input v-model="editForm.account"></el-input>
        </el-form-item>
      <el-form-item label="用户组" prop="usergroup">
        <el-select v-model="editForm.usergroup" placeholder="用户组">
            <el-option label="超级管理员" value="超级管理员"></el-option>
            <el-option label="普通管理员" value="普通管理员"></el-option>
        </el-select>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveNewmsg('editForm')">确 定</el-button>
        <el-button @click="flag=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import{batchDelete,AccountChange,AccountSave,AccountDel,AccountList } from'@/api/account'
export default {
  data() {
    var checkName = (rule, value, callback) => {
        let regExp =/^[a-zA-Z][a-zA-Z0-9_]{4,18}/;
        if (!regExp.test(value)){
          callback(new Error('大小写字母6-18位'));
        } else{
          callback();
        }
      };
    return {
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      flag:false,
      editForm:{
        account:'',
        usergroup:''
      },
      editFormRules:{
        account:[
         { validator: checkName, trigger: 'blur' },
        ],
        usergroup:[
        {required: true, message:"请选择用户组", trigger: 'change' }
        ]
      },
      editId:'',
      total:0,
      pageSize:3,
      selectedAccount:[],
    };
  },
  created() {
    this.getAccount();
  },
  filters: {
    filterCtime(ctm) {
      return moment(ctm).format("YYYY-MM-DD hh:mm:ss");
    }
  },
  methods: {
    getAccount() {
      let params = {
        pageSize:this.pageSize,
        currentPage : this.currentPage
      }
      this.axios
        AccountList(params)
        .then(res => {
          let {total,data} = res;
         
          this.total = total;
         
          this.tableData = data;
          
          
          if(!data.length && this.currentPage !==1){
            this.currentPage -= 1;
            this.getAccount();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 编辑
    handleEdit(id) {
        this.editId =id;
        AccountChange({ id })
            .then(res=>{
                let result =res[0];
                //回填表单
                this.editForm.account = result.account;
                this.editForm.usergroup = result.usergroup;
                this.flag = true;
        })
            .catch(err =>{
                console.log(err)
            })    
    },
    // 删除
    handleDelete(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            AccountDel({ id })
            .then(res => {
              let { code, msg } = res;
              if (code === 0) {
                this.$message({
                  type: "success",
                  message: "删除数据成功"
                });
                this.getAccount();
              } else {
                this.$message.error("删除数据失败");
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "已取消删除"
          });
        });
    },
    //删除后保存
    saveNewmsg(formName){
      this.$refs[formName].validate((valid)=>{
        if(valid){
          let params ={
            account:this.editForm.account,
            editId:this.editId,
            usergroup:this.editForm.usergroup
          };

         AccountSave( params )
          .then(res =>{
            let{code,msg} = res;
            if(code === 0){
              this.$message({
                type:"success",
                message:"修改用户名成功"
              });
              this.getAccount();
            }else{
              this.$message.err('修改用户名失败')
            }
            this.flag = false;
          })
          .catch(err=>{
            this.$message({
              type: 'warning',
              message: '修改用户名失败'
            })
          })
        }
      })
    },
    // pageSize（每页条数）改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAccount();
    },
    // currentPage（当前页）改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAccount();
    },
    handleSelectionChange(val){
      this.selectedAccount = val;
    },
    //批量删除
    Delete(){
      
      let selectedId = this.selectedAccount.map(v =>v.id );
                if(!selectedId.length){
                    this.$message.error("请选择要删除数据，再操作");
                    return;
                }this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                  
                    batchDelete({selectedId})
                        .then(res =>{
                            let {code,msg} = res;
                            if(code ===0){
                                this.$message({
                                    type:"success",
                                    message:msg
                                });
                                this.getAccount();
                            }else{
                                this.$message.error(msg)
                            }
                        })
                        

                }).catch(() => {
                    this.$message({
                        type: 'warning',
                        message: '已取消删除'
                    });
                });

    },
    //取消选择
    Select(){
      this.$refs.multipleTable.clearSelection();
    }
  }
};
</script>

<style lang="less">
</style>