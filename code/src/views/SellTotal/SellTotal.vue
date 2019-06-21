<template>
    <div class="sell-total">
        <h2>销售统计</h2>
        <div id="myChart" :style="{width: '1000px', height: '500px'}"></div>
    </div>
</template>

<script>
    export default {
         name: 'hello',
    mounted(){
            this.drawLine();
            },
    methods:{
         drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
            title: { text: '商品销量' },
            tooltip: {},
            xAxis: {
                data: ["至纯源石","寻访凭证","龙门币","四水研磨石","糖块","糖组"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'line',
                data: [5, 20, 36, 10, 10, 20]
            }]
        });
    }
  }
    }
</script>

<style lang="less">
        #myChart{
            margin-top: 100px;
            margin-left: 20px;
        }
</style>