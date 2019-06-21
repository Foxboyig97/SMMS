<template>
  <div class="system-info">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商店信息:</span>
        <h3>查看详细的商店信息</h3>
        <el-row >
          <el-col :span="24" >
            <div class="grid-content bg-purple-dark">
                <span>商品总数：</span><span>{{ total}}</span> &emsp;
                <span>已销售总金额：</span><span>{{ total*200}}</span> &emsp;
                <span>库存商品总价：</span><span>{{ total*200*12}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple-dark">
                <span>导入数据</span>
            </div>
          </el-col>
        </el-row>
        
        <!-- 左右表格 -->
          <el-row :gutter="40">
                        <el-col :span="12">
                            <!--左侧-->
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span>销售排行</span>
                                </div>
                                <el-table
                                        :data="saleData"
                                        style="width: 100%"
                                        
                                >
                                    <!--商品名称-->
                                    <el-table-column
                                            prop="name"
                                            label="商品名称"
                                    >
                                    </el-table-column>
                                    <!--销量-->
                                    <el-table-column
                                            prop="address"
                                            label="生产地址"
                                    >
                                    </el-table-column>
                                </el-table>
                            </el-card>
                        </el-col>

                        <el-col :span="12">
                            <!--右侧-->
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span>缺货商品</span>
                                </div>
                                <el-table
                                        :data="saleData"
                                        style="width: 100%"
                                        
                                        >
                                    <!--商品名称-->
                                    <el-table-column
                                            prop="name"
                                            label="商品名称"
                                    >
                                    </el-table-column>
                                    <el-table-column label="最近购买日期"      
                                    >
                                     <template slot-scope="scope">{{ scope.row.ctm | filterCtime }}</template>
                                    </el-table-column>
                                </el-table>
                            </el-card>
                        </el-col>
            </el-row>
      </div>
      
    </el-card>
  </div>
</template>

<script>
import{goddsList}from'@/api/goods'
import moment from 'moment'
 export default {

        data() {
            return {
                saleData: [{
                    name:'',
                    address:'',
                    ctm:''
                }],
                total:''
            }
        },
        methods:{
            getGoods(){
                goddsList()
                .then(res =>{
                   let { total,data} = res;
                    this.total =total;
                    this.data = data
                    this.saleData = data

                })
                .catch(err =>{
                    console.log(err);
                    
                })
            }
        },
        created(){
            this.getGoods()
        },
        filters: {
    filterCtime(ctm) {
      return moment(ctm).format("YYYY-MM-DD hh:mm:ss");
    }
  }
    }
</script>

<style lang="less">
    .system-info{
       & h3 {

            margin-top: 10px;
        }
        .grid-content{
            background: #dbe3ff;
            border-radius: 5px;
            text-indent: 1em;
            margin-top: 20px;
            height: 40px;
            line-height: 40px;
        }
        
    }

</style>
    