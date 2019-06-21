<template>
    <div class="left-nav">
        <!-- 标题 -->
        <h3 class="title">
            <i class="el-icon-menu"></i>
            采购中心管理系统
        </h3>
        <el-menu
            :default-active="$route.path"
            unique-opened
            active-text-color="rgb(64, 158, 255)"
            background-color="rgb(48, 65, 86)"
            router
            >
             <el-submenu :index="(i+1) + ''" v-for="(nav, i) in leftNav" :key="i">
                <template slot="title">
                    <i :class="nav.iconCls"></i>
                    <span>{{ nav.navTitle }}</span>
                </template>

                <el-menu-item 
                    v-for="(subNav, i) in nav.children"
                    :key="i"
                    :index="subNav.path"
                    >
                    {{ subNav.navSubTitle }}
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                leftNav: []
            }
        },
         methods:{
             getNav(){
                 let role = window.localStorage.getItem('usergroup')
                 console.log(role);
                 if(role ==='超级管理员'){
                     this.leftNav = [
                          {
                            iconCls: 'el-icon-s-tools',
                            navTitle: '系统信息',
                            children: [
                                { path: '/home/systeminfo', 'navSubTitle': '系统信息' }
                            ]
                        },
                        // 导航2
                        {
                            iconCls: 'el-icon-s-order',
                            navTitle: '账号管理',
                            children: [
                                { path: '/home/accountmanage', 'navSubTitle': '账号管理' },
                                { path: '/home/accountadd', 'navSubTitle': '账号添加' },
                                { path: '/home/passwordmodify', 'navSubTitle': '密码修改' },
                            ]
                        },
                        // 导航3
                        {
                            iconCls: 'el-icon-s-goods',
                            navTitle: '商品管理',
                            children: [
                                { path: '/home/goodsmanage', 'navSubTitle': '商品管理' },
                                { path: '/home/goodsadd', 'navSubTitle': '商品添加' }
                            ] 
                        },
                        // 导航4
                        {
                            iconCls: 'el-icon-tickets',
                            navTitle: '统计管理',
                            children: [
                                { path: '/home/selltotal', 'navSubTitle': '销售统计' },
                            ]   
                        }
                     ]
                 }
                 
                 if (role ==='普通管理员'){
                     this.leftNav =[
                          {
                            iconCls: 'el-icon-s-tools',
                            navTitle: '系统信息',
                            children: [
                                { path: '/home/systeminfo', 'navSubTitle': '系统信息' }
                            ]
                        },
                        // 导航3
                        {
                            iconCls: 'el-icon-s-goods',
                            navTitle: '商品管理',
                            children: [
                                { path: '/home/goodsmanage', 'navSubTitle': '商品管理' },
                                { path: '/home/goodsadd', 'navSubTitle': '商品添加' }
                            ] 
                        },
                        // 导航4
                        {
                            iconCls: 'el-icon-tickets',
                            navTitle: '统计管理',
                            children: [
                                { path: '/home/selltotal', 'navSubTitle': '销售统计' },
                            ]   
                        }
                     ]
                 }
                                  
             }
         },
        created(){
            this.getNav()
           
            
        }
    }
</script>

<style lang="less">
    .left-nav {
        .title {
            color: #fff;
            margin: 10px auto;
            text-align: center;
            font-size: 16px;
        }
        .el-menu {
           border-right: none;
           .el-submenu {
               color: #fff;
               .el-submenu__title {
                 color: #fff;
                & > i {
                    color: #fff;
                }
               }
           }
           .el-menu-item {
               color: #fff;
           } 
        }
    }
</style>