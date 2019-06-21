<template>

        <!-- 显示列表 -->
        <div class=" person">
            <h1>欢迎回来:<span> {{ account}} </span></h1>
             
             <h1>您所属的用户组: <span>{{userGroup }}</span>  </h1>
            <div
            style="margin-top:30px"
            >
            <h2>上传头像</h2>
            <el-upload
                    class="upload-demo"
                    style="width:300px;margin-top:20px"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :file-list="fileList2"
                    :http-request="uploadAvatar"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    >
                     <img v-if="imageUrl" :src="imageUrl" class="avatar">
                     <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                     <br>
                     <br>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                      <el-button size="small" type="primary" style="margin-top:20px">点击上传</el-button>
                    </el-upload>
            
          
            </div>
             
        </div>
    
</template>
<script>
import {getUserifon} from '@/api/account'
export default {
    data(){
        return{
           account:'',
           userGroup:'',
           imageUrl:'',
          fileList2: []
        }
    },
    methods:{
        getUser(){
            let username = window.localStorage.getItem("username")
            let params = {
                username
            }
            getUserifon(params)
            .then(res => {
                this.account = res[0].account
                this.userGroup = res[0].usergroup
            })
        },
        handlePreview(){

        },
        handleRemove(){

        },
        uploadAvatar(file){
             let formData = new FormData();

            // 把文件信息添加进如对象
            formData.append('file', file.file)
               this.axios.post('/addAccount/uploadavatar', formData)
                .then(response => {
                    // 获取地址
                    let { avatarUrl } = response.data;
                    // 回填
                    this.imageUrl = 'http://172.16.12.221:5000' + avatarUrl;

                    // 传递给父组件
                    this.$emit('a')
                })
                .catch(err => {
                    console.log(err)
                })
            
        },
        handleAvatarSuccess(res, file){
             this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file){
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }
    },
    created(){
        this.getUser();
    }
}
</script>
<style lang="less">

    .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
</style>


