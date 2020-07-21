<template>
	<!-- 支付界面 -->
	<view class="app">
		<view class="price-box">
			<text>支付福豆</text>
			<text class="price">{{payMoney}}</text>
		</view>

		<view class="pay-type-list">
			<view class="type-item" @click="changePayType(3)">
				<view class="icon">
					<image class=" icon32" src="/static/icon_fubi.png" mode=""></image>
				</view>
				<view class="con">
					<text class="tit">剩余福豆</text>
					<text>可用余额 ¥{{membercoin}}</text>
				</view>
				<label class="radio">
					<radio value="" color="#F62605" :checked='payType == 3' />
					</radio>
				</label>
			</view>
			
			<!-- #ifdef MP -->
			<view class="type-item b-b" @click="changePayType(2)">
				<text class="icon yticon icon-weixinzhifu"></text>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#F62605" :checked='payType == 2' />
					</radio>
				</label>
			</view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<view class="type-item b-b" @click="changePayType(8)">
				<text class="icon yticon icon-weixinzhifu"></text>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#F62605" :checked='payType == 8' />
					</radio>
				</label>
			</view>
			
			<view class="type-item b-b" @click="changePayType(10)">
				<text class="icon yticon icon-alipay"></text>
				<view class="con">
					<text class="tit">支付宝支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#F62605" :checked='payType == 10' />
					</radio>
				</label>
			</view>
			<!-- #endif -->
		</view>

		<text class="mix-btn" @click="confirm">确认支付</text>
	</view>
</template>

<script>
	import API from '@/common/API.js';
	export default {
		data() {
			return {
				orderID: '', //订单id
				membercoin: 0, //剩余福豆
				payMoney: 0, //支付金额
				payType: 2, //2=微信支付，3=福豆
				orderInfo: {},
				provider: 'wxpay'
			};
		},
		computed: {

		},
		onLoad(options) {
			this.currencyMoney()
			console.log(options)
			this.orderID = options.orderID
            this.payMoney = Math.floor(options.money * 100) / 100
			// #ifdef MP
			this.payType = 2
			// #endif
			// #ifdef APP-PLUS
			this.payType = 8
			// #endif
			let memberID = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID')
			API._GET('/api/memberaddress/default/me', {
				member_id: memberID
			}, res => {
				console.log(res)
				if (res.code == 0) {
					this.addressData = res.data
				}
			})
		},

		methods: {
			//获取我的福豆
			currencyMoney() {
				let memberID = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID')
				// 'https://api.wanlef.com/api/membercoin/{member_id}'
				API._GET_ID('/api/membercoin', memberID, res => {
					console.log(res)
					// coin_num
					if (res.code == 0) {
						this.membercoin = res.data.coin_num
					}
				})
			},

			//选择支付方式
			changePayType(type) {
				this.payType = type;

				// #ifdef APP-PLUS
				if(type==10)
				this.provider = 'alipay';
				else	
							this.provider='wxpay';
				// #endif
			},

			//确认支付--
			confirm: async function() {
				console.log('membercoin=' + this.membercoin + ',payMoney=' + this.payMoney)
				console.log('payType=' + this.payType);
				

				let url = '/api/orders/pay';
				// #ifdef APP-PLUS
				url = '/api/orders/payapp';
				// #endif

				console.log('url=' + url + ',payType=' + this.payType);

				let _this = this;
				if (this.payType == 10) {
					API._POST(url, {
							order_id: parseInt(this.orderID),
							paymethod_id: this.payType
						}, res => {
							uni.requestPayment({
								provider: this.provider,
								orderInfo: res.data.body,
								success: function(res) {
									console.log('success:' + JSON.stringify(res));
									uni.reLaunch({
										url: '/pages/money/paySuccess'
									})
								},
								fail: function(err) {
									console.log('fail:' + JSON.stringify(err));
									uni.showToast({
										icon: 'none',
										title: '支付失败！'
									});
									uni.navigateBack();
									console.log('fail:' + JSON.stringify(err));
								}
							});
						});
					}
					//唤起微信支付
					else if (this.payType == 2 || this.payType == 8) {
						//微信支付
						API._POST(url, {
							order_id: parseInt(this.orderID),
							paymethod_id: this.payType
						}, res => {
							uni.requestPayment({
								provider: this.provider,
								timeStamp: res.data.timeStamp,
								nonceStr: res.data.nonceStr,
								package: res.data.package,
								signType: res.data.signType,
								paySign: res.data.paySign,
								success: function(res) {
									console.log('success:' + JSON.stringify(res));
									uni.reLaunch({
										url: '/pages/money/paySuccess'
									})
								},
								fail: function(err) {
									console.log('fail:' + JSON.stringify(err));
									uni.showToast({
										icon: 'none',
										title: '支付失败！'
									});
									// uni.navigateBack();
                                    uni.redirectTo({
                                        url: '/pages/order/order'
                                    })
									console.log('fail:' + JSON.stringify(err));
								}
							});
						})
					} else {
						//其他支付
						if (Number(this.membercoin) < Number(this.payMoney)) {
							uni.showModal({
								content: '福豆余额不足,是否选择现金支付?',
								success: e => {
									//开启混合支付
									if (e.confirm) {
										console.log('用户点击确定');
										uni.showLoading({
											title: '加载中..'
										})
										API._POST('/api/orders/pay', {
											order_id: parseInt(this.orderID),
											paymethod_id: parseInt(this.payType)
										}, res => {
											console.log('res', JSON.stringify(res.data));
											if (res.data) {
												//wechat pay
												uni.requestPayment({
													provider: this.provider,
													timeStamp: res.data.timeStamp,
													nonceStr: res.data.nonceStr,
													package: res.data.package,
													signType: res.data.signType,
													paySign: res.data.paySign,
													success: function(res) {
														console.log('success:' + JSON.stringify(res));
														uni.redirectTo({
															url: '/pages/money/paySuccess'
														})
													},
													fail: function(err) {
														console.log('fail:' + JSON.stringify(err));
														uni.showToast({
															icon: 'none',
															title: '支付失败！'
														});
														uni.navigateBack();
														console.log('fail:' + JSON.stringify(err));
													}
												});
												//end
											}

										})
									} else if (e.cancel) {
										console.log('用户点击取消');
									}
								}
							});
						} else {
							//福豆足够的
							API._POST('/api/orders/pay', {
								order_id: parseInt(this.orderID),
								paymethod_id: this.payType
							}, res => {
								uni.reLaunch({
									url: '/pages/money/paySuccess'
								})

							})

						}




					}
				},
				//end pay	

			}
		}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price {
			font-size: 64upx;
			color: #303133;
			margin-top: 12upx;

			&:before {
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;

		.type-item {
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position: relative;
		}

		.icon {
			width: 100upx;
			font-size: 52upx;

			image {
				width: 60upx;
				height: 60upx;
			}
		}

		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}

		.icon-weixinzhifu {
			color: #36cb59;
		}

		.icon-alipay {
			color: #01aaef;
		}

		.tit {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}

	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 400upx;
	}
</style>
