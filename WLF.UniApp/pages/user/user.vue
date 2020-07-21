<template>
	<view class="container" style="background-color: #eee;">
		<view class="bg-white">
			<view class="user-section">
				<image class="bg" src="http://img.wanlef.com/mp/bg_me_top.png"></image>
				<view class="user-info-box">
					<view class="portrait-box" @click="updateUserInfo">
						<image class="portrait" :src="member_avatar || '/static/missing-face.png'"></image>
                        <text v-if="is_login" class="edit">编辑</text>
					</view>
					<view class="info-box">
						<!-- #ifdef MP -->
						<view v-if="!is_login">
							<button open-type="getUserInfo" class="login-button" @getuserinfo="wxGetUserInfo">授权登陆</button>
						</view>
						<view v-else>
							<view class="username">{{member_name || '新会员'}}</view>
							<uni-tag v-if="mobile_phone" :text="mobile_phone" type="error" :circle="true"></uni-tag>
							<button v-else @getphonenumber="getphonenumber" open-type="getPhoneNumber">获取手机号</button>              
						</view>
						<!-- #endif -->
						<!-- #ifdef APP-PLUS -->
						<view v-if="!is_login">
							<button class="login-button" @click="navToLogin">去登录</button>
						</view>
						<view v-else>
							<view class="username">{{member_name || '新会员'}}</view>
							<uni-tag text="普通会员" type="error" :circle="true"></uni-tag>
						</view>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<view v-if="!is_login">
							<button class="login-button" @click="navToLogin">去登录</button>
						</view>
						<view v-else>
							<view class="username">{{member_name || '新会员'}}</view>
							<uni-tag text="普通会员" type="error" :circle="true"></uni-tag>
						</view>
						<!-- #endif -->
					</view>
				</view>
				<view @click="navTo('/pages/coin/coin')">
					<view class="coin_num flex flex-column">
						<text class="name">我的福豆</text>
						<text class="num">{{fubi_num}}</text>
					</view>
					<image class="me_coin" src="http://img.wanlef.com/mp/bg_me_coin2@2x.png"></image>
				</view>
			</view>

			<!--我的订单-->
			<view class="flex order_tabs_body">
				<view class="flex flex-1 flex-column order_tab_t" @click="navTo('/pages/order/order')">
					<view>
						<image class="order_icon" src="/static/me/ic_me_order1.svg" mode=""></image>
					</view>
					<view>我的订单</view>
				</view>
				<view class="flex flex-2 order_tabs flex-column">
					<view class="order_tabs_col flex justify-between" style="border-bottom: 1rpx solid #eee;margin-bottom: 16rpx;padding-bottom: 16rpx;">
						<view class="flex flex-row" @click="toOrder(1)">
							<view class="orderTag_name">待付款</view>
							<image class="order_icon" src="/static/me/ic_me_order2.svg" mode=""></image>
						</view>
						<view class="flex flex-row" @click="toOrder(3)">
							<view class="orderTag_name">待评价</view>
							<image class="order_icon" src="/static/me/ic_me_order3.svg" mode=""></image>
						</view>
					</view>
					<view class="order_tabs_col flex justify-between">
						<view class="flex flex-row" @click="toOrder(2)">
							<view class="orderTag_name">待收货</view>
							<image class="order_icon" src="/static/me/ic_me_order4.svg" mode=""></image>
						</view>
						<view class="flex flex-row" @click="toOrder(4)">
							<view class="orderTag_name">售后服务</view>
							<image class="order_icon" src="/static/me/ic_me_order5.svg" mode=""></image>
						</view>
					</view>
				</view>
			</view>

		</view>
		<!--我的操作-->
		<view class="blank"></view>
		<view class="list_block">
			<uni-list>
				<uni-list-item @click="navTo('/pages/address/address')" title="地址管理" thumb="/static/me/ic_me_adress.svg" />
				<uni-list-item title="报名活动" @click="navTo('/pages/user/myevent')" thumb="/static/me/ic_me_sign.svg"  />
				<uni-list-item title="预约服务" @click="navTo('/pages/user/myservice')" thumb="/static/me/ic_me_appoint.svg"  />
				<uni-list-item title="收藏商品" @click="navTo('/pages/user/favorite')" thumb="/static/me/ic_me_birthday.svg" />
			</uni-list>

		</view>
		<view class="blank"></view>
		<view class="list_block" style="margin-bottom: 200rpx;">
			<uni-list>
				<uni-list-item @click="navTo('/pages/invite/invite')" title="邀请有礼" thumb="/static/me/ic_me_invite.svg" />
				<uni-list-item @click="navTo('/pages/user/service')" title="服务中心" thumb="/static/me/ic_me_help.svg" />
				<!-- #ifdef APP-PLUS -->
				<uni-list-item @click="navTo('/pages/set/set')" title="设置"  thumb="/static/me/seting.svg" />
				<!-- #endif -->
			</uni-list>
		</view>
	</view>
</template>
<script>
	import listCell from '@/components/mix-list-cell';
	import API from '@/common/API.js'
	import basicMixins from '@/common/basic-mixins.js'
	import {
		mapState,
		mapMutations
	} from 'vuex';

	let startY = 0,
		moveY = 0,
		pageAtTop = true;
	export default {
		mixins: [basicMixins],
		components: {
			listCell
		},
		computed: {
			...mapState(['userInfo'])
		},
		data() {
			return {
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				wechatData: {
					session_key: '',
					openid: '',
					access_token: '',
				},
				member_name: '',
				member_avatar: '',
				is_login: false,
				fubi_num: 0, //福豆数量
                mobile_phone: ''
			}
		},
		onLoad(option) {
		},
		onShow() {
			let get_member_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID');
			let get_member_name = uni.getStorageSync('CLOUDIN_WLF_MEMBER_NAME');
			let get_member_avatar = uni.getStorageSync('CLOUDIN_WLF_MEMBER_AVATAR');
			let get_mobile_phone = uni.getStorageSync('CLOUDIN_WLF_MOBILE_PHONE')
            this.mobile_phone = get_mobile_phone
			if (!get_mobile_phone && this.get_member_id) {
				this.bindMobilephone()
			}
			console.log('member_name=' + get_member_name);
			if (get_member_id) {
				this.member_name = get_member_name;
				this.member_avatar = get_member_avatar;
				this.is_login = true;
				// app暂无用户信息，只要获取福豆数量
				this.getMemberCoin(get_member_id);
			} else {
				this.is_login = false;
				this.fubi_num = 0;
				// #ifdef MP
				this.getOpenId();
                // #endif
			}
		},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.navTo('/pages/set/set');
			} else if (index === 1) {
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url: '/pages/notice/notice'
				})
			}
		},
		// #endif
		methods: {
			...mapMutations(['login']),

			toOrder (status) {
				let get_member_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID');
				if (get_member_id == undefined || get_member_id == '') {
					this.$api.msg('请先登录！')
					return
				} 
				uni.setStorageSync('CLOUDIN_WLF_ORDER_STATUS', status);
				uni.navigateTo({
					url: '/pages/order/order?status=' + status
				})
			},
			navToLogin() {
				uni.navigateTo({
					url: '/pages/public/login'
				});
			},
            getphonenumber(e) {
                console.log('e', e)
                API._POST('/api/wechat/getphone', {
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv,
                    code: this.wechatData.session_key,
                    rawData: '',
                    signature: ''
                }, res => {
                    console.log('12', res)
                    if (res.code == 0) {
                        let data = JSON.parse(res.data)
                        this.mobile_phone = data.phoneNumber
                        uni.setStorageSync('CLOUDIN_WLF_MOBILE_PHONE', data.phoneNumber);
                    }
                })
            },
			//获取OPENID
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

			//授权获取用户昵称或头像
			wxGetUserInfo: function(res) {
				if (!res.detail.iv) {
					uni.showToast({
						title: "您取消了授权,登录失败",
						icon: "none"
					});
					return false;
				} else {
					console.log('detail=' + JSON.stringify(res.detail));
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
					
					// uni.setStorageSync('', )
					//获取昵称、头像并更新
					API._POST('POST.update', {
						open_id: this.wechatData.openid,
						member_avatar: res.detail.userInfo.avatarUrl,
						member_name: res.detail.userInfo.nickName,
						real_name: res.detail.userInfo.nickName,
						member_gender: '' + res.detail.userInfo.gender,
					}, res => {
						if (res.code == 0) {
							this.is_login = true;
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
						console.log(res)
						console.log('member_id=' + res.data.member_id);
						uni.setStorageSync('CLOUDIN_WLF_MEMBER_ID', res.data.member_id);
						uni.setStorageSync('CLOUDIN_WLF_COMPANY_ID', res.data.company_id);
						uni.setStorageSync('CLOUDIN_WLF_QRCODE', res.data.member_qrcode);
						uni.setStorageSync('CLOUDIN_WLF_MEMBER_STATUS', res.data.member_status);
						uni.setStorageSync('CLOUDIN_WLF_MEMBER_COIN_NUM', res.data.coin_num);
						uni.setStorageSync('CLOUDIN_WLF_MOBILE_PHONE', res.data.mobile_phone);
						// if (!res.data.mobile_phone) {
						// 	this.bindMobilephone()
						// }
	
                        this.login(res.data)
						// uni.navigateBack();
						this.getMemberCoin(res.data.member_id);
					}
				});
			},
			
			// 提示绑定手机号
			bindMobilephone() {
				uni.showModal({
					title: '提示',
					content: '为确保您的多端据同步及安全，请先绑定手机号码！',
					showCancel: true,
					success: res => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/userinfo/userinfo'
							})
						}
					},
					fail: () => {},
					complete: () => {}
				});
			},

			//获取会员福豆数量
			async getMemberCoin(member_id) {
				let open_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_OPENID');
				await API._GET('/api/membercoin/' + member_id, null, res => {
					if (res.code == 0) {
						console.log('res=' + JSON.stringify(res));
						this.fubi_num = res.data.coin_num;
						console.log('福豆数：', this.fubi_num)
					}
				});
			},

			openLoginPage() {
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
			
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url) {
				let get_member_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID');
				if (get_member_id == undefined || get_member_id == '') {
					this.$api.msg('请先登录！')
				} else {
					uni.navigateTo({
						url
					});

				}
			},
			
			/**
			 * 跳转到TAB页面
			 */
			switchTo() {
				let get_member_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID');
				console.log('get_member_id=' + get_member_id);
				if (get_member_id == undefined || get_member_id == '') {
					this.$api.msg('请先登录！')
				} else {
					uni.switchTab({
						url: '/pages/orders/orders'
					});
				}

			},
			
			/**
			 *  会员卡下拉和回弹
			 *  1.关闭bounce避免ios端下拉冲突
			 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
			 *    transition设置0.1秒延迟，让css来过渡这段空窗期
			 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
			 */
			coverTouchstart(e) {
				if (pageAtTop === false) {
					return;
				}
				this.coverTransition = 'transform .1s linear';
				startY = e.touches[0].clientY;
			},
			
			coverTouchmove(e) {
				moveY = e.touches[0].clientY;
				let moveDistance = moveY - startY;
				if (moveDistance < 0) {
					this.moving = false;
					return;
				}
				this.moving = true;
				if (moveDistance >= 80 && moveDistance < 100) {
					moveDistance = 80;
				}

				if (moveDistance > 0 && moveDistance <= 80) {
					this.coverTransform = `translateY(${moveDistance}px)`;
				}
			},
			coverTouchend() {
				if (this.moving === false) {
					return;
				}
				this.moving = false;
				this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
				this.coverTransform = 'translateY(0px)';
			},
			
			updateUserInfo() {
				if (this.is_login) {
					uni.navigateTo({
						url: '/pages/userinfo/userinfo'
					})
				}
			}
		}
	}
</script>
<style lang='scss'>
	%flex-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	%section {
		display: flex;
		justify-content: space-around;
		align-content: center;
		background: #fff;
		border-radius: 10upx;
	}

	.user-section {
		height: 544upx;
		padding: 100upx 30upx 0;
		position: relative;

		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			filter: blur(1px);
			opacity: .7;
		}

		.coin_num {
			position: absolute;
			bottom: 40upx;
			right: 80rpx;
			text-align: right;
			z-index: 1;
			color: #D0701D;

			.name {
				font-size: 28upx;
				font-weight: 500;
				line-height: 32upx;
			}

			.num {
				font-size: 64upx;
				font-weight: 700;
				margin-top: 8upx;
				text-align: center;
			}
		}

		.me_coin {
			width: 662upx;
			height: 208upx;
			position: absolute;
			bottom: 0;
			right: 0;
			left: 0;
			margin: auto;
		}
	}

	.user-info-box {
		height: 180upx;
		display: flex;
		align-items: center;
		position: relative;
		z-index: 1;

		.portrait {
			width: 130upx;
			height: 130upx;
			border: 5upx solid #fff;
			border-radius: 50%;
			margin-right: 30rpx;
			margin-left: 20rpx;
			margin-top: 10rpx;
		}

		.username {
			font-size: $font-lg + 20upx;
			color: #fff;
			margin-left: 20upx;
			font-weight: 500;

		}
        
        .edit {
            position: absolute;
            left: 24rpx;
            bottom: 32rpx;
            width: 120rpx;
            height: 50rpx;
            display: inline-block;
            background: rgba(0, 0, 0, .5);
            border-bottom-left-radius: 65rpx;
            border-bottom-right-radius: 65rpx;
            font-size: 26upx;
            text-align: center;
            color: #FFFFFF;
        }
        
	}

	.vip-card-box {
		display: flex;
		flex-direction: column;
		color: #f7d680;
		height: 240upx;
		background: linear-gradient(left, rgba(0, 0, 0, .7), rgba(0, 0, 0, .8));
		border-radius: 16upx 16upx 0 0;
		overflow: hidden;
		position: relative;
		padding: 20upx 24upx;

		.card-bg {
			position: absolute;
			top: 20upx;
			right: 0;
			width: 380upx;
			height: 260upx;
		}

		.b-btn {
			position: absolute;
			right: 20upx;
			top: 16upx;
			width: 132upx;
			height: 40upx;
			text-align: center;
			line-height: 40upx;
			font-size: 22upx;
			color: #36343c;
			border-radius: 20px;
			background: linear-gradient(left, #f9e6af, #ffd465);
			z-index: 1;
		}

		.tit {
			font-size: $font-base+2upx;
			color: #f7d680;
			margin-bottom: 28upx;

			.yticon {
				color: #f6e5a3;
				margin-right: 16upx;
			}
		}

		.e-b {
			font-size: $font-sm;
			color: #d8cba9;
			margin-top: 10upx;
		}
	}

	.cover-container {
		background: $page-color-base;
		margin-top: -150upx;
		padding: 0 30upx;
		position: relative;
		background: #f5f5f5;
		padding-bottom: 20upx;

		.arc {
			position: absolute;
			left: 0;
			top: -34upx;
			width: 100%;
			height: 36upx;
		}
	}

	.tj-sction {
		@extend %section;

		.tj-item {
			@extend %flex-center;
			flex-direction: column;
			height: 140upx;
			font-size: $font-sm;
			color: #75787d;
		}

		.num {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 8upx;
		}
	}

	.order-section {
		@extend %section;
		padding: 28upx 0;
		margin-top: 20upx;

		.order-item {
			@extend %flex-center;
			width: 120upx;
			height: 120upx;
			border-radius: 10upx;
			font-size: $font-sm;
			color: $font-color-dark;
		}

		.yticon {
			font-size: 48upx;
			margin-bottom: 18upx;
			color: #fa436a;
		}
        
		.icon-shouhoutuikuan {
			font-size: 44upx;
		}
	}

	.history-section {
		padding: 30upx 0 0;
		margin-top: 20upx;
		background: #fff;
		border-radius: 10upx;

		.sec-header {
			display: flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40upx;
			margin-left: 30upx;

			.yticon {
				font-size: 44upx;
				color: #5eba8f;
				margin-right: 16upx;
				line-height: 40upx;
			}
		}

		.h-list {
			white-space: nowrap;
			padding: 30upx 30upx 0;

			image {
				display: inline-block;
				width: 160upx;
				height: 160upx;
				margin-right: 20upx;
				border-radius: 10upx;
			}
		}


	}

	/*订单*/
	.order_tabs_body {
		padding: 32rpx;
		background-color: #fff;
	}

	.order_icon {
		width: 50rpx;
		height: 50rpx;
		overflow: hidden;
	}

	.order_tabs {
		padding: 32rpx;
	}

	.order_tab_t {
		text-align: center;
		font-size: 32rpx;
		padding-top: 40rpx;
		border-right: 1rpx solid #ddd;
	}

	.order_tabs_col {
		margin-right: 40rpx;
	}

	.order_tabs_col .orderTag_name {
		width: 130rpx;
		font-size: 32rpx;
	}

	.list_block {}

	.login-button {
		margin-left: 30rpx;
	}
</style>
