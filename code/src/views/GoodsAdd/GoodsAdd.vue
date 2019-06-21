<template>
  <div class="goodsadd">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title">添加商品</span>
      </div>
      <div class="text item">
        <el-form ref="goodsForm" :model="goodsForm" label-width="80px" :rules="rules">
          <el-form-item label="所属分类：" prop="categories">
            <el-select v-model="goodsForm.categories" placeholder="---选择分类---">
              <el-option label="货币" value="货币"></el-option>
              <el-option label="氪金商品" value="氪金商品"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品条形码：" prop="code">
            <el-input v-model="goodsForm.code"></el-input>
            <el-button type="success" @click="createCode()">生成条形码</el-button>
          </el-form-item>
          <el-form-item label="商品名称：" prop="name">
            <el-input v-model="goodsForm.name"></el-input>
          </el-form-item>
          <el-form-item label="商品种类" prop="categories">
            <el-input v-model="goodsForm.categories"></el-input>
          </el-form-item>
          <el-form-item label="产出地址" prop="address">
            <el-input v-model="goodsForm.address"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addGoods('goodsForm')">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import moment from "moment";
import {addgoods,goddsbyid} from'@/api/goods'
export default {
  data() {
    const checkNum = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else {
        let patrn = /^\d+(\.\d+)?$/;
        if (!patrn.test(value)) {
          callback(new Error("格式必须为数字"));
        }
        callback();
      }
    };
    const checkLen = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else if (value.length > 200) {
        callback(new Error("不超过200汉字"));
      }
      callback();
    };
    return {
      goodsForm: {
        categories: "",
        code: "",
        name: "",
        address: "",
      },
      rules: {
        categories: [
          { required: true, message: "请选择商品种类", trigger: "change" }
        ],
        code: [
          { required: true, message: "请输入商品条形码", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入产出地址", trigger: "blur" },
        ],
      }
    };
  },
  methods: {
    addGoods(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            categories: this.goodsForm.categories,
            code: this.goodsForm.code,
            name: this.goodsForm.name,
            address: this.goodsForm.address,
            id: this.$route.params.id
          };
          
            addgoods(params)
            .then(res => {
              let { code, msg } = res;
                
                
              // 根据后端响应的数据判断
              if (code === 0) {
                // 弹出成功的提示
                this.$message({
                  type: "success",
                  message: msg
                });

                // 跳转到管理列表
                this.$router.push("/home/goodsmanage");
              } else {
                // 弹出失败的提示
                this.$message.error(msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    createCode() {
      var Num = "";
      for (var i = 0; i < 7; i++) {
        Num += Math.floor(Math.random() * 10);
      }
      this.goodsForm.code = Num;
    },
    getGoodsList(id) {
        goddsbyid({id})
        .then(res => {
          this.goodsForm = res[0];

        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    let id = this.$route.params.id;
    
    if (id) {
      this.getGoodsList(id);
    }
  }
};
</script>
<style lang=less>
.goodsadd {
  .el-card {
    background: rgba(235, 235, 235, 0.29);
    .el-card__header {
      text-align: left;
      font-size: 20px;
      line-height: 40px;
      color: #fff;
    }
    .el-card__body {
      .el-form {
        .el-form-item {
          .el-form-item__content {
            .el-button--success {
              background-color: rgb(255, 136, 0);
              border: rgb(255, 136, 0);
            }
            .el-input {
              width: 280px;
              margin-right: 10px;
            }
            .notify {
              font-size: 12px;
              color: rgba(11, 133, 96, 0.86);
            }
            .el-button--primary {
              background-color: rgba(11, 133, 96, 0.86);
              border: rgba(11, 133, 96, 0.86);
            }
          }
          .el-form-item__label {
            width: 120px !important;
          }
        }
      }
    }
  }
}
</style>
