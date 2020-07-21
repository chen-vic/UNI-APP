<template>
	<view class="container b-t">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="list b-b" v-for="(item, index) in dataList" :key="index" @click="checkAddress(item)">
				<view class="wrapper">
					<view class="address-box">
						<text v-if="item.is_default == 0" class="tag">默认</text>
						<text class="address"> {{ item.province_name }} {{item.city_name}} {{item.district_name}} {{ item.address_detail }}</text>
					</view>
					<view class="u-box">
						<text class="name">{{ item.member_name }}</text>
						<text class="mobile">{{ item.mobile_phone }}</text>
					</view>
				</view>
				<text class="yticon icon-bianji" @click.stop="addAddress('edit', item)"></text>
			</view>
		</mescroll-body>

		<button class="add-btn" @click="addAddress('add')">新增地址</button>
	</view>
</template>

<script>
	import {
		apiAddress
	} from "@/api/data.js"
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";

	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				source: '',
				dataList: [],
			};
		},
		onLoad(option) {
			this.source = option.source;
		},
		methods: {

			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				//联网加载数据
				apiAddress(page.num, page.size).then(curPageData => {
					this.mescroll.endSuccess(curPageData.length);
					if (page.num == 1) this.dataList = []; //如果是第一页需手动制空列表
					this.dataList = this.dataList.concat(curPageData); //追加新数据
				}).catch(() => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			},
			//end
			
			refreshList(){
				// 重置列表数据 (tip:此处最好做节流,避免输入过快多次请求)
				this.mescroll.resetUpScroll();
			},
			
			//选择地址
			checkAddress(item) {
				if (this.source == 1) {
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().addressData = item;
					uni.navigateBack();
				}
			},
			addAddress(type, item) {
				uni.navigateTo({
					url: `/pages/address/addressManage?type=${type}&data=${JSON.stringify(item)}`
				});
			},
		}
	};
</script>

<style lang="scss">
	page {
		padding-bottom: 120upx;
	}

	.content {
		position: relative;
	}

	.list {
		display: flex;
		align-items: center;
		padding: 20upx 30upx;
		background: #fff;
		position: relative;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.address-box {
		display: flex;
		align-items: center;

		.tag {
			width: 100rpx;
			font-size: 24rpx;
			color: $base-color;
			margin-right: 20upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 5rpx;
			padding: 5rpx;
			line-height: 1;
			text-align: center;
		}

		.address {
			font-size: 30upx;
			color: $font-color-dark;
		}
	}

	.u-box {
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;

		.name {
			margin-right: 30upx;
		}
	}

	.icon-bianji {
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}

	.add-btn {
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
