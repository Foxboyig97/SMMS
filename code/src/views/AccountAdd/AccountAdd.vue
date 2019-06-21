<template>
    <div class="account-add">
        <el-card class="box-card">
            <h2>账户添加</h2>
        <!-- 表单 -->
        <div class="formtable" style="margin-top:30px;">
        <el-form
            :model="adduserForm"
            status-icon
            :rules="rules2"
            ref="adduserForm"
            label-width="100px"
            class="demo-ruleForm"
        >
      <el-form-item label="姓名" prop="name" >
          <el-input v-model.number="adduserForm.name" ></el-input>
          
        </el-form-item>

        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="adduserForm.pass" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="adduserForm.checkPass" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="选择用户组" prop="usergroup">
            <el-select v-model="adduserForm.usergroup" placeholder="请选择用户组">
              <el-option label="超级管理员" value="超级管理员"></el-option>
              <el-option label="普通管理员" value="普通管理员"></el-option>
            </el-select>
          </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('adduserForm')">添加</el-button>
          <el-button @click="resetForm('adduserForm')">重置</el-button>
        </el-form-item>
      </el-form>
        </div>
        
        </el-card>
    </div>
</template>

<script>
import{ accountAdd } from '@/api/account'
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
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.adduserForm.checkPass !== '') {
            this.$refs.adduserForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.adduserForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        adduserForm: {
          pass: '',
          checkPass: '',
          name: '',
          usergroup:''
        },
        rules2: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          name: [
          
            { validator: checkName, trigger: 'blur' },
            
          ],
          usergroup:[
             { required: true, message:"请选择用户组", trigger: 'change' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // alert('添加成功');
            let params ={
              username:this.adduserForm.name,
              password:this.adduserForm.pass,
              usergroup:this.adduserForm.usergroup
            }
           
            
            accountAdd(params)
            .then(res =>{
               
                let{ code,msg} = res;
                if(res.code === 0){
                   this.$message(
                        {
                          type: "success",
                          message: msg
                                    });
                //占位
                this.$router.push("/home/accountmanage")
                }else{
                  this.$message.error(msg)
                }
            })
          } else {
                alert("请填写完整资料")
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}
</script>

<style lang="less">
    .account-add{
        margin: auto;
        width: 900px;
    .formtable{
        margin: auto;
        width: 500px;
    }
    }
    
</style>