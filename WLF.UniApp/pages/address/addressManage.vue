<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input class="input" type="text" v-model="addressData.member_name" placeholder="收货人姓名" maxlength="10"
			 placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addressData.mobile_phone" placeholder="收货人手机号" maxlength="11"
			 placeholder-class="placeholder" />
		</view>
		<view class="row b-b" style="border-color:#454758;" @tap="openAddres">
			<text class="tit">省市区</text>
				<input class="input" type="text" v-model="pickerText" placeholder-class="placeholder" placeholder="选择省市区" />
				<!-- <text class="yticon icon-shouhuodizhi"></text> -->
		</view>
		<view class="row b-b">
			<text class="tit">详细地址</text>
			<input class="input" type="text" v-model="addressData.address_detail" placeholder="详细地址" maxlength="30"
			 placeholder-class="placeholder" />
		</view>
		<!-- <view class="row b-b">
			<text class="tit">地址</text>
			<input class="input" type="text" v-model="addressData.address_detail" placeholder="楼号、门牌" maxlength="30"
			 placeholder-class="placeholder" />
			<text class="yticon icon-shouhuodizhi" @click="chooseLocation"></text>
		</view>
		 -->

		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="addressData.is_default == 0" color="#fa436a" @change="switchChange" />
		</view>
		<view class="cate-section">
			<view class="cate-item">
				<button class="button" @click="confirm" type="primary">确定</button>
			</view>
			<view class="cate-item" v-if="newEdit">
				<button class="button" @click="delAddress" type="warn">删除</button>
			</view>
		</view>
		<simple-address ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor="#007AFF"></simple-address>
	</view>
</template>

<script>
	import simpleAddress from '@/components/simple-address/simple-address.nvue';
	import API from '@/common/API.js';
	export default {
		data() {
			return {
				newEdit:true,			//判断新增还是编辑
				pickerText: '',
				cityPickerValueDefault: [0, 0, 1],
				type: 'add',			
				addressData: {
					member_id: -1,
					member_name: '',
					mobile_phone: '',
					address_detail: '',			//详细信息
					is_default: 1,     //0位设置默认 ,  1位不设置默认
					province_id: 0,
					city_id: 0,
					district_id: 0,
					// province_name: '',
					// city_name: '',
					// district_name: '',
				},
			};
		},
		components:{
			simpleAddress
		},
		onLoad(option) {
			console.log(option)
			let title = '新增收货地址';
			if (option.type === 'edit') {
				title = '编辑收货地址';
				this.type = option.type;
				this.addressData = JSON.parse(option.data);
				this.pickerText = this.addressData.province_name +'-' + this.addressData.city_name +'-' + this.addressData.district_name;
				console.log(this.addressData)
			} else {
				this.newEdit = false
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			});
		},
		methods: {
			// 地址选中
			onConfirm(e) {
				console.log(e)
				this.pickerText = e.label;
				let lable = e.label.split('-');
			
				this.addressData.province_id = e.provinceCode + '0000';
				this.addressData.district_id = e.areaCode;
				this.addressData.city_id = e.cityCode + '00';
				// this.addressData.province_name = lable[0];
				// this.addressData.district_name = lable[1];
				// this.addressData.city_name = lable[2];
			},
			// 打开地址选择picker
			openAddres() {
				this.$refs.simpleAddress.open();
			},
			switchChange(e) {
				console.log('select=' + JSON.stringify(e.detail.value));
				this.addressData.is_default = e.detail.value == true ? 0 : 1;
			},

			//地图选择地址-
			chooseLocation() {
				uni.chooseLocation({
					success: data => {
						// this.addressData.address_detail = data.name;
						// this.addressData.address_detail = data.name;
					}
				});
			},

			//提交
			confirm() {
				let data = this.addressData;
				if (!data.member_name) {
					this.$api.msg('请填写收货人姓名');
					return;
				}
				if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.mobile_phone)) {
					this.$api.msg('请输入正确的手机号码');
					return;
				}
				if (this.pickerText == "") {
					this.$api.msg('请选择省市区');
					return;
				}
				if (!data.address_detail) {
					this.$api.msg('请填写详细地址');
					return;
				}
				// this.addressData.province_id = 0;
				// this.addressData.city_id = 0;
				// this.addressData.district_id = 0;
				// this.addressData.zip_code = '';
				this.addressData.member_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID');
				this.addressData.province_id = Number(this.addressData.province_id);
				this.addressData.district_id = Number(this.addressData.district_id);
				this.addressData.city_id = Number(this.addressData.city_id);
				console.log(this.addressData);

				if (this.type == 'add') {
					API._POST('GET.addressadd', this.addressData, res => {
						if (res.code === 0) {
							this.$api.msg('创建成功！');
							setTimeout(() => {
								this.$api.prePage().refreshList(1);
								uni.navigateBack();
							}, 1000);
						} else {
							this.$api.msg(res.message || '创建失败！');
						}
					});
				} else {
					API._POST('GET.addressupdate', this.addressData, res => {
						if (res.code === 0) {
							this.$api.msg('修改成功！');
							setTimeout(() => {
								this.$api.prePage().refreshList(1);
								uni.navigateBack();
							}, 1000);
						} else {
							this.$api.msg(res.message || '修改失败！');
						}
					});
				}
			},
			//end

			delAddress() {
				API._POST_ID('POST.addressdel', this.addressData.address_id, {}, res => {
					if (res.code === 0) {
						this.$api.msg(res.msg);
						setTimeout(() => {
							this.$api.prePage().refreshList(1);
							uni.navigateBack();
						}, 1000);
					} else {
						this.$api.msg(res.msg || '删除失败！');
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

			.button {
				width: 100%;
			}
		}
	}
</style>
