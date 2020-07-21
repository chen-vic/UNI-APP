<template>
	<view class="container">
		<!-- <view class="left-bottom-sign"></view> -->
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">FOGOT PASSWORD</view>
			<view class="welcome">
				找回密码
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input
						type="number"
						:value="mobile"
						placeholder="请输入手机号码"
						maxlength="11"
						data-key="mobile"
						@input="inputChange"
					/>
				</view>
				<view class="input-item">
					<text class="tit">验证码</text>
					<input
						type="number"
						:value="validation"
						placeholder="请输入验证码"
						data-key="validation"
						maxlength="6"
						@input="inputChange"
					/>
					<button v-if="isBtn" class="wlf_btn" type="default" @click="validationCodeClick">获取验证码</button>
					<button v-else class="wlf_btn" type="default">{{times}}s后再次点击</button>
					
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input
						type="mobile"
						value=""
						placeholder="6-20位不含特殊字符"
						placeholder-class="input-empty"
						maxlength="20"
						password
						data-key="password"
						@input="inputChange"
					/>
				</view>
				<view class="input-item">
					<text class="tit">再次输入密码</text>
					<input
						type="mobile"
						value=""
						placeholder="6-20位不含特殊字符"
						placeholder-class="input-empty"
						maxlength="20"
						password
						data-key="password1"
						@input="inputChange"
					/>
				</view>
				
				</view>
			</view>
			<button class="confirm-btn" @click="submit">提交</button>
			<!--  :disabled="logining" -->
			<!-- <view class="forget-section">
				忘记密码?
			</view> -->
		</view>
		<!-- <view class="register-section">
			还没有账号?
			<text @click="toRegist">马上注册</text>
		</view> -->
	</view>
</template>

<script>
	import API from '@/common/API.js';
	import {
        mapMutations
    } from 'vuex';

	export default{
		data(){
			return {
				isvalidationCode:'',
				isBtn:true,
				time:null,
				times:60,
				mobile: '',
				validation:'',
				password: '',
				logining: false
			}
		},
		onLoad(){
			
		},
		onShow() {
			clearInterval(this.time)
		},
		methods: {
			...mapMutations(['login']),
			//获取验证码
			validationCodeClick(){
				const {mobile} = this;
				console.log(mobile)
				if (mobile == "") {
					uni.showToast({
						title: '请输入手机号!',
						icon: "none"
					});
					return
				}
				clearInterval(this.time)
				let _this = this
				let params = {
					mobile_phone:mobile
				}
				console.log(JSON.stringify(params))
				API._POST('/api/codes/alisms', params, res => {
					console.log('res',JSON.stringify(res))
					if (res.code == 0) {
						this.isBtn = false
						this.times--
						this.time = setInterval(function(){
							_this.times--
							if (_this.times <= 0) {
								_this.isBtn = true
								_this.times = 0
								clearInterval(this.time)
							}
						},1000)
						this.isvalidationCode = res.data.code_num
						uni.showToast({
							title: res.msg
						});
					} else {
						uni.showToast({
							title: res.msg
						});
					}
				})
				
				
				
				console.log('获取验证码')
			},
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack(){
				uni.navigateBack();
			},
			
			//点击找回密码
			async submit(){
				const {mobile,validation, password, password1} = this;
				console.log('-',mobile,'-',validation,'-',password,'-',password1)
				if (mobile == "") {
					uni.showToast({
						title: '请输入手机号!',
						icon: "none"
					});
					return
				}
				if (validation == "") {
					uni.showToast({
						title: '请输入验证码!',
						icon: "none"
					});
					return
				}
				if (Number(validation) !== Number(this.isvalidationCode)) {
					uni.showToast({
						title: '验证码输入错误!',
						icon: "none"
					});
					return
				}
				
				if (password == "") {
					uni.showToast({
						title: '请输入密码!',
						icon: "none"
					});
					return
				}
				if (password1 !== password) {
					uni.showToast({
						title: '两次密码输入有误,请再次输入!',
						icon: "none"
					});
					return
				}
				let _this = this
				this.logining = true;

				//URL=https://api.wanlef.com/api/members/password?verify_code=886647&member_account=&mobile_phone=15288888888&member_password=123456
				//https://api.wanlef.com/api/members/password?verify_code=886647&mobile_phone=15288888888&member_password=123456
				let url = `/api/members/password?verify_code=${validation}&member_account=&mobile_phone=${mobile}&member_password=${password}`
				API._POST(url, null, res => {
					console.log('res',JSON.stringify(res))
					if (res.code == 0) {
						_this.logining = false
						if (res.code == 0) {
							_this.$api.msg('密码找回成功，请重新登录！')
							setTimeout(function(){
								uni.navigateBack();
							},1000)
						}
					} else {
						_this.$api.msg('密码找回失败')
					}
				}).catch( err =>{
					console.log(err)
				})
				// const sendData = {
				// 	mobile,
				// 	password
				// };
				// const result = await this.$api.json('userInfo');
				// if(result.status === 1){
				// 	this.login(result.data);
    //                 uni.navigateBack();
				// }else{
				// 	this.$api.msg(result.msg);
				// 	this.logining = false;
				// }
			}
		},

	}
</script>

<style lang='scss'>
	page{
		background: #fff;
	}
	.container{
		padding-top: 115px;
		position:relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}
	.wrapper{
		position:relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}
	.back-btn{
		position:absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}
	.left-top-sign{
		font-size: 80upx;
		color: $page-color-base;
		position:relative;
		left: -16upx;
	}
	.right-top-sign{
		position:absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;
		&:before, &:after{
			display:block;
			content:"";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}
		&:before{
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}
		&:after{
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}
	.left-bottom-sign{
		position:absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}
	.welcome{
		position:relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0,0,0,.3);
	}
	.input-content{
		padding: 0 60upx;
	}
	.input-item{
		display:flex;
		flex-direction: column;
		align-items:flex-start;
		justify-content: center;
		padding: 0 30upx;
		background:$page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;
		position: relative;
		&:last-child{
			margin-bottom: 0;
		}
		.tit{
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}
		input{
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}
		.wlf_btn{
			width: 100px;
			height: 40px;
			position: absolute;
			right: 20px;
			top:50%;
			transform:translate(0,-50%);
			font-size: 12px;
		}
	}

	.confirm-btn{
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;
		&:after{
			border-radius: 100px;
		}
	}
	.forget-section{
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}
	.register-section{
		position:absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;
		text{
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
</style>
