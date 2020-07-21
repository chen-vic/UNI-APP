<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">姓名</text>
			<input class="input" type="text" v-model="serviceData.member_name" placeholder="请输入姓名" maxlength="20"
			 placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="serviceData.mobile_phone" placeholder="请输入手机号" maxlength="11"
			 placeholder-class="placeholder" />
		</view>
		<view class="row b-b" @click="chooseLocation">
			<text class="tit">预约日期</text>
			<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
				<view class="uni-input">{{date}}</view>
			</picker>
		</view>
		<view class="row b-b">
			<text class="tit">备注</text>
			<input class="input" type="text" v-model="serviceData.order_remark" placeholder="请填写备注" maxlength="30"
			 placeholder-class="placeholder" />
		</view>
		<view class="uni-flex uni-row">
			<view class="flex-item"><button class="add-btn" @click="confirm">确定</button></view>
		</view>

	</view>
</template>

<script>
	import API from '@/common/API.js';

	function getDate(type) {
		const date = new Date();

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		if (type === 'start') {
			year = year - 60;
		} else if (type === 'end') {
			year = year + 2;
		}
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;

		return `${year}-${month}-${day}`;
	}
	export default {
		data() {
			return {
				serviceData: {
					member_name: '',
					mobile_phone: '',
					order_date: '',
					order_remark: '',
					member_id: -1,
					service_id: -1,
				},
				date: getDate({
					format: true
				}),
				startDate: getDate('start'),
				endDate: getDate('end'),
				service_id: -1,
			};
		},
		onLoad(options) {
			console.log('id='+options.id);
			this.service_id = options.id;
			if(uni.getStorageSync('CLOUDIN_WLF_REAL_NAME')){
				this.serviceData.member_name = uni.getStorageSync('CLOUDIN_WLF_REAL_NAME');
				this.serviceData.mobile_phone = uni.getStorageSync('CLOUDIN_WLF_MOBILE_PHONE');
			}
		},
		methods: {
			bindDateChange: function(e) {
				this.date = e.detail.value
			},

			//提交
			confirm() {
				let data = this.serviceData;
				let member_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID');
				console.log('member_id=' + member_id);
				if (member_id == '' || member_id == undefined) {
					uni.showModal({
						title: '提示',
						content: '你还没有授权，请先登陆！',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/login/login'
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					return;
				}
				if (!data.member_name) {
					this.$api.msg('请填写姓名');
					return;
				}
				if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.mobile_phone)) {
					this.$api.msg('请输入正确的手机号码');
					return;
				}
				if (!this.date) {
					this.$api.msg('请选择预约日期');
					return;
				}

				this.serviceData.order_date = this.date;
				this.serviceData.member_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID');
				this.serviceData.service_id = 1;
				console.log('serviceData=' + JSON.stringify(this.serviceData));

				API._POST_ID('POST.serviceorders',this.service_id, this.serviceData, res => {
					if (res.code === 0) {
						this.$api.msg(res.msg);
						setTimeout(() => {
							uni.setStorageSync('CLOUDIN_WLF_REAL_NAME',this.serviceData.member_name);
							uni.setStorageSync('CLOUDIN_WLF_MOBILE_PHONE',this.serviceData.mobile_phone);
							uni.navigateBack();
						}, 1000);
					} else {
						this.$api.msg(res.msg);
					}
				});
			}
		}
	};
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
			width: 200upx;
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
			transform: translateX(16upx) scale(0.9);
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
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
