<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">卡号</text>
			<input class="input" maxlength="20" v-model="cardData.card_no" type="number" placeholder="输入卡号" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">密码</text>
			<input class="input" maxlength="20" v-model="cardData.card_password" password type="text" placeholder="输入密码"
			 placeholder-class="placeholder" />
		</view>
		<view class="cate-section">
			<view class="cate-item">
				<button class="button" @click="activeCard()" :disabled="button_status" type="primary">确认激活</button>
			</view>
			<view class="cate-item">
				<button class="button" @click="scanQRCode()" type="warn">扫码激活</button>
			</view>
		</view>

	</view>
</template>

<script>
	import API from '@/common/API.js'

	export default {
		data() {
			return {
				cardData: {
					card_no: '',
					card_password: ''
				},
				button_status: false,
			}
		},
		onLoad(option) {

		},
		methods: {

			scanQRCode() {
				const self = this;
				uni.scanCode({
					success(res) {
						if (res.scanType == 'WX_CODE' && res.errMsg == 'scanCode:ok') {
							console.log('rawData='+res.rawData);
						} else {
							self.$api.msg('图片信息无法识别！');
						}
					},
					fail() {
						self.$api.msg('二维码识别失败！');
					}
				});
			},

			//提交
			async activeCard() {
				this.button_status = true;
				let data = this.cardData;
				if (!data.card_no) {
					this.$api.msg('请输入卡号');
					this.button_status = false;
					return;
				}
				if (!data.card_password) {
					this.$api.msg('请输入密码');
					this.button_status = false;
					return;
				}

				await API._POST('POST.cardactive', {
					card_no: this.cardData.card_no,
					card_password: this.cardData.card_password,
					card_id: uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID')
				}, res => {
					if (res.code == 0) {
						this.button_status = true;
						this.$api.msg(res.msg);
						setTimeout(() => {
							uni.navigateBack();
						}, 1000)
					} else {
						this.button_status = false;
						this.$api.msg(res.msg);
					}
				});

			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30upx;
		height: 110upx;
		background: #fff;

		.tit {
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.input {
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.icon-shouhuodizhi {
			font-size: 36upx;
			color: $font-color-light;
		}
	}

	.default-row {
		margin-top: 16upx;

		.tit {
			flex: 1;
		}

		switch {
			transform: translateX(16upx) scale(.9);
		}
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 200upx;
	}
	
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		padding: 30upx 22upx;
		background: #fff;
	
		.cate-item {
			width: 48%;
			text-align: center;
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			.button{width: 100%;}
		}
	}
</style>
