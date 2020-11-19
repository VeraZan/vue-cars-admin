<template>
  <el-dialog 
    :title="parking_data.parkingName" 
    class="cars-dialog-center" 
    :visible.sync="dialogVisible" 
    @close="close"
    @opened="opened" 
    v-dialogDrag
  >
    <div class="amap-wrap">
      <Amap ref="aMap" />
    </div>
  </el-dialog>
</template>

<script>
import Amap from "@/views/amap";
export default {
  name:"ShowMapLocation",
  props:{
    flagVisible:{
      type:Boolean,
      default:false
    },
    parking_data:{
      type:Object,
      default:() => {}
    }
  },
  components:{ Amap },
  data(){
    return{
      dialogVisible:false
    }
  },
  methods:{
    close(){
      this.$emit("update:flagVisible",false);
      this.$refs.aMap.mapDestroy();
    },
    opened(){
      this.$refs.aMap.mapCreate();
      //$nextTick DOM加载完成后执行
      this.$nextTick(() => {
        const lnglat_arr = this.parking_data.lnglat.split(",");
        const lnglat = {
          lng:lnglat_arr[0],
          lat:lnglat_arr[1]
        };
        this.$refs.aMap.setMarker(lnglat);
      })
    }
  },
  watch:{
    flagVisible:{
      handler(newValue,oldValue){
        this.dialogVisible = newValue;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.amap-wrap{
  height:500px;
}
</style>