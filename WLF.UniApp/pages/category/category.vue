<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<!-- 一级标签 -->
			<view v-for="item in flist" :key="item.category_id" class="f-item b-b" :class="{ active: item.category_id === currentId }"
			 @click="tabtap(item)">
				{{ item.category_name }}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop">
			<!-- <template > -->
			<view v-for="item in slist" class="s-list" :id="'main-' + item.category_id" :key="item.category_id" v-if="currentId == item.parent_id || item.goods.length > 0">
				<!-- 二级标签 -->
				<text class="s-item">{{ item.category_name }}</text>
				<view class="t-list">
					<!-- @click="navToList(item.category_id, titem.category_id)" -->
					<view  class="t-item" v-for="(titem,index) in item.goods" :key="index+'3'">
						<image :src="imgUrl + titem.goods_img"></image>
						<text>{{ titem.goods_name }}</text>
					</view>
					<!-- <view @click="navToList(item.category_id, titem.category_id)" v-if="titem.parent_id === item.category_id" class="t-item"
					 v-for="titem in tlist" :key="titem.category_id">
						<image :src="imgUrl + titem.category_icon"></image>
						<text>{{ titem.category_name }}</text>
					</view> -->
				</view>
			</view>
			<view class="s-list" v-if="false">
					<!-- 商品内容 -->
					<view class="t-list">
						<view @click="navToList(titem.goods_id)" class="t-item"
						 v-for="titem in tlist" :key="titem.goods_id">
							<image :src="imgUrl + titem.goods_img"></image>
							<view class="text-title">
								<text class="goods_name">{{ titem.goods_name }}</text>
							</view>
						</view>
					</view>
				</view>
			<!-- </template> -->
		</scroll-view>
	</view>
</template>

<script>
	import API from '@/common/API.js';

	export default {
		data() {
			return {
				imgUrl: API.config.imgUrl,
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: 1,
				flist: [],
				slist: [],
				tlist: []
			};
		},
		onLoad() {
			this.loadData();
		},
		methods: {
			async loadData() {
				const self = this;
				// let list = await this.$api.json('cateList');
				API._GET('GET.goodsCategory', {
					page: 1,
					limit: 1000
				}, res => {
					console.log(res)
					let list = res.data;

					if (res.code != 0) {
						self.$api.msg('获取数据失败！');
						return false;
					}
					// let flist = []
					// list.forEach(item => {
					// 	flist.push(item)
					// })
					// this.flist = flist
					// this.tlist = list[0].goods
					
					let parent_ids = [];

					list.forEach(item => {
						if (item.parent_id == -1 || item.parent_id == undefined) {
							parent_ids.push(item.category_id);
							this.flist.push(item); //parent_id为父级id, 没有parent_id或者parent_id=0是一级分类
						}
					});
					list.forEach(item => {
						if (parent_ids.indexOf(item.parent_id) > -1) {
							this.slist.push(item); //没有图的是2级分类
						} else if (item.parent_id != -1 && item.parent_id != undefined) {
							// this.tlist.push(item); //3级分类
						}
						if (item.goods.length > 0) {
							this.tlist = this.tlist.concat(item.goods)
						}
					});
					console.log(this.slist)
					// console.log(this.tlist)
				});
			},
			//一级分类点击
			tabtap(item) {
				console.log(item,'点击左侧栏',this.slist)
				
				if (!this.sizeCalcState) {
					this.calcSize();
				}
				this.currentId = item.category_id;
				this.tlist = item.goods;
				let index = this.slist.findIndex(sitem => sitem.parent_id === item.category_id);
				console.log(this.slist,'---',index)
				//这个index有问题,导致top出问题
				// this.tabScrollTop = this.slist[index].top;
			},
			//右侧栏滚动
			asideScroll(e) {
				if (!this.sizeCalcState) {
					this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				let tabs = this.slist.filter(item => item.top <= scrollTop).reverse();
				if (tabs.length > 0) {
					this.currentId = tabs[0].parent_id;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize() {
				let h = 0;
				console.log(this.slist)
				this.slist.forEach(item => {
					let view = uni.createSelectorQuery().select('#main-' + item.category_id);
					view.fields({
							size: true
						},
						data => {
							if (data && data.height) {
								item.top = h;
								h += data.height;
								item.bottom = h;
							}
						}
					).exec();
				});
				this.sizeCalcState = true;
			},
			// navToList(sid, tid) {
				navToList(goods_id) {
				uni.navigateTo({
					// url: `/pages/product/list?fid=${this.currentId}&sid=${sid}&tid=${tid}`
					url: `/pages/product/product?id=${goods_id}`
					
				});
			}
		}
	};
</script>

<style lang="scss">
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.content {
		display: flex;
	}

	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		background-color: #fff;
	}

	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;

		&.active {
			color: $base-color;
			background: #f8f8f8;

			&:before {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: $base-color;
				border-radius: 0 4px 4px 0;
				opacity: 0.8;
			}
		}
	}

	.right-aside {
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
	}

	.s-item {
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: $font-color-dark;
	}

	.t-list {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;

		&:after {
			content: '';
			flex: 99;
			height: 0;
		}
	}

	.t-item {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 50%;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;

		image {
			width: 140upx;
			height: 140upx;
		}
	}
	.text-title{
		width: 100%;
		overflow: hidden;
		padding: 10rpx;
	}
	.goods_name{
		display: block;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
</style>
