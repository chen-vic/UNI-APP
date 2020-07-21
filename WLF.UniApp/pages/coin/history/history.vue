<template>
	<view class="list_content">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view v-for="(item, index) in dataList" :key="index" class="goods-item">
				<view class="eva-section">
					<view class="eva-box">
						<view class="right">
							<text class="name">{{item.type_name}}</text>
							<view class="bot">
								<text class="attr">{{item.created_at}}</text>
							</view>
						</view>
						<text class="price">{{item.coin_num}}福豆</text>
					</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import {
		apiConsume
	} from "@/api/data.js"
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";

	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				dataList: [],
			};
		},
		methods: {
			/*上拉加载的回调-: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				//联网加载数据
				apiConsume(page.num, page.size).then(curPageData => {
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					//mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;

					//方法一(推荐): 后台接口有返回列表的总页数 totalPage
					//this.mescroll.endByPage(curPageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)

					//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
					//this.mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)

					//方法三(推荐): 您有其他方式知道是否有下一页 hasNext
					//this.mescroll.endSuccess(curPageData.length, hasNext); //必传参数(当前页的数据个数, 是否有下一页true/false)

					//方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据
					this.mescroll.endSuccess(curPageData.length);

					//设置列表数据
					if (page.num == 1) this.dataList = []; //如果是第一页需手动制空列表
					this.dataList = this.dataList.concat(curPageData); //追加新数据
				}).catch(() => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			}
			//end
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F7F7F7;
	}

	.list_content:first-child {
		margin-top: 32rpx;
	}

	.list_content {
		padding: 0 32rpx 32rpx 32rpx;
	}

	/* 记录 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;
		border-radius: 16upx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.tit {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.icon-you {
				margin-left: 10upx;
			}
		}
	}

	.detail_title {
		font-size: $font-sm;
		height: 80upx;
		line-height: 80upx;
	}

	.eva-box {
		display: flex;
		padding: 20upx 0;
		border-bottom: 2upx solid #E5E5E5;

		.grade {
			width: 60upx;
			height: 80upx;
			line-height: 80upx;
			font-size: $font-lg;
			font-weight: 800;
		}

		.portrait {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;

			.name {
				font-size: $font-lg;
				font-weight: 500;
			}

			.con {
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}

			.bot {
				margin-top: 10upx;
				/* display: flex;
				justify-content: space-between; */
				font-size: $font-sm;
				color: $font-color-light;

				text {
					margin-right: 10upx;
				}

				.price {
					line-height: 100upx;
					color: $font-color-dark;
					font-size: $font-lg;
					font-weight: 500;
				}
			}
		}
	}

	.eva-box:last-child {
		border-bottom: none;
	}
</style>
