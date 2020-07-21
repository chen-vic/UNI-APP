<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">姓名</text>
			<input class="input" type="text" v-model="eventData.member_name" placeholder="请输入姓名" maxlength="20"
			 placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="eventData.mobile_phone" placeholder="请输入手机号" maxlength="11"
			 placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">备注</text>
			<input class="input" type="text" v-model="eventData.enroll_remark" placeholder="请填写备注" maxlength="30"
			 placeholder-class="placeholder" />
		</view>
		<view class="uni-flex uni-row">
			<view class="flex-item"><button class="add-btn" @click="confirm">确定</button></view>
		</view>

	</view>
</template>

<script>
	import API from '@/common/API.js';

	export default {
		data() {
			return {
				eventData: {
					member_name: '',
					mobile_phone: '',
					enroll_people: 1,
					enroll_remark: '',
					member_id: -1,
					event_id: -1,
				},
				event_id: -1,
			};
		},
		onLoad(options) {
			console.log('id='+options.id);
			this.event_id = options.id;
			if(uni.getStorageSync('CLOUDIN_WLF_REAL_NAME')){
				this.eventData.member_name = uni.getStorageSync('CLOUDIN_WLF_REAL_NAME');
				this.eventData.mobile_phone = uni.getStorageSync('CLOUDIN_WLF_MOBILE_PHONE');
			}
		},
		methods: {
			//提交
			confirm() {
				let data = this.eventData;
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
				
				this.eventData.member_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID');
				this.eventData.event_id = 1;
				console.log('eventData=' + JSON.stringify(this.eventData));

				API._POST_ID('POST.eventenroll',this.event_id, this.eventData, res => {
					if (res.code === 0) {
						this.$api.msg(res.msg);
						setTimeout(() => {
							uni.setStorageSync('CLOUDIN_WLF_REAL_NAME',this.eventData.member_name);
							uni.setStorageSync('CLOUDIN_WLF_MOBILE_PHONE',this.eventData.mobile_phone);
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
