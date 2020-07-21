<template>
	<view>
		<view class="user-section">
			<!-- <image class="bg" src="/static/user-bg.jpg"></image> -->
			<!-- <text class="bg-upload-btn yticon icon-paizhao"></text> -->
			<view class="portrait-box">
				<image class="portrait" :src="copyUserInfo.member_avatar || '/static/missing-face.png'"></image>
				<!-- <text class="pt-upload-btn yticon icon-paizhao"></text> -->
			</view>
			<view class="content">
				<view class="row b-b" v-if="false">
					<text class="tit">所属单位</text>
					<input class="input" type="text" v-model="copyUserInfo.member_name" disabled placeholder="所属单位" maxlength="10"
					 placeholder-class="placeholder" />
				</view>
				<view class="row b-b">
					<text class="tit">手机号码</text>
					<input class="input" type="number" v-model="copyUserInfo.mobile_phone" placeholder="请输入手机号码" placeholder-class="placeholder" />
				</view>
				<view class="row b-b">
					<text class="tit">姓名</text>
					<input class="input" type="text" v-model="copyUserInfo.member_name" placeholder="请输入姓名" placeholder-class="placeholder" />
					
				</view>
				<view class="row b-b">
					<text class="tit">生日</text>
					<view class="uni-list" style="flex: 1;">
						<view class="uni-list-cell">
							<view class="uni-list-cell-db">
								<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
									<view v-if="date" class="uni-input">{{date}}</view>
                                    <view v-else class="uni-input placeholder">请选择生日日期</view>
								</picker>
							</view>
						</view>
					</view>
				</view>
				<view class="row b-b">
					<text class="tit">性别</text>
					 <view class="uni-list"  style="flex: 1;">
						<view class="uni-list-cell">
							<view class="uni-list-cell-db">
								<picker @change="bindPickerChange" :value="sexIndex" :range="sexArray">
									<view v-if="sexIndex != null" class="uni-input">{{sexArray[sexIndex]}}</view>
									<view v-else class="uni-input placeholder">请选择性别</view>
								</picker>
							</view>
						</view>
					</view>
				</view>
				<view class="row b-b">
					<text class="tit">职业</text>
					<input class="input" type="text" v-model="copyUserInfo.member_job" placeholder="请输入职业" placeholder-class="placeholder" />
				</view>
			</view>
			<view class="cate-section">
				<view class="cate-item">
					<button class="button" @click="confirm" type="primary">确定</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import API from '@/common/API.js';
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				sexArray: ['男', '女', '保密'],
				sexIndex: null,
				date: '',
                copyUserInfo: {}
			};
		},
		computed: {
			...mapState(['userInfo']),
			startDate(e) {
				return this.getDate('start')
			},
			endDate(e) {
				return this.getDate('end')
			}
		},
		onLoad() {
            console.log('store', this.$store.state)
			if (typeof this.userInfo === 'string') {
				this.copyUserInfo = JSON.parse(this.userInfo)
			} else {
                this.copyUserInfo = JSON.parse(JSON.stringify(this.userInfo))
            }
			console.log('copyUserInfo=====>', this.copyUserInfo.member_gender)
			this.date = this.copyUserInfo.member_birth
			this.sexIndex = this.copyUserInfo.member_gender
            let get_mobile_phone = uni.getStorageSync('CLOUDIN_WLF_MOBILE_PHONE')
            if (get_mobile_phone && !this.copyUserInfo.mobile_phone) {
                this.copyUserInfo.mobile_phone = get_mobile_phone
                this.confirm()
            }
		},
		methods: {
            ...mapMutations(['setUserInfo']),
			bindPickerChange(e) {
				console.log('3', e)
				this.sexIndex = e.detail.value
                this.copyUserInfo.member_gender = String(e.detail.value)
			},
			bindDateChange: function(e) {
				this.date = e.target.value
                this.copyUserInfo.member_birth = String(e.target.value)
			},
			getDate(type) {
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
			},
			confirm() {
				API._POST('/api/members/update', this.copyUserInfo, res => {
					console.log('res', res)
                    if (res.code == 0) {
                        this.setUserInfo(this.copyUserInfo)
						uni.setStorageSync('CLOUDIN_WLF_MOBILE_PHONE', this.copyUserInfo.mobile_phone)
                        this.$api.msg(res.msg)
                    }
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}

	.user-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		// height: 460upx;
		padding: 40upx 0 0;
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

		.portrait-box {
			width: 200upx;
			height: 200upx;
			border: 6upx solid #fff;
			border-radius: 50%;
			position: relative;
			z-index: 2;
			margin-bottom: 30upx;
		}

		.portrait {
			position: relative;
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}

		.yticon {
			position: absolute;
			line-height: 1;
			z-index: 5;
			font-size: 48upx;
			color: #fff;
			padding: 4upx 6upx;
			border-radius: 6upx;
			background: rgba(0, 0, 0, .4);
		}

		.pt-upload-btn {
			right: 0;
			bottom: 10upx;
		}

		.bg-upload-btn {
			right: 20upx;
			bottom: 16upx;
		}
	}
	
	.content {
		width: 100%;
		box-sizing: border-box;
		padding: 0 30upx;
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
			width: 140upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
	
		.input {
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.uni-input {
			font-size: 30upx;
		}
		.icon-shouhuodizhi {
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.cate-section {
		width: 100%;
		display: flex;
		margin-top: 40rpx;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		padding: 30upx 22upx;
		background: #fff;
	
		.cate-item {
			width: 50%;
			text-align: center;
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
	
			.button {
				width: 100%;
			}
		}
	}
</style>
