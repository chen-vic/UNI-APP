<template>
	<view>
		<scroll-view class="container" :style="scrollHeightClass" scroll-y="true" @scroll="scrollHandler">
			<!-- 小程序头部兼容 -->
			
			<uni-nav-bar fixed="false" color="#333" :background-color="barColor" :border="false" @clickLeft="clickLeftHandler"
			 @clickRight="clickRightHandler">
				<view slot="left">
					<image class="ic icon32" src="/static/me/ic_scan_w.svg" mode=""></image>
				</view>
				<view class="mp-search-box2" style="opacity: 1;background: #fff;border-radius: 10px;">
					<input @click="toSearch()" class="ser-input" type="text" placeholder="输入关键字搜索"
					 placeholder-class="input-placeholder" /></view>
				<view slot="right">
					<image class="ic icon32" src="/static/me/ic_message_w.svg" mode=""></image>
				</view>
			</uni-nav-bar>
			

			<view class="page_cont">
				<!-- ad2 -->
				<view class="ad-1">
					<image src="http://img.wanlef.com/home_ad.png" mode="scaleToFill"></image>
				</view>
				<!-- 头部轮播 -->
				<view class="carousel-section">
					<!-- 标题栏和状态栏占位符 -->
					<!-- <view class="titleNview-placing"></view>  @click="navToWebPage('http://www.wanlef.com/#/home')"-->
					<!-- 背景色区域 -->
					<view class="titleNview-background"></view>
					<swiper class="carousel" circular autoplay @change="swiperChange">
						<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item">
							<image :src="item.src" />
						</swiper-item>
					</swiper>
					<!-- 自定义swiper指示器 -->
					<view class="swiper-dots">
						<text class="num">{{ swiperCurrent + 1 }}</text>
						<text class="sign">/</text>
						<text class="num">{{ swiperLength }}</text>
					</view>
				</view>
				<!-- 分类 -->
				<view class="cate-section">
					<view class="cate-item" @click="toSwitchTab()">
						<image src="/static/home/ic_h_better.svg"></image>
						<text>福利优选</text>
					</view>
					<navigator url="/pages/service/service">
						<view class="cate-item">
							<image src="/static/home/ic_h_service.svg"></image>
							<text>成长微课</text>
						</view>
					</navigator>
					<view class="cate-item" @click="toEvents">
						<image src="/static/home/ic_h_activity.svg"></image>
						<text>团建活动</text>
					</view>

				</view>

				<!-- 分类 -->
				<view class="cate-section">
					<view class="cate-item" @tap="goPage('product/list?type=188&name=日用百货')">
						<image src="/static/home/ic_h1.svg"></image>
						<text>日用百货</text>
					</view>
					<view class="cate-item" @tap="goPage('product/list?type=205&name=美妆个护',)">
						<image src="/static/home/home_menu_03.png"></image>
						<text>美妆个护</text>
					</view>
					<view class="cate-item" @tap="goPage('product/list?type=217&name=母婴玩具',)">
						<image src="/static/home/home_menu_04.png"></image>
						<text>母婴玩具</text>
					</view>
					<view class="cate-item" @tap="toSwitchTab()">
						<image src="/static/home/ic_h5.svg"></image>
						<text>全部分类</text>
					</view>
				</view>

				<!-- 猜你喜欢 -->
				<view class="f-header m-t">
					<!-- <image src="/static/temp/h1.png"></image> -->
					<view class="tit-box">
						<text class="tit">最新上架</text>
						<!-- <text class="tit2">Guess You Like It</text> -->
					</view>
					<view class="tit_r" @click="navTo('/pages/product/list')">
						更多
						<text class="yticon icon-you"></text>
					</view>
				</view>

				<view class="guess-section">
					<view v-for="(item, index) in goodsList" :key="index" class="guess-item" @click="navToDetailPage(item)">
						<view class="image-wrapper">
							<image :src="item.image" mode="aspectFill"></image>
						</view>
						<text class="title clamp">{{ item.goods_name }}</text>
						<text class="price">￥{{ item.shop_price }}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<fu-modal v-if="showModal" @close="closeModal"></fu-modal>
	</view>
</template>

<script>
	import basicMixins from '@/common/basic-mixins.js';
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	import API from '@/common/API.js'
	import fuModal from '../widget/fu-modal.vue'

	export default {
		mixins: [basicMixins],
		components: {
			uniSearchBar,
			fuModal
		},
		data() {
			return {
				titleNViewBackground: '',
				swiperCurrent: 0,
				swiperLength: 0,
				carouselList: [],
				goodsList: [],
				barColor: 'transparent',
				deltaY: 0,
				event_num: 0,
				showModal: 0
			};
		},
		onLoad(option) {
			this.loadData();
			// #ifdef APP-PLUS
			// uni.setStorageSync('CLOUDIN_WLF_START_DATA', '');
			if(!uni.getStorageSync('CLOUDIN_WLF_START_DATA')) {
				uni.navigateTo({
					url: '/pages/public/login'
				});
			}
			// #endif
			if (option.showModal) {
				uni.hideTabBar()
				this.showModal = 1
			}
		},
		onShow() {
			let get_member_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID');
			console.log('get_member_id=' + get_member_id);
			if (get_member_id) {
				let get_company_id = uni.getStorageSync('CLOUDIN_WLF_COMPANY_ID');
				console.log('get_company_id=' + get_company_id);
				if (get_company_id) {
					this.countCompanyEvents(get_company_id);
				}

			}
		},
		methods: {
			toSearch(){
				uni.navigateTo({
					url: '/pages/product/search'
				})
			},
			toSwitchTab() {
				uni.switchTab({
					url: '/pages/category/catenew'
				})
			},

			//跳转到活动页面--
			toEvents() {
				uni.navigateTo({
					url: '/pages/activity/activity?num=' + this.event_num
				})
			},
			//获取详情
			countCompanyEvents(id) {
				API._GET(`/api/events/count/${id}`, {}, res => {
					console.log('res=' + JSON.stringify(res));
					if (res.code == 0) {
						console.log('count=' + JSON.stringify(res.data));
						this.event_num = res.data;
					}
				})
			},
			// 打开二维码
			clickLeftHandler() {
				const self = this;
				uni.scanCode({
					success(res) {
						if (res.scanType == 'WX_CODE' && res.errMsg == 'scanCode:ok') {
							console.log(res.rawData);
						} else {
							self.$api.msg('图片信息无法识别！');
						}
					},
					fail() {
						self.$api.msg('二维码识别失败！');
					}
				});
			},
			// 打开消息
			clickRightHandler() {
				uni.navigateTo({
					url: '/pages/notice/notice'
				});
			},
			// 滚动条颜色变化
			scrollHandler(e) {
				this.deltaY = e.detail.scrollTop;
				let num = e.detail.scrollTop - 30;
				// if (num <= 1) {
				// 	this.barColor = `rgba(240,87,70,0)`;
				// } else {
				// 	this.barColor = `rgba(240,87,70,${num*0.01})`;
				// }
			},
			/**
			 * 请求静态数据只是为了代码不那么乱
			 * 分次请求未作整合
			 */
			async loadData() {
				API._GET('GET.ads', {
					page: 1,
					limit: 5
				}, (res) => {
					if (res.code == 0) {
						this.carouselList = res.data.map(item => {
							item.src = API.config.imgUrl + item.ads_image;
							item.url = item.page_url;
							return item;
						});
						this.titleNViewBackground = this.carouselList[0].background;
						this.swiperLength = this.carouselList.length;
					}
				})
				API._GET('GET.goods', {
					page: 1,
					limit: 12
				}, (res) => {
					if (res.code == 0) {
						this.goodsList = (res.data || []).map((item) => {
							item.image = API.config.imgUrl + item.goods_img
							return item;
						});
					}
				})
			},
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
				this.titleNViewBackground = this.carouselList[index].background;
			},
			//详情页
			navToDetailPage(item) {
				let id = item.goods_id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				});
			},
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url) {
				// if (!this.hasLogin) {
				// 	url = '/pages/public/login';//拦截未登录路由
				// }
				uni.navigateTo({
					url
				});
			},
			/**
			 * 跳转到网页
			 */
			navToWebPage(url) {
				uni.navigateTo({
					url: '/pages/webview/webview?url=' + url
				});
			},
			search(){
				
			},
			closeModal() {
				uni.showTabBar()
				this.showModal = 0
			}
		},
		// #ifndef MP
		// 标题栏input搜索框点击
		onNavigationBarSearchInputClicked: async function(e) {
			this.$api.msg('点击了搜索框');
		},
		//点击导航栏 buttons 时触发
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.$api.msg('点击了扫描');
			} else if (index === 1) {
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url: '/pages/notice/notice'
				});
			}
		}
		// #endif
	};
</script>

<style lang="scss">
	.mp-search-box {
		position: absolute;
		left: 0;
		top: 30upx;
		z-index: 9999;
		width: 100%;
		padding: 0 80upx;

		.ser-input {
			flex: 1;
			height: 56upx;
			line-height: 56upx;
			text-align: center;
			font-size: 28upx;
			color: $font-color-base;
			border-radius: 20px;
			background: rgba(255, 255, 255, 0.6);
		}
	}


	.mp-search-box2 {
		// padding: 0 80upx;
		// 	position: absolute;
		// 	left: 0;
		// 	top: 30upx;
		// 	z-index: 9999;
		flex: 1;
		.ser-input {
			flex: 1;
			height: 56upx;
			line-height: 56upx;
			text-align: center;
			font-size: 28upx;
			color: $font-color-base;
			border-radius: 20px;
			background: rgba(255, 255, 255, 0.6);
		}
	}

	.page_cont {
		margin-top: -110rpx;
		overflow: hidden;
		padding-bottom: 30rpx;
	}

	page {
		.cate-section {

			position: relative;
			z-index: 5;
			border-radius: 16upx 16upx 0 0;
			margin-top: -20upx;
		}

		.carousel-section {
			padding: 16rpx;

			.titleNview-placing {
				padding-top: 0;
				height: 0;
			}

			.carousel {
				.carousel-item {
					padding: 0 5px;
					border-radius: 10px;
					overflow: hidden;
				}
			}

			.swiper-dots {
				left: 45upx;
				bottom: 40upx;
			}
		}
	}
	
	page {
		background: #f5f5f5;
	}

	.m-t {
		margin-top: 16upx;
	}

	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		padding-top: 10px;
		background-color: #fff;

		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 44px;
			box-sizing: content-box;
		}

		// .titleNview-background {
		// 	position: absolute;
		// 	top: 0;
		// 	left: 0;
		// 	width: 100%;
		// 	height: 426upx;
		// 	transition: .4s;
		// }
	}

	.carousel {
		width: 100%;
		height: 350upx;

		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0 28upx;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 10upx;
		}
	}

	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;

		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}

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
			border-radius: 50%;
			opacity: 0.7;
			// box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
		}
	}

	.ad-1 {
		width: 100%;
		height: 300upx;
		padding: 10upx 0;
		background: #fff;
		background-image: url('https://hbimg.huabanimg.com/35097e3af7736ef10e117931bb66d21495acea6c5af3-72DLfj_fw658');
		// padding-top: 88rpx;
		background-size: cover;
		background-repeat: no-repeat;

		image {
			width: 100%;
			height: 100%;
		}
	}

	/* 秒杀专区 */

	.f-header {
		display: flex;
		align-items: center;
		height: 140upx;
		padding: 6upx 30upx 8upx;
		background: #fff;

		image {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			margin-right: 20upx;
		}

		.tit-box {
			flex: 1;
			display: flex;
			flex-direction: column;
		}

		.tit {
			font-size: $font-lg + 2upx;
			color: $font-color-spec;
			line-height: 1.3;
		}

		.tit2 {
			font-size: $font-sm;
			color: $font-color-light;
		}

		.tit_r {
			font-size: $font-sm;
			color: $font-color-spec;
		}

		.icon-you {
			font-size: $font-lg + 2upx;
			color: $font-color-light;
		}
	}

	/* 团购楼层 */
	.group-section {
		background: #fff;

		.g-swiper {
			height: 650upx;
			padding-bottom: 30upx;
		}

		.g-swiper-item {
			width: 100%;
			padding: 0 30upx;
			display: flex;
		}

		image {
			width: 100%;
			height: 460upx;
			border-radius: 4px;
		}

		.g-item {
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}

		.left {
			flex: 1.2;
			margin-right: 24upx;

			.t-box {
				padding-top: 20upx;
			}
		}

		.right {
			flex: 0.8;
			flex-direction: column-reverse;

			.t-box {
				padding-bottom: 20upx;
			}
		}

		.t-box {
			height: 160upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			line-height: 1.6;
		}

		.price {
			color: $uni-color-primary;
		}

		.m-price {
			font-size: $font-sm + 2upx;
			text-decoration: line-through;
			color: $font-color-light;
			margin-left: 8upx;
		}

		.pro-box {
			display: flex;
			align-items: center;
			margin-top: 10upx;
			font-size: $font-sm;
			color: $font-base;
			padding-right: 10upx;
		}

		.progress-box {
			flex: 1;
			border-radius: 10px;
			overflow: hidden;
			margin-right: 8upx;
		}
	}

	/* 分类推荐楼层 */
	.hot-floor {
		width: 100%;
		overflow: hidden;
		margin-bottom: 20upx;

		.floor-img-box {
			width: 100%;
			height: 320upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background: linear-gradient(rgba(255, 255, 255, 0.06) 30%, #f8f8f8);
			}
		}

		.floor-img {
			width: 100%;
			height: 100%;
		}

		.floor-list {
			white-space: nowrap;
			padding: 20upx;
			padding-right: 50upx;
			border-radius: 6upx;
			margin-top: -140upx;
			margin-left: 30upx;
			background: #fff;
			box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
			position: relative;
			z-index: 1;
		}

		.scoll-wrapper {
			display: flex;
			align-items: flex-start;
		}

		.floor-item {
			width: 180upx;
			margin-right: 20upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			line-height: 1.8;

			image {
				width: 180upx;
				height: 180upx;
				border-radius: 6upx;
			}

			.price {
				color: $uni-color-primary;
			}
		}

		.more {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			flex-shrink: 0;
			width: 180upx;
			height: 180upx;
			border-radius: 6upx;
			background: #f3f3f3;
			font-size: $font-base;
			color: $font-color-light;

			text:first-child {
				margin-bottom: 4upx;
			}
		}
	}

	/* 猜你喜欢 */
	.guess-section {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;

		.guess-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;

			&:nth-child(2n + 1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
		}
	}

	.input-placeholder {
		color: #d2d2d2;
	}
	
	.icon_app {
		width: 40px;
		height: 40px;
	}
</style>
