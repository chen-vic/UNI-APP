<template>
	<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
		<view class="pd-list">
			<view class="pd-li" v-for="item in goods" :key="item.goods_id" @click="navToDetailPage(item)">
				<image class="pd-img" :src="imgUrl+item.goods_img" mode="widthFix" />
				<view class="pd-name">{{item.goods_name}}</view>
				<text class="pd-price">{{item.shop_price}} 福豆</text>
				<text class="pd-sold">已售{{item.sale_num}}</text>
				<button class="pd-btn" @click.stop="canclesc(item.goods_id)">取消收藏</button>
			</view>
		</view>
	</mescroll-body>
</template>

<script>
	import {
		apiFavoriteGoods
	} from "@/api/data.js"
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import API from "@/common/API.js"
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'

	export default {
		mixins: [MescrollMixin],
		components: {
			uniSearchBar,
		},
		data() {
			return {
				downOption: {
					// use: false // 不使用下拉刷新
				},
				upOption: {
					// auto: false, //是否在初始化后,自动执行上拉回调callback; 默认true
					// page: {
					// 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					// 	size: 10 // 每页数据的数量
					// }
					noMoreSize: 3, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
				},
				imgUrl: API.config.imgUrl,
				goods: [], // 数据列表
				curWord: "" //当前搜索关键词
			}
		},
		watch: {
			//关键词变化的时候,重置列表数据--
			curWord() {
				// 重置列表数据 (tip:此处最好做节流,避免输入过快多次请求)
				this.mescroll.resetUpScroll();
			}
		},
		methods: {
			//取消收藏
			canclesc(goodsID) {
				uni.showModal({
					content: '确认取消收藏？',
					success: e => {
						if (e.confirm) {
							let member_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID');
							console.log('2')
							let params = {
								object_id: goodsID,
								favorite_type: 1,
								member_id: member_id,
							}
							console.log(params)
							API._POST('/api/Favorites', params, res => {
								console.log(res)
								if (res.code == 0) {
									uni.showToast({
										title: res.msg
									});
									let obj = {
										num:1,
										size:10,
									}
									this.upCallback(obj)
								}
							})
						}
					}
				});
				
			},
			//详情
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.goods_id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			search(res) {
				uni.showToast({
					title: '搜索：' + res.value,
					icon: 'none'
				})
			},
			input(res) {
				this.searchVal = res.value
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				// 先清空列表,显示加载进度
				if (page.num == 1) this.goods = []; //如果是第一页需手动制空列表
				console.log('keyword='+this.curWord.value);
				//联网加载数据
				apiFavoriteGoods(page.num, page.size, this.curWord.value).then(curPageData => {
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					this.mescroll.endSuccess(curPageData.length);
					//追加新数据
					this.goods = this.goods.concat(curPageData);
				}).catch(() => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			}
		}
	}
</script>

<style>
	.pd-btn{
		width: 160upx;
		height: 60upx;
		line-height: 60upx;
		position: absolute;
		right: 30upx;
		bottom: 30rpx;
		/* transform:translate(0,-50%); */
		border-radius:10upx;
		background: rgb(227,62,36);
		font-size: 20upx;
		color: #fff;
	}
	/*数据列表*/
	.pd-list {
		background-color: #fff;
	}

	.pd-li {
		position: relative;
		padding: 20upx 16upx 20upx 240upx;
		border-bottom: 1upx solid #eee;
		height: 200upx;
	}

	.pd-li .pd-img {
		position: absolute !important;
		/*编译到H5,在mescroll-more的案例中需加上!important,解决tab切换过快定位失效的问题*/
		left: 36upx;
		top: 20upx;
		width: 160upx;
		height: 160upx;
	}

	.pd-li .pd-name {
		font-size: 26upx;
		line-height: 40upx;
		height: 80upx;
		margin-bottom: 20upx;
		overflow: hidden;
	}
	.pd-name{
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		overflow:hidden;
		/*! autoprefixer: off */
		-webkit-box-orient: vertical;
	}
	.pd-li .pd-price {
		font-size: 26upx;
		color: red;
	}

	.pd-li .pd-sold {
		font-size: 24upx;
		margin-left: 16upx;
		color: gray;
	}

	/*关键词搜索*/
	.item {
		padding: 20upx;
	}

	.tip {
		font-size: 30upx;
		vertical-align: middle;
	}

	.hot-word {
		font-size: 24upx;
		margin-left: 30upx;
		padding: 6upx 40upx;
		border: 2upx solid #FF6990;
		border-radius: 100upx;
		vertical-align: middle;
		color: #FF6990;
	}

	.word-input {
		display: inline-block;
		width: 60%;
		padding: 4upx;
		font-size: 24upx;
		margin-left: 30upx;
		border: 2upx solid #18B4FE;
		border-radius: 60upx;
		text-align: center;
		background-color: #fff;
		vertical-align: middle;
	}
</style>
