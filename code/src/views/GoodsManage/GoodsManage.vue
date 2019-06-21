<template>
  <div class="account-manage">
    <el-form :model="searchForm" label-width="80px">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-form-item label="选择分类:">
              <el-select v-model="searchForm.categories" placeholder="---选择分类---">
                 <el-option label='全部' value="全部">全部</el-option>
                <el-option label="货币" value="货币">货币</el-option>
                <el-option label="氪金商品" value="氪金商品">氪金商品</el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">
            <el-form-item label="关键字：">
              <el-input v-model="searchForm.keyword"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple-light">
            <el-button
              type="success"
              size="medium"
              @click="getgoods()"
              style="margin-left:10px;margin-top:2px;"
            >查询</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <!-- 显示列表 -->
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>

      <el-table-column prop="name" label="商品" width="120"></el-table-column>

      <el-table-column prop="categories" label="商品种类" width="120"></el-table-column>

      <el-table-column prop="address" label="地址" width="180"></el-table-column>

      <el-table-column label="条形码" width="180">
        <template slot-scope="scope">{{ scope.row.code }}</template>
      </el-table-column>

      <el-table-column label="上架时间" width="180">
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
        :page-sizes="[1, 3, 5, 10, 20, 50]"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import{goddsList,search,goddsbyid,goodsdelete}from'@/api/goods'
export default {
  data() {
    return {
      tableData: [
        {
           name:'',
           categories:'',
           address:'',

        }
       

      ],
      multipleSelection: [],
      total: 0,
      pageSize: 3,
      currentPage: 1,
      editid:'',
      searchForm: {
        categories:'',
        keyword: ""
      }
    };
  },
  created() {
    this.getgoods();
  },
  filters: {
    filterCtime(ctm) {
      return moment(ctm).format("YYYY-MM-DD hh:mm:ss");
    }
  },
  methods: {
    //显示商品
    getgoods() {
      let params ={
        pageSize :this.pageSize,
        currentPage :this.currentPage,
        categories :this.searchForm.categories,
        keyword :this.searchForm.keyword,
      }
     
    
        goddsList(params)
        .then(res => {
          let { total, data } = res;
          this.total = total;
          this.tableData = data;
          if (!data.length && this.currentPage !== 1) {
            this.currentPage -= 1;
            this.getgoods();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //查询
    // search() {
    //   let params = {
    //      categories : this.searchForm.categories,
    //     keyword : this.searchForm.keyword,
        
    //   }
      
     
    //     search(params)
    //     .then(res => {
    //       this.tableData = res;
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    // 编辑
    handleEdit(id) {
      goddsbyid({id})
        .then(res => {
          this.goodsForm = res;
          this.editid = id;

          
          this.$router.push({ name: "GOODSADD", params: { id } });
        })
        .catch(err => {
          console.log(err);
        });
     
      
    },
    // 删除
    handleDelete(id) {
      this.$confirm("你确定要删除吗？", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
         goodsdelete({id})
            .then(res => {
              let { code, msg } = res;
              // 根据后端响应的数据判断
              if (code === 0) {
                this.getgoods();
                // 弹出成功的提示
                this.$message({
                  type: "success",
                  message: msg
                });
              } else {
                this.$message.error(msg);
              }
            });
        })
        .catch(err => {
          // 弹出成功的提示
          this.$message({
            type: "info",
            message: "删除取消"
          });
        });
    },
    // pageSize（每页条数）改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.getgoods();
    },
    // currentPage（当前页）改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getgoods();
    }
  },
  
};
</script>

<style lang="less">
</style>