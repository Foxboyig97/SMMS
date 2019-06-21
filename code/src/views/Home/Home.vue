<template>
    <div class="home">
        <!-- 布局容器 -->
        <el-container>
            <!-- 左侧栏 -->
            <el-aside width="200px">
                <!-- 左侧组件 -->
                <LeftNav />
            </el-aside>
            <!-- 右侧 -->
            <el-container>
                <!-- 上 -->
                <el-header>
                   <Rightheader ref="b"></Rightheader>
                </el-header>
                <!-- 中 -->
                <el-main>
                    <!-- 路由出口 -->
                    <router-view @a='fn'>

                    </router-view>
                </el-main>
                <!-- 下 -->
                <el-footer>
                <Rightfooter/>
                </el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    // 引入组件
    import LeftNav from '@/components/LeftNav/LeftNav.vue'
    import Rightheader from '@/components/RightHeader/RightHeader.vue'
    import Rightfooter from '@/components/RightFooter/RightFooter.vue'
    export default {
        components: {
            LeftNav,
            Rightheader,
            Rightfooter
        },
        methods:{
            fn(){
                this.$refs.b.getUser()
            }
        }
    }
</script>

<style lang="less">

    .home {
        height: 100%;
        // 大容器
        .el-container {
            height: 100%;
            // 左侧
            .el-aside {
                background-color: rgb(48, 65, 86);
            }
            // 右侧
            .el-container {
                // 上
                .el-header {
                    background-color: #B3C0D1;
                    color: green;
                    line-height: 60px;
                } 
                // 中
                .el-main {
                        background-color: #E9EEF3;
                }
                // 下
                .el-footer {
                    background-color: #B3C0D1;
                    color: red;
                    line-height: 60px;
                } 
            }

        }
    }

 
  
  
  
 
  

</style>