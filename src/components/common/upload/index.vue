
<template>
	<el-upload
		class="avatar-uploader"
		action="http://up-z2.qiniup.com"
		:data="uploadData"
		:show-file-list="false"
		:on-success="handleAvatarSuccess"
		:before-upload="beforeAvatarUpload"
	>
		<img v-if="imageUrl" :src="imageUrl" class="avatar" />
		<i v-else class="el-icon-plus avatar-uploader-icon"></i>
	</el-upload>
</template>

<script>
import { GetQiniuToken } from "@/api/common";
export default {
  name: "",
  props: {  
		imgUrl: {
			type: String,
			default: ""
    },
    value:{
      type: String,
			default: ""
    },
    requestFlag:{
      type: Boolean,
			default: false
    }
	},
	data() {
		return {
			imageUrl: "",
			uploadData: {}
		};
  },
	beforeMount(){
		this.requestFlag && this.getQiniuToken();
	},
	methods: {
		getQiniuToken() {
			// 在工作中，
			const requestData = {
        ak: "Avh-EZZAa4TxqPQZsEW42fXBUbTMFi-RKSZTRKJj",
        sk: "l9AXtnhCVkZexXNRcmHXzmecXiCUiLynwGboMeUw",
        buckety: "webjshtml"
			};
			GetQiniuToken(requestData).then(response => {
				const data = response.data;
				if (data.token) {
          this.$store.commit("common/SET_UPLOAD_TOKEN",data.token);
					// this.uploadData.token = data.token;
				}
			});
		},
		handleAvatarSuccess(res, file) {
			this.imageUrl = `http://www-web-jshtml-cn-idva7mx.web-jshtml.cn/${res.key}`;
			this.$emit("update:value", this.imageUrl);
		},
		// 上传之前
		beforeAvatarUpload(file) {
			const isJPG = file.type === "image/jpeg";
			const isLt2M = file.size / 1024 / 1024 < 2;
			if (!isJPG) {
				this.$message.error("上传头像图片只能是 JPG 格式!");
			}
			if (!isLt2M) {
				this.$message.error("上传头像图片大小不能超过 2MB!");
			}
			let fileName = file.name;
			let key = encodeURI(fileName);
      this.uploadData.key = key;
      this.uploadData.token = this.$store.state.common.upload_token;
			return isJPG && isLt2M;
		}
	},
	watch: {
		imgUrl: {
			handler(newValue){
				this.imageUrl = newValue;
      },
      immediate:true
		}
	}
};
</script>

<style lang="scss">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
