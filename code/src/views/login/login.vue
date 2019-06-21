<template>
  <div class="login">
    <div class="login-warp">
      <h2 class="el-icon-goods">罗德岛采购中心管理系统</h2>
      <el-form
        :model="ruleForm2"
        status-icon
        :rules="rules2"
        ref="ruleForm2"
        label-width="100px"
        class="demo-ruleForm"
      >
      <el-form-item label="姓名" prop="username">
          <el-input v-model.number="ruleForm2.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm2')">登录</el-button>
          <el-button @click="resetForm('ruleForm2')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import{ checkLogin} from '@/api/login'
export default {
  
   data() {
      var checkName = (rule, value, callback) => {
        let regExp =/^[a-z][a-zA-Z0-9_]{4,18}/;
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
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm2: {
          pass: '',
          checkPass: '',
          username: ''
        },
        rules2: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          username: [
          
            { validator: checkName, trigger: 'blur' },
            
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
             let params = {
                 username: this.ruleForm2.username,
                 password: this.ruleForm2.pass
            }
            // alert('验证通过');
           checkLogin(params)
          .then(res => {
              let { code, msg,token,username,usergroup} = res;
              console.log(res);
              
                  if (code === 0) {
                     window.localStorage.setItem("token",token);
                     window.localStorage.setItem("username",username);
                     window.localStorage.setItem('usergroup',usergroup)
                      this.$router.push("/home");
                      this.$message(
                        {
                          type: "success",
                          message: msg
                                    });
                              } else {
                              this.$message.error(msg);
                                }
                        })
            .catch(err => {
                                console.log(err);
                            });
          } else {
            console.log('sorry,验证不通过');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
};
</script>
<style lang="less">
@import url("./login.less");
</style>



