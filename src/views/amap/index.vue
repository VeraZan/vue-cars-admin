<template>
  <div class="amap-wrap">
    <el-amap vid="amapContainer" class="amap-demo"></el-amap>
  </div>
</template>

<script>
import { AMapManager,lazyAMapApiLoaderInstance } from 'vue-amap';
import { getLngLat } from "./common";
import { addressSetMapCenter } from "./location";
import { amapSetMarker,amapClearMarker } from "./marker";
export default {
  name:"Map",
  props:{
    options:{
      type:Object,
      default:() => {}
    }
  },
  data(){
    return{
      lnglat:{},
      map:null,
      zoom:18,
      events:{}
    }
  },
  mounted(){
    const _this = this;
    lazyAMapApiLoaderInstance.load().then(() => {
      this.mapCreate();
      this.map.on("click",function(e){//function会改变this指向
        const lnglat = getLngLat(e);
        _this.lnglat = lnglat;
        _this.$emit("callback",{
          function:"getLngLatValue",
          data:{
            lnglat
          }
        })
        _this.setMarker();
      })
    })
  },
  methods:{
    /** 根据选择区域设置地图中心点 */
    setMapCenter(address){
      addressSetMapCenter(address,this.map);
    },
    /** 设置点覆盖物 */
    setMarker(lnglat){
      amapSetMarker(lnglat || this.lnglat, this.map);
    },
    /** 清除点覆盖物 */
    clearMarker(){
      amapClearMarker(this.map);
    },
    mapCreate(){
      this.map = new AMap.Map('amapContainer', {
        zoom:this.zoom,//级别
        center: [116.397428, 39.90923],//中心点坐标
      });
      //地图加载完成
      this.map.on("complete",() => {
        this.mapLoad();
      })
    },
    mapDestroy(){
      this.map && this.map.destroy();
    },
    mapLoad(){
      if(this.options && this.options.mapLoad){
        this.$emit("callback",{
          function:"mapLoad"
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.amap-wrap{
  height:100%;
}
</style>