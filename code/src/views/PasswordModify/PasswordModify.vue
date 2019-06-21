<template>
    <div class="password-modify">
        <el-card class="box-card">
            <h2>密码修改</h2>
            <div class="passchange" style="margin-top:30px">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

                <el-form-item label="原密码" prop="oldpass">
                    <el-input type="password" v-model="ruleForm.oldpass" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="新密码" prop="newpass">
                    <el-input type="password" v-model="ruleForm.newpass" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
import{checkpwd} from'@/api/pwd'
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
          let name = window.localStorage.getItem('username');
          let oldpass = value;
          let params = {
            oldpass,
            name
          }
          checkpwd(params)
          .then(res =>{
            let{code,msg } =res
            if(code ===0){
                callback();
          }else{
                callback(new Error(msg));
          }
          })
          .catch(err =>{
            console.log(err);
            
          }
          )
          
          
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value == this.ruleForm.oldpass) {
          callback(new Error('新密码和原密码不能一致'));
        } else {
          callback();
        }
      };
      var validatePass3 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.newpass) {
          callback(new Error('两次密码不一致'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          name:"",
          oldpass: '',
          newpass:'',
          checkPass: ''
        },
        rules: {
          newpass:[
            { validator: validatePass2, trigger: 'blur' }
          ],
          oldpass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass3, trigger: 'blur' }
          ],
           name: [
            { validator: checkName, trigger: 'blur' },
            
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
        let newpass =this.ruleForm.newpass
        let checkPass = this.ruleForm.checkPass
          if(newpass === checkPass){
            let params = {
            name:window.localStorage.getItem('username'),
            oldpass:this.ruleForm.oldpass,
            newpass:this.ruleForm.newpass}
          
          this.axios.post('http://172.16.12.221:5000/addAccount/saveNewpwd',
          this.qs.stringify(params))
          .then(response =>{
            let{code,msg} = response.data
            if(code === 0 ){
              this.$message({
                 type:'success',
                 message:msg
              });
              window.localStorage.removeItem('token');
              this.$router.push('/login');
            }else{
              callback(new Error(msg));
            }
          })
          .catch(err =>{
            console.log(err);  
          })
          }
          if(newpass !== checkPass){
              this.$message({
                type:"waring",
                message:'请重新修改密码'
              })
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style lang="less">
    .password-modify {
        width: 900px;
        margin: auto;
    .passchange {
        height: 300px;
        width: 500px;
        margin: auto;
        }
    }
    
</style>