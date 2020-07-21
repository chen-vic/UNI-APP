<template>
	<view>
		<scroll-view style="height: 100vh;" scroll-y="true" @scrolltolower="lower">
		<!-- 热门评论 -->
<!-- 		<view class="evalution">
			<view class="eva-list">
				<view class="eva-item">
					<image :src="src" mode="aspectFill"></image>
					<view class="eva-right">
						<text>李子</text>

						<text class="content">就现在这个季节，我比较喜欢把买好的大闸蟹洗两个在吃饭的时候蒸，等个十五分钟美味就好了，就着酱料一点一点的品尝蟹的美味。</text>

						<view class="more-box">
							<image src="/static/me/ic_more_b.svg" class="icon24"></image>
						</view>
						<view class="flex justify-between eva_tool">
							<text>2周前</text>
							<view class="zan-box">
								<text class="yticon icon-pingjia"></text>
								<text>32</text>
								<text class="yticon icon-xiaoxi"></text>
								<text>12</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view> -->
		<!-- <view class="blank"></view> -->
		<view v-if="comments.length > 0" class="evalution">
			<view class="eva-list">
				<view class="eva-item" v-for="(item, index) in comments" :key="index">
					<image :src="item.member_avatar || '/static/missing-face.png'" mode="aspectFill"></image>
					<view class="eva-right">
						<text>{{item.member_name}}</text>
						<text class="content">{{item.comment_content}}</text>
						<view class="flex justify-between eva_tool">
							<text>{{item.created_at}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="no-data">
			<image src="@/static/mescroll-empty.png" mode="aspectFill"></image>
			<view class="empty">~ 暂无相关数据，敬请期待 ~</view>
		</view>
		<!-- 底部操作菜单 -->
	<!-- 	<view class="page-bottom">
			<view class="uni-form-item uni-column">
				<input class="uni-input" @input="onKeyInput" placeholder="评论一下" />
			</view>
			<button type="warn" size="mini" class=" action-btn no-border add-now-btn">发表</button>
		</view> -->
		</scroll-view>
	</view>
</template>

<script>
	import API from '@/common/API.js';
	
	export default {
		data() {
			return {
				loaded: false,
				shareList: [],
				src: "http://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/77c6a7efce1b9d1663174705fbdeb48f8d546486.jpg",
				comments: [],
				page: 1,
				goodsId: 0,
				deltaY: 0,
				stop_scroll: false,
			};
		},
		onPullDownRefresh() {
			console.log('refresh');
			this.page ++;
			this.getList();
		},
		onLoad(option) {
			this.goodsId = option.goods_id
			this.getList();
		},
		methods: {
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
			lower(e) {
				if(this.stop_scroll) {
					return false;
				}
				
				this.page += 1;
				console.log(e)
				this.getList()
			},
			getList() {
				API._GET('GET.comments', {goods_id: this.goodsId, page: this.page, limit: 10}, res => {
					if(res.code == 0) {
						console.log(res.data.length)
						if(res.data.length < 1) {
							this.stop_scroll = true;
							this.page = 1;
							return false;
						}
						
						this.comments = [...this.comments, ...res.data];
					} 
					console.log(res)	
				})
			}
		}
	}
</script>

<style lang="scss">
	.eva-item {
		display: flex;
		padding: 20upx 40upx;

		image {
			width: 60upx;
			height: 60upx;
			border-radius: 50px;
			flex-shrink: 0;
			margin-right: 24upx;
		}
	}

	.eva-right {
		display: flex;
		flex-direction: column;
		flex: 1;
		font-size: $font-sm + 2upx;
		color: $font-color-light;
		position: relative;

		.eva_tool {
			margin-top: 16rpx;
		}

		.more-box {
			position: absolute;
			bottom: 10upx;
			right: 10upx;
			top: 0;
			right: 0;

			image {
				margin-right: 0;
			}
		}

		.zan-box {
			display: flex;
			align-items: base-line;
			// position: absolute;
			// bottom: 10upx;
			// right: 10upx;

			.yticon {
				margin-left: 8upx;
			}
		}



		.content {
			font-size: $font-base;
			color: #333;
			padding-top: 20upx;
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		justify-content:space-between;
		width: 100%;
		height: 100upx;
		border-top: 1rpx solid #eee;
		background: rgba(255, 255, 255, 1);
		padding: 0 64rpx;
		box-sizing: border-box;

		/* box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx; */
		.uni-input{flex: 1;width: 100%;}
		.action-btn {
			margin: 0;
			width: 180upx;
			line-height: 76upx;
			border-radius: 400rpx;
		}

		.action-btn-group {
			display: flex;

			width: 100%;
			height: 76upx;
			line-height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			margin-left: 20upx;
			position: relative;
		}
	}
	.no-data {
		width: 100%;
		box-sizing: border-box;
		padding: 100rpx 50rpx;
		text-align: center;
		image {
			width: 280rpx;
			height: 280rpx;
		}
		.empty {
			margin-top: 20rpx;
			color: gray;
			font-size: 24rpx;
		}
	}
</style>
