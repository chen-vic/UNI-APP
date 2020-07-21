<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome">
				欢迎回来！
			</view>
			<view class="register" @click="navToLogin">马上注册</view>
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
					<text class="tit">密码</text>
					<input
						type="mobile"
						value=""
						placeholder="8-18位不含特殊字符的数字、字母组合"
						placeholder-class="input-empty"
						maxlength="20"
						password
						data-key="password"
						@input="inputChange"
						@confirm="toLogin"
					/>
				</view>
			</view>
			<view class="register-section">
				<view class="d-flex">
					<checkbox-group @change="changeChecked">
						<label>
							<checkbox value="cb" :checked="readSection" />
						</label>
					</checkbox-group>
					<view class="forget-section" @click="navToWebPage('https://manage.wanlef.com/cards/policy')">
						同意《用户协议&隐私条款》
					</view>
				</view>
				<view class="forgot-pw" @click="forgotPw">忘记密码</view>
			</view>
			<button class="confirm-btn" @click="toLogin" :disabled="logining">登录</button>

		</view>

		<!-- <view class="register-section">
			<view>
			                <checkbox-group>
			                    <label>
			                        <checkbox value="cb" checked="true" />同意
			                    </label>
			                </checkbox-group>
			            </view>
			<view class="forget-section" @click="navToWebPage('https://manage.wanlef.com/cards/policy')">
				您已认真阅读理解和同意《用户协议&隐私条款》，如您不是消费者，或者不同意本协议或任何条款约定，应立即停止注册使用本软件及服务。</br>
			</view>
			还没有账号?
			<text @click="navToLogin">马上注册</text>
		</view> -->
		<uni-popup ref="popup" type="dialog">
		    <uni-popup-dialog :showClose="true" title='用户协议&隐私条款' type="info" content="在您使用'万乐福'之前,请仔细阅读用户协议&隐私条款》，如您不是消费者，或者不同意本协议或任何条款约定，应立即停止注册使用本软件及服务。请点击同意开始使用我们的产品和服务,我们将尽力保护您的个人信息安全." :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import API from '@/common/API.js';
	import {
        mapMutations
    } from 'vuex';

	export default{
		components: {
			uniPopup,
			uniPopupDialog,
			uniPopupMessage
		},
		data(){
			return {
				mobile: '',
				password: '',
				logining: false,
				readSection: false
			}
		},
		onLoad(){
            // 隐藏弹窗
			// if(!uni.getStorageSync('CLOUDIN_WLF_START_DATA')) {
			// 	this.$nextTick(function(){
			// 		this.$refs.popup.open()
			// 		this.readSection = false
			// 	})
			// }
		},
		methods: {
			...mapMutations(['login']),
			changeChecked(e) {
				console.log(e.detail.value)
				this.readSection = e.detail.value == 'cb' ? true : false
				if (this.readSection) {
					uni.setStorageSync('CLOUDIN_WLF_START_DATA', ((new Date()).getTime()));
				} else {
					uni.setStorageSync('CLOUDIN_WLF_START_DATA', (('')))
				}
				
			},
			/**
			 * 点击取消按钮触发
			 * @param {Object} done
			 */
			close(done){
				// TODO 做一些其他的事情，before-close 为true的情况下，手动执行 done 才会关闭对话框
				// ...
				done()
			},
			/**
			 * 点击确认按钮触发
			 * @param {Object} done
			 * @param {Object} value
			 */
			confirm(done,value){
				// 输入框的值
				console.log(value)
				// TODO 做一些其他的事情，手动执行 done 才会关闭对话框
				// ...
				done()
				this.readSection = true
				uni.setStorageSync('CLOUDIN_WLF_START_DATA', ((new Date()).getTime()));
				this.navToWebPage('https://manage.wanlef.com/cards/policy')
			},
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack(){
				uni.navigateBack();
			},
			navToLogin(){
				uni.navigateTo({
					url: '/pages/public/registered'
				});
			},
			/**
			 * 跳转到网页
			 */
			navToWebPage(url) {
				uni.navigateTo({
					url: '/pages/webview/webview?url=' + url
				});
			},
			/**
			 * 跳转到忘记密码页面
			 * */
			forgotPw() {
				uni.navigateTo({
					url: '/pages/public/forgotPw'
				});
			},
			async toLogin(){
				let that = this
				const {mobile, password} = this;
				if (!mobile) {
					this.$api.msg('请输入手机号码')
					return
				}
				if (!password) {
					this.$api.msg('请输入密码')
					return
				}
				if (!this.readSection) {
					this.$api.msg('请阅读并同意用户协议和隐私条款')
					return
				}
				this.logining = true;
				API._POST('POST.applogin', {
					mobile_phone: mobile,
					member_password: password,
					open_id: '',
				}, res => {
					console.log('login=====>', JSON.stringify(res))
					if (res.code == 0) {
						uni.setStorageSync('CLOUDIN_WLF_MEMBER_ID', res.data.member_id);
						uni.setStorageSync('CLOUDIN_WLF_COMPANY_ID', res.data.company_id);
						uni.setStorageSync('CLOUDIN_WLF_QRCODE', res.data.member_qrcode);
						uni.setStorageSync('CLOUDIN_WLF_MEMBER_STATUS', res.data.member_status);
						uni.setStorageSync('CLOUDIN_WLF_USERINFO', JSON.stringify(res.data))
                        uni.setStorageSync('CLOUDIN_WLF_MOBILE_PHONE', res.data.mobile_phone)
                        this.login(res.data)
						uni.navigateBack();
						return true
					}

					that.$api.msg(res.msg);
					that.logining = false
				});

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
		font-size: 120upx;
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
	.register{
		position: absolute;
		top: 75upx;
		right: 100upx;
		font-size: $font-sm+4upx;
		color: $font-color-spec;
		z-index: 999999;
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
	}
	.register-section{
		width: 630upx;
		margin: 40upx auto 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;
		.d-flex {
			display: flex;
			align-items: center;
		}
		text{
			color: $font-color-spec;
			margin-left: 10upx;
		}
		.forgot-pw {
			color: $font-color-spec;
		}
	}
</style>
