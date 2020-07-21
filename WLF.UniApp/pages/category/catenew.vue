<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view v-for="item in flist" :key="item.id" class="f-item b-b" :class="{active: item.id === currentId}" @click="tabtap(item)">
				{{item.name}}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop">
			<view v-for="sitem in slist" :key="sitem.id" class="s-list" :id="'main-'+sitem.id">
				<text class="s-item">{{sitem.name}}</text>
				<view class="t-list">
					<view v-for="titem in tlist" :key="titem.id">
						<view v-if="titem.pid == sitem.id" @click="navToList(titem)" class="t-item">
							<image :src="imgUrl+titem.picture"></image>
							<text>{{titem.name}}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import API from "@/common/API.js"
	
	export default {
		data() {
			return {
				imgUrl: API.config.imgUrl,
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: 1,
				flist: [],
				slist: [],
				tlist: [],
			}
		},
		onLoad() {
			this.loadData();
		},
		methods: {
			loadData() {
				uni.showLoading({
					title: '加载中..'
				})
				return API._GET('GET.goodsCategoryNew', {
					page: 1,
					limit: 1000,
				}, res => {
					let list = res.data;
					// console.log('list',list)
					list.forEach(item => {
						if (item.level==1) {
							this.flist.push(item); //pid为父级id, 没有pid或者pid=0是一级分类
						} 
					})
					
					// list.forEach(item => {
					// 	let info = this.flist.find((sov) => sov.id == item.pid)
					// 	if (info && item.level==2) {
					// 		this.slist.push(item); //没有图的是2级分类
					// 	}
					// })
                    
                    // 解决顺序问题
                    for (let i = 0; i < this.flist.length; i++) {
                        for (let j = 0; j < list.length; j++) {
                            let fitem = this.flist[i]
                            let item = list[j]
                            if (fitem.id == item.pid && item.level == 2) {
                                this.slist.push(item)
                            }
                        }
                    }
					
					list.forEach(item => {
						let info = this.slist.find((sov) => sov.id == item.pid)
						if (info && item.level==3) {
							this.tlist.push(item); //3级分类
						}
					})
					
					//页面进入默认选中第一个分类
					this.currentId = this.flist[0].id
					setTimeout(() => {
						uni.hideLoading();
						this.calcSize();	
					}, 1000)
				});
			},
			//一级分类点击
			tabtap(item) {
				console.log('点击一级菜单')
				if (!this.sizeCalcState) {
					this.calcSize();
				}

				this.currentId = item.id;
				// console.log(this.slist, 'this.slist')
				// console.log(item.id)
				let index = this.slist.findIndex(sitem => sitem.pid === item.id);
				// console.log(index)
				// console.log(this.slist[index].top, this.slist[index], 'this.slist[index].top')
				this.tabScrollTop = this.slist[index].top + 4;
			},
			//右侧栏滚动
			asideScroll(e) {
				// console.log(e)
				if (!this.sizeCalcState) {
					this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				let tabs = this.slist.filter(item => item.top <= scrollTop).reverse();
				if (tabs.length > 0) {
					this.currentId = tabs[0].pid;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize() {
				let h = 0;
				this.slist.forEach(item => {
					let view = uni.createSelectorQuery().in(this).select("#main-" + item.id);
					view.fields({
						size: true
					}, data => {
						item.top = h;
						h += data.height;
						item.bottom = h;
					}).exec();
				})
				this.sizeCalcState = true;
			},
			navToList(item) {
				uni.navigateTo({
					url: `/pages/product/list?fid=${this.currentId}&sid=${item.pid}&type=${item.id}`
				})
			}
		}
	}
</script>

<style lang='scss'>
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
				opacity: .8;
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
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;

		image {
			width: 140upx;
			height: 140upx;
		}
	}
</style>
