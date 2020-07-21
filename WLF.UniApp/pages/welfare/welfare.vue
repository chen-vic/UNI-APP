<template>
	<view class="content">
		<!--banner-->
		<view class="wrapper"><image src="http://img.wanlef.com/mp/img_welfare.png" mode="widthFix"></image></view>
		<view class="goods-list">
			<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item)">
				<view class="image-wrapper"><image :src="imgUrl + item.goods_img" mode="aspectFill"></image></view>
				<text class="title clamp">{{ item.goods_name }}</text>
				<view class="price-box">
					<text class="price">{{ item.market_price }}</text>
					<text>已售 {{ item.sale_num }}</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import API from '@/common/API.js';
import basicMixins from '@/common/basic-mixins.js';
export default {
	mixins: [basicMixins],
	components: {
		uniLoadMore
	},
	data() {
		return {
			limit:0,
			imgUrl: API.config.imgUrl,
			cateMaskState: 0, //分类面板展开状态
			headerPosition: 'fixed',
			headerTop: '0px',
			loadingType: 'more', //加载更多状态
			filterIndex: 0,
			cateId: 0, //已选三级分类id
			priceOrder: 0, //1 价格从低到高 2价格从高到低
			cateList: [],
			goodsList: []
		};
	},

	onLoad(options) {
		// #ifdef H5
		this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight + 'px';
		// #endif
		this.cateId = options.tid;
		this.loadCateList(options.fid, options.sid);
		this.loadData();
	},
	onPageScroll(e) {
		//兼容iOS端下拉时顶部漂移
		if (e.scrollTop >= 0) {
			this.headerPosition = 'fixed';
		} else {
			this.headerPosition = 'absolute';
		}
	},
	//下拉刷新
	onPullDownRefresh() {
		this.loadData('refresh');
	},
	//加载更多
	onReachBottom() {
		this.loadData();
	},
	methods: {
		//加载分类
		async loadCateList(fid, sid) {
			let list = await this.$api.json('cateList');
			let cateList = list.filter(item => item.parent_id == fid);

			cateList.forEach(item => {
				let tempList = list.filter(val => val.parent_id == item.category_id);
				item.child = tempList;
			});
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
				this.loadingType = 'more';
			}

			let goodsList = await this.$api.json('goodsList');
			// 'https://api.wanlef.com/api/goods/favor?page=1&limit=10'
			console.log(this.page,'---',this.limit)
			this.limit = 10
			API._GET('GET.goods.favor', { page: this.page, limit: this.limit }, res => {
				console.log(res)
				if (res.code != 0) {
					this.$api.msg('请求失败！');
					return false;
				}
				let goodsList = res.data;
				this.page = this.page + 1;
				
				if (type === 'refresh') {
					this.page = 1;
					this.goodsList = [];
				}
				//筛选，测试数据直接前端筛选了
				this.goodsList = this.goodsList.concat(goodsList);

				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				this.loadingType = goodsList.length == 0 ? 'nomore' : 'more';
				if (type === 'refresh') {
					if (loading == 1) {
						uni.hideLoading();
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
			});
			this.loadData('refresh', 1);
			uni.showLoading({
				title: '正在加载'
			});
		},
		//显示分类面板
		toggleCateMask(type) {
			let timer = type === 'show' ? 10 : 300;
			let state = type === 'show' ? 1 : 0;
			this.cateMaskState = 2;
			setTimeout(() => {
				this.cateMaskState = state;
			}, timer);
		},
		//分类点击
		changeCate(item) {
			this.cateId = item.id;
			this.toggleCateMask();
			uni.pageScrollTo({
				duration: 300,
				scrollTop: 0
			});
			this.loadData('refresh', 1);
			uni.showLoading({
				title: '正在加载'
			});
		},
		//详情
		navToDetailPage(item) {
			//测试数据没有写id，用title代替
			console.log(item)
			let id = item.goods_id;
			uni.navigateTo({
				url: `/pages/product/product?id=${id}`
			});
		},
		stopPrevent() {}
	}
};
</script>

<style lang="scss">
page,
.content {
	background: #35476c;
}
/* top */
.wrapper {
	display: flex;
	justify-content: center;
	align-content: center;
	width: 100%;
	height: 360upx;
	overflow: hidden;
	image {
		width: 100%;
		height: 100%;
	}
}

/* 商品列表 */
.goods-list {
	display: flex;
	flex-wrap: wrap;
	padding: 0 30upx;
	background: #35476c;
	.goods-item {
		background-color: #fff;
		margin-bottom: 32rpx;
		display: flex;
		flex-direction: column;
		width: 48%;
		padding-bottom: 40upx;
		border-radius: 6px;
		&:nth-child(2n + 1) {
			margin-right: 4%;
		}
	}
	.image-wrapper {
		width: 100%;
		height: 330upx;
		border-radius: 6px;
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
		padding-left: 5rpx;
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
</style>
