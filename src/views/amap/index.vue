<template>
  <div class="amap-wrap">
    <el-amap vid="amapContainer" class="amap-demo"></el-amap>
  </div>
</template>

<script>
import { AMapManager,lazyAMapApiLoaderInstance } from 'vue-amap';
export default {
  name:"Map",
  data(){
    return{
      map:null,
      zoom:18,
      events:{}
    }
  },
  mounted(){
    lazyAMapApiLoaderInstance.load().then(() => {
      this.map = new AMap.Map('amapContainer', {
        zoom:this.zoom,//级别
        center: [116.397428, 39.90923],//中心点坐标
      });
    })
  }
}
</script>

<style lang="scss" scoped>
.amap-wrap{
  height:100%;
}
</style>