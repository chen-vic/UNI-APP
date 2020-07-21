<template>
	<view class="container">
		<view class="empty">
			<view class="empty-tips flex-row justify-center align-center">
				<!-- #ifdef MP -->
				<button class="login" open-type="getUserInfo" @getuserinfo="wxGetUserInfo">授权登陆</button>
				<!-- #endif -->
				<!-- #ifdef APP-PLUS -->
				<view class="navigator" @click="navToLogin">去登录</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="navigator" @click="navToLogin">去登录</view>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
	import API from '@/common/API.js';
	export default {
		data() {
			return {

			}
		},
		onShow() {
			this.getOpenId();
		},
		methods: {
			//获取OPENID--
			async getOpenId() {
				await uni.login({
					success: res => {
						console.log('code=' + res.code);
						API._GET('GET.wxLogin', {
							code: res.code
						}, (res) => {
							console.log('msg=' + res.msg);
							if (res.code == 0) {
								console.log('res=' + JSON.stringify(res));
								this.wechatData = res.data;
								console.log('openid=' + this.wechatData.openid);
							}
						})
					}
				});

			},
			navToLogin() {
				uni.navigateTo({
					url: '/pages/public/login'
				});
			},

			//授权获取用户昵称或头像
			wxGetUserInfo: function(res) {
				if (!res.detail.iv) {
					uni.showToast({
						title: "您取消了授权,登录失败",
						icon: "none"
					});
					return false;
				} else {
					//console.log('detail=' + JSON.stringify(res.detail));
					console.log('avatarUrl=' + res.detail.userInfo.avatarUrl);
					console.log('nickName=' + res.detail.userInfo.nickName);
					console.log('gender=' + res.detail.userInfo.gender);
					console.log('city=' + res.detail.userInfo.city);
					console.log('province=' + res.detail.userInfo.province);
					console.log('country=' + res.detail.userInfo.country);
					this.member_avatar = res.detail.userInfo.avatarUrl;
					this.member_name = res.detail.userInfo.nickName;

					uni.setStorageSync('CLOUDIN_WLF_MEMBER_OPENID', this.wechatData.openid);
					uni.setStorageSync('CLOUDIN_WLF_MEMBER_AVATAR', res.detail.userInfo.avatarUrl);
					uni.setStorageSync('CLOUDIN_WLF_MEMBER_NAME', res.detail.userInfo.nickName);

					//获取昵称、头像并更新
					API._POST('POST.update', {
						open_id: this.wechatData.openid,
						member_avatar: res.detail.userInfo.avatarUrl,
						member_name: res.detail.userInfo.nickName,
						real_name: res.detail.userInfo.nickName,
						member_gender: '' + res.detail.userInfo.gender,
					}, res => {
						if (res.code == 0) {
							this.getMemberInfo();
							console.log('msg=' + res.msg);
						}
					});

				}

			},

			//获取会员信息
			async getMemberInfo() {
				let open_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_OPENID');
				await API._POST('/api/members/openid?openid=' + open_id, null, res => {
					if (res.code == 0) {
						console.log('member_id=' + res.data.member_id);
						uni.setStorageSync('CLOUDIN_WLF_MEMBER_ID', res.data.member_id);
						uni.setStorageSync('CLOUDIN_WLF_COMPANY_ID', res.data.company_id);
						uni.setStorageSync('CLOUDIN_WLF_QRCODE', res.data.member_qrcode);
						uni.setStorageSync('CLOUDIN_WLF_MEMBER_STATUS', res.data.member_status);
						uni.navigateBack();
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	.container {
		padding-bottom: 134upx;

		/* 空白页 */
		.empty {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100vh;
			padding-bottom: 100upx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			background: #fff;

			image {
				width: 240upx;
				height: 160upx;
				margin-bottom: 30upx;
			}

			.empty-tips {
				display: flex;
				font-size: $font-sm + 2upx;
				color: $font-color-disabled;

				.navigator {
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}
</style>
