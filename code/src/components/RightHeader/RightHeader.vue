<template>
    <div class="right-header">
        <el-row>
            <!-- 左 -->
            <el-col :span="12">
                <h3><i class="el-icon-menu"></i>采购中心管理系统</h3>
            </el-col>
            <!-- 右 -->
            <el-col :span="12">
                <el-row>
                    <el-col :span="18">
                        <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                            {{ account}}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="person">个人中心</el-dropdown-item>
                                <el-dropdown-item command="logout">退出系统</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>

                    </el-col>
                    <el-col :span="6">
                        <div class="avatar">
                            <img :src="avatarUrl" alt="">
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {getUserifon} from '@/api/account'
    export default {
        data () {
        return {
            account: "",
            avatarUrl:''
        }
    },
    methods:{
        handleCommand(command) {
            //如果点退出
            if(command ==="logout"){
                window.localStorage.removeItem("token");
                this.$message({
                    type:"success",
                    message:"退出成功"
                });
                setTimeout(()=>{
                    this.$router.push("/login")
                },1000)

            }
            else if(command ==="person"){
                 setTimeout(()=>{
                    this.$router.push("/home/person")
                },500)

            }
        },
        getUser(){
            let username = window.localStorage.getItem('username')
            let params = {
                username
            }
           getUserifon(params) 
           .then(res =>{
              let avatarUrl =res[0].avatarUrl
              this.avatarUrl = 'http://172.16.12.221:5000' + avatarUrl;
           })
           .catch(err=>{
               console.log(err);
               
           })
        }
    },
    created(){
        this.account = window.localStorage.getItem("username")
        this.getUser()
    }
    }
</script>

<style lang="less">
    .right-header {
        color:#2d3a4b;
        font-size: 16px;
        border-bottom: 1px solid #ccc;
        & > .el-row {
            & > .el-col {
                .el-row {
                    .el-col:first-child {
                        text-align: right;
                    }
                    .el-col:last-child {
                        text-align: center;
                        .avatar {
                            width: 50px;
                            height: 50px;
                            background: green;
                            margin-left: 20px;
                            margin-top: 5px;
                            border-radius: 50%;
                            img {
                                width: 100%;
                                height: 100%;
                                border-radius: 50%;
                            }
                        }
                    }
                }
            }
        }
    }
</style>