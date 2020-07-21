<template>
	<view>
		<!--头部图-->
		<view class="ad_invite">
			<view class="num_pos">{{coin_num}}</view>
			<button type="warn" class="btn_pos" @click="navTo('/pages/coin/activation/activation')">激活福豆</button>

			<view class="image-wrapper">
				<image src="http://img.wanlef.com/mp/bg_coin@2x.jpg" class="loaded" mode="aspectFill"></image>
			</view>
		</view>
		<!--标题-->
		<view class="cate-section">
			<view class="cate-item">
				<text>累计获得</text>
				<text class="tit">{{total_num}}</text>
			</view>
			<view class="cate-item">
				<text>累计使用</text>
				<text class="tit">{{used_num}}</text>
			</view>
			<view class="cate-item">
				<text>累计节省</text>
				<text class="tit">{{save_num}}</text>
			</view>
		</view>
		<!--名次列表-->
		<view class="list_content">
			<!-- 等级表 -->
			<view class="detail_title flex justify-between">
				<view class="">近30天记录</view>
				<view @click="navTo('/pages/coin/history/history')">更多 <text class="yticon icon-you"></text></view>
			</view>
			<view class="eva-section">
				<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
					<view v-for="(item, index) in dataList" :key="index" class="goods-item">
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
				</mescroll-body>
			</view>
		</view>
	</view>
</template>

<script>
	import API from '@/common/API.js'
	import {
		apiConsume
	} from "@/api/data.js"
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";

	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				total_num: 0,
				coin_num: 0,
				save_num: 0,
				used_num: 0,

				dataList: []
			}
		},
		onLoad() {
			// #ifdef H5
			this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight + 'px';
			// #endif

		},
		onShow() {
			this.getMemberCoin();
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = 'fixed';
			} else {
				this.headerPosition = 'absolute';
			}
		},
		methods: {

			navTo(url) {
				uni.navigateTo({
					url: url
				})
			},
			//获取会员福豆数量
			async getMemberCoin() {
				let get_member_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID');
				await API._GET('/api/membercoin/' + get_member_id, null, res => {
					if (res.code == 0) {
						console.log('res=' + JSON.stringify(res));
						this.total_num = res.data.total_num;
						this.coin_num = res.data.coin_num;
						this.save_num = res.data.save_num;
						this.used_num = res.data.used_num;
					}
				});
			},

			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
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
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: #efefef;
	}

	.ad_invite {
		height: 722upx;
		position: relative;
		margin-top: -88upx;

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.num_pos {
			position: absolute;
			margin: auto;
			left: 0;
			right: 0;
			bottom: 100upx;
			width: 80%;
			z-index: 999;
			font-weight: 700;
			font-size: 60upx;
			color: rgba(208, 112, 29, 1);
			text-align: center;
		}

		.btn_pos {
			position: absolute;
			margin: auto;
			left: 0;
			right: 0;
			bottom: -30upx;
			border-radius: 100rpx;
			z-index: 999;
			width: 50%;
		}
	}

	.list_content {
		padding: 32rpx;
	}

	/*标题*/
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		padding: 60upx 22upx 30upx 22upx;
		background: #fff;

		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;

			.tit {
				font-size: $font-lg+5upx;
				font-weight: 700;
				margin-top: 16upx;
			}
		}
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
		height: 100upx;
		line-height: 100upx;
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
