<template>
	<view class="content">
		<!-- 空白页 -->
		<view v-if="empty" class="empty">
			<view class="empty-tips">
				暂无商品
			</view>
			<view class="navbar" :style="{position:headerPosition,top:headerTop}">
				<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
					综合排序
				</view>
				<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
					销量优先
				</view>
				<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
					<text>价格</text>
					<view class="p-box">
						<text :class="{active: priceOrder === 1 && filterIndex === 2}" class="yticon icon-shang"></text>
						<text :class="{active: priceOrder === 2 && filterIndex === 2}" class="yticon icon-shang xia"></text>
					</view>
				</view>
				<!-- <text class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')"></text> -->
			</view>
		</view>
		<view v-else>
			<view class="navbar" :style="{position:headerPosition,top:headerTop}">
				<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
					综合排序
				</view>
				<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
					销量优先
				</view>
				<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
					<text>价格</text>
					<view class="p-box">
						<text :class="{active: priceOrder === 1 && filterIndex === 2}" class="yticon icon-shang"></text>
						<text :class="{active: priceOrder === 2 && filterIndex === 2}" class="yticon icon-shang xia"></text>
					</view>
				</view>
				<!-- <text class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')"></text> -->
			</view>
			<view class="goods-list">
				<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item)">
					<view class="image-wrapper">
						<image :src="imgUrl+item.goods_img" mode="aspectFill"></image>
					</view>
					<text class="title clamp">{{item.goods_name}}</text>
					<view class="price-box">
						<text class="price">{{item.shop_price}}</text>
						<text>已售 {{item.sale_num}}</text>
					</view>
				</view>
			</view>
			<uni-load-more :status="loadingType"></uni-load-more>
			
			<view class="cate-mask" :class="cateMaskState===0 ? 'none' : cateMaskState===1 ? 'show' : ''" @click="toggleCateMask">
				<view class="cate-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
					<scroll-view scroll-y class="cate-list">
						<view v-for="item in cateList" :key="item.id">
							<view class="cate-item b-b two">{{item.name}}</view>
							<view v-for="tItem in item.child" :key="tItem.id" class="cate-item b-b" :class="{active: tItem.id==cateId}"
							 @click="changeCate(tItem)">
								{{tItem.name}}
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	import API from '@/common/API.js';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				empty:false,		//空白页
				imgUrl: API.config.imgUrl,
				cateMaskState: 0, //分类面板展开状态
				headerPosition: "fixed",
				headerTop: "0px",
				loadingType: 'more', //加载更多状态
				filterIndex: 0,
				cateId: 0, //已选三级分类id
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				cateList: [],
				goodsList: [],
				cate_id: -1,
			};
		},

		onLoad(options) {
			// #ifdef H5
			this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight + 'px';
			// #endif
			this.cateId = options.tid;
			console.log(options)
			//this.loadCateList(options.fid,options.sid);
			console.log('type='+options.type);
			this.cate_id = options.type;
			this.loadData();
			uni.setNavigationBarTitle({
				title: options.name
			})
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.loadData('refresh');
		},
		// //加载更多
		// onReachBottom() {
		// 	this.loadData();
		// },
		methods: {
			//加载分类
			async loadCateList(fid, sid) {
				let list = await this.$api.json('cateList');
				let cateList = list.filter(item => item.pid == fid);
				cateList.forEach(item => {
					let tempList = list.filter(val => val.pid == item.category_id);
					item.child = tempList;
				})
				this.cateList = cateList;
			},
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type = 'add', loading) {
				//没有更多直接返回
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
				} else {
					this.loadingType = 'more'
				}
				if (type === 'refresh') {
					this.goodsList = [];
				}
				this.goodsList = [];
				API._GET('GET.goods.favor', {
					page: 1,
					limit: 100,
					category_id: this.cate_id || -1
				}, res => {
					console.log('res=' + JSON.stringify(res));
					let goodsList = res.data;
					
					//筛选，测试数据直接前端筛选了
					if (this.filterIndex === 1) {
						goodsList.sort((a, b) => b.sale_num - a.sale_num)
					}
					if (this.filterIndex === 2) {
						goodsList.sort((a, b) => {
							if (this.priceOrder == 1) {
								return a.shop_price - b.shop_price;
							}
							return b.shop_price - a.shop_price;
						})
					}

					this.goodsList = this.goodsList.concat(goodsList);

					//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了--)
					this.loadingType = this.goodsList.length > 30 ? 'nomore' : 'more';
					if (type === 'refresh') {
						if (loading == 1) {
							uni.hideLoading()
						} else {
							uni.stopPullDownRefresh();
						}
					}

				});



			},
			//筛选点击
			tabClick(index) {
				if (this.filterIndex === index && index !== 2) {
					return;
				}
				this.filterIndex = index;
				if (index === 2) {
					this.priceOrder = this.priceOrder === 1 ? 2 : 1;
				} else {
					this.priceOrder = 0;
				}
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
			},
			//显示分类面板
			toggleCateMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.cateMaskState = 2;
				setTimeout(() => {
					this.cateMaskState = state;
				}, timer)
			},
			//分类点击
			changeCate(item) {
				this.cateId = item.id;
				this.toggleCateMask();
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
			},
			//详情
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.goods_id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			stopPrevent() {}
		},
	
		watch: {
			//显示空白页
			goodsList(e) {
				console.log(e)
				if (e) {
					let empty = e.length === 0 ? true : false;
					if (this.empty !== empty) {
						this.empty = empty;
					}
				}
			}
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
	}

	.content {
		padding-top: 96upx;
	}

	.navbar {
		position: fixed;
		left: 0;
		top: var(--window-top);
		display: flex;
		width: 100%;
		height: 80upx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid $base-color;
				}
			}
		}

		.p-box {
			display: flex;
			flex-direction: column;

			.yticon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;

				&.active {
					color: $base-color;
				}
			}

			.xia {
				transform: scaleY(-1);
			}
		}

		.cate-item {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
	}

	/* 分类 */
	.cate-mask {
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 95;
		transition: .3s;

		.cate-content {
			width: 630upx;
			height: 100%;
			background: #fff;
			float: right;
			transform: translateX(100%);
			transition: .3s;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.cate-content {
				transform: translateX(0);
			}
		}
	}

	.cate-list {
		display: flex;
		flex-direction: column;
		height: 100%;

		.cate-item {
			display: flex;
			align-items: center;
			height: 90upx;
			padding-left: 30upx;
			font-size: 28upx;
			color: #555;
			position: relative;
		}

		.two {
			height: 64upx;
			color: #303133;
			font-size: 30upx;
			background: #f8f8f8;
		}

		.active {
			color: $base-color;
		}
	}

	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;
		background-color: #F7F7F7;
		border-radius: 16upx;

		.goods-item {
			background-color: #fff;
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;
			margin-bottom: 32rpx;
			border-radius: 16upx;

			&:nth-child(2n+1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 16upx 16upx 0px 0px;
			overflow: hidden;

			image {
				border-radius: 16upx 16upx 0px 0px;
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

		.price-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;

			&:before {
				content: '￥';
				font-size: 26upx;
			}
		}
	}
	.empty {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		padding-bottom: 100upx;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		background: #fff;
	
		image {
			width: 240upx;
			height: 160upx;
			margin-bottom: 30upx;
		}
	
		.empty-tips {
			display: flex;
			font-size: 16px;
			color: $font-color-disabled;
	
			.navigator {
				color: $uni-color-primary;
				margin-left: 16upx;
			}
		}
	}
</style>
