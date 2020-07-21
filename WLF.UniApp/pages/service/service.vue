<template>
	<view class="container">
		<!--top_nav-->
		<!-- 小程序头部兼容 -->
		<!-- #ifdef MP -->
		<!-- <uni-nav-bar fixed="true" color="#fff" title="贴心服务" background-color='transparent' :border='false'>
			<view slot="left">

			</view>
			<view slot="default"></view>
			<view slot="right">
				<image class="ic icon32" src="/static/me/ic_search1.svg" mode=""></image>
				<image class="ic icon32" src="/static/me/ic_message.svg" mode=""></image>
			</view>
		</uni-nav-bar> -->

		<!-- #endif -->
		<view class="page_cont">
			<!-- ad -->
			<view class="titleNview-placing"></view>
			<!-- 分类 -->
			<view class="cate-section">
				<view class="cate-item" @click="toServiceList(2, '在线直播')">
					<image src="/static/me/ic_s1.svg"></image>
					<text class="">在线直播</text>
				</view>
				<view class="cate-item" @click="toServiceList(3, '技能')">
					<image src="/static/me/ic_s2.svg"></image>
					<text>技能</text>
				</view>
				<view class="cate-item" @click="toServiceList(4, '健康')">
					<image src="/static/me/ic_s3.svg"></image>
					<text>健康</text>
				</view>
				<view class="cate-item" @click="toServiceList(5, '运动')">
					<image src="/static/me/ic_s4.svg"></image>
					<text>运动</text>
				</view>
			</view>
			<view class="cate-section" style="display: none;">
				<view class="cate-item" @click="toServiceList(5, '文艺演出')">
					<image src="/static/me/ic_s5.svg"></image>
					<text>文艺演出</text>
				</view>
				<view class="cate-item" @click="toServiceList(6, '红色旅游')">
					<image src="/static/me/ic_s6.svg"></image>
					<text>红色旅游</text>
				</view>
				<view class="cate-item" @click="toServiceList(7, '特色服务')">
					<image src="/static/me/ic_s7.svg"></image>
					<text>特色服务</text>
				</view>
				<view class="cate-item" @click="toServiceList(8, '其他服务')">
					<image src="/static/me/ic_s8.svg"></image>
					<text>其他服务</text>
				</view>
			</view>
			<!--服务icons-->
			<view class="service_list_block">
				<!--列表-->
				<view class="flex justify-between filter_tabs" style="display: none;">
					<view class="filter_tab first_tab">筛选 <image src="/static/me/ic_down.svg" class="ic"></image>
					</view>
					<view class="filter_tab">综合排序</view>
					<view class="filter_tab">最新发布</view>
					<view class="filter_tab">最多参与</view>
				</view>

				<!-- 标题卡片模式 -->
				<view class="card_list">
					<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
						<view class="card_item flex flex-row" v-for="(item, index) in dataList" :key="index" @click="toDetails(item.service_id)">
							<view class="medie_images">
								<image :src="item.service_img?imgUrl+item.service_img:'/static/default_list.jpg'" mode="aspectFill"></image>
							</view>
							<view class="card_item_con">
								<view class="">
									<text class="mini_tag">{{item.type_name}}</text>
								</view>
								<view class="card_title">{{item.service_title}}</view>
								<view class="flex justify-between">
									<view class="card_info"><text>{{item.created_at}}</text></view>
								</view>
							</view>
						</view>
					</mescroll-body>

				</view>

			</view>

		</view>
	</view>
</template>

<script>
	import {
		apiServices
	} from "@/api/data.js"
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import API from "@/common/API.js"

	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				imgUrl: API.config.imgUrl,
				dataList: [],
				//首页图标数据
				serviceIconsList: [{
						icon: '/static/me/ic_s1.svg',
						title: '公益场馆'
					}, {
						icon: '/static/me/ic_s2.svg',
						title: '教育咨询'
					}, {
						icon: '/static/me/ic_s3.svg',
						title: '医疗咨询'
					},
					{
						icon: '/static/me/ic_s4.svg',
						title: '心理咨询'
					},
					{
						icon: '/static/me/ic_s5.svg',
						title: '文艺演出'
					}, {
						icon: '/static/me/ic_s6.svg',
						title: '红色旅游'
					}, {
						icon: '/static/me/ic_s7.svg',
						title: '特色服务'
					},
					{
						icon: '/static/me/ic_s8.svg',
						title: '其他服务'
					}
				],
			}
		},
		methods: {
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				//联网加载数据
				apiServices(page.num, page.size).then(curPageData => {
					this.mescroll.endSuccess(curPageData.length);
					if (page.num == 1) this.dataList = []; //如果是第一页需手动制空列表
					this.dataList = this.dataList.concat(curPageData); //追加新数据
				}).catch(() => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			},
			//end

			// 列表页面
			toServiceList(id, title) {
				uni.navigateTo({
					url: `/pages/service/list?id=${id}&title=${title}`
				})
			},

			//详情页面
			toDetails(id) {
				console.log('id=' + id);
				uni.navigateTo({
					url: `/pages/service/details?id=${id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	/* #ifdef MP */

	page {
		.page_cont {
			margin-top: -88rpx;
		}

		.cate-section {
			position: relative;
			z-index: 5;
			border-radius: 16upx 16upx 0 0;
			margin-top: -20upx;
		}

		.carousel-section {
			padding: 0;

			.titleNview-placing {
				padding-top: 0;
				height: 0;

			}

			.carousel {
				.carousel-item {
					padding: 0;
				}
			}

			.swiper-dots {
				left: 45upx;
				bottom: 40upx;
			}
		}
	}

	/* #endif */
	/* 分类 */
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		padding: 30upx 22upx;
		background: #fff;

		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
		}

		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 88upx;
			height: 88upx;
			margin-bottom: 14upx;
			//border-radius: 50%;
			//opacity: .7;
			// box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
		}
	}

	/*  */
	.service_list_block {
		background-color: #eee;
		padding: 16rpx;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
	}

	.filter_tabs {
		background-color: #fff;
		margin-bottom: 16rpx;
	}

	.filter_tab {
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 32rpx;
		flex-basis: 25%;
		position: relative;
	}

	.filter_tab::after {
		position: absolute;
		height: calc(100% - 0.2em);
		left: 0;
		content: '';
		width: 0;
		border-left: solid #eee 1rpx;
		position: absolute;
		right: 0;
	}

	.filter_tab.first_tab::after {
		display: none;
	}

	.filter_tab .ic {
		width: 32rpx;
		height: 32rpx;
	}

	.card_list {
		background-color: #fff;
		margin-bottom: 200rpx;
	}

	.card_item {
		padding: 16rpx;
		box-sizing: border-box;
	}

	.medie_images {
		width: 320rpx;
		height: 200rpx;
		margin-right: 32rpx;
		border-radius: 32rpx;
	}

	.medie_images image {
		width: 320rpx;
		height: 200rpx;
		overflow: hidden;
		border-radius: 10rpx;
	}

	.card_item_con {}

	.card_title {
		font-size: 32rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		height: 100rpx;
		line-height: 48rpx;
	}

	.card_info {
		font-size: 24rpx;
		color: #666;
	}

	.titleNview-placing {
		width: 100%;
		height: var(--status-bar-height);
		box-sizing: content-box;
		background: #fff;
		//background-image: url('https://hbimg.huabanimg.com/35097e3af7736ef10e117931bb66d21495acea6c5af3-72DLfj_fw658');
		padding-top: 40rpx;
		background-size: cover;
		background-repeat: no-repeat;

	}
</style>
