<template>
  <div>
    <VueForm ref="vuForm" :formItem="form_item" :formData="form_data" :formHandler="form_handler" labelWidth="150px">
      
    </VueForm>
  </div>
</template>

<script>
import VueForm from "@c/form";
import { MemberDetailed,MemberEdit } from "@/api/member";
import { formatRequestData } from "@/utils/format";
export default {
  name:"MemberEdit",
  components:{ VueForm },
  data(){
    return {
      id:this.$route.query.id,
      form_data:{
        blacklist: false,
        cardId: "",
        cardPhotoBack: "",
        cardPhotoBareheaded: "",
        cardPhotoFace: "",
        carsPhotoBack: "",
        carsPhotoFace: "",
        gender: 2,
        illegalAmount: 0,
        truename: "",
        username: "",
      },
      form_item:[
        { 
          type:"Input",
          label:"用户名",
          placeholder:"请输入用户名",
          prop:"username",
          width:"200px",
          required:true,
        },
        { 
          type:"Input",
          label:"真实姓名",
          placeholder:"请输入真实姓名",
          prop:"truename",
          width:"200px"
        },
        { 
          type:"Input",
          label:"身份证",
          placeholder:"请输入身份证",
          prop:"cardId",
          width:"200px"
        },
        { 
          type:"Radio",
          label:"性别",
          prop:"gender",
          options:this.$store.state.config.gender,
        },
        { 
          type:"InputNumber",
          label:"预存违章金额",
          prop:"illegalAmount",
          min:0,
          position:"right",
          required:true
        },
        { 
          type:"Upload",
          label:"身份证（正面）",
          prop:"cardPhotoFace",
          // required:true,
          requestFlag:true
        },
        { 
          type:"Upload",
          label:"身份证（背面）",
          prop:"cardPhotoBack",
          // required:true
        },
        { 
          type:"Upload",
          label:"身份证（免冠）",
          prop:"cardPhotoBareheaded",
          // required:true
        },
        { 
          type:"Upload",
          label:"驾驶证（正面）",
          prop:"carsPhotoFace",
          // required:true
        },
        { 
          type:"Upload",
          label:"驾驶证（反面）",
          prop:"carsPhotoBack",
          // required:true
        },
        { 
          type:"Radio",
          label:"黑名单",
          prop:"blacklist",
          options:this.$store.state.config.blacklist,
        },
      ],
      form_handler:[
        { label:"确定",key:"submit",type:"danger",handler:() => this.formValidate() }
      ]
    }
  },
  methods:{
    detailed(){
      MemberDetailed({ id:this.id }).then(response => {
        this.form_data = formatRequestData(this.form_data,response.data);
      })
    },
    formValidate(){
      this.$refs.vuForm.$refs.form.validate((valid) => {
        if (valid) {
          this.id && this.edit();
        }
      });
    },
    edit(){
      MemberEdit({...this.form_data,id:this.id}).then(response => {
        this.$message.success(response.message);
        this.$router.push({
          name: "MemberList"
        })
      })
    }
  },
  beforeMount(){
    this.id && this.detailed();
  }
}
</script>

<style>

</style>