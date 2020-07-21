<template>
	<view>
		<!--banner-->
		<view class="wrapper">
			<image src="/static/me/img_invite.png" mode="aspectFill"></image>
		</view>

		<!--标题-->
		<view class="info">
			<view class="title">
				<text>宋庆龄故居</text>
				<view class="flex justify-between title_bottom">
					<view class="tags">
						<uni-tag size="small" type="error" text="公益活动" color="#fff" inverted="true" style="display: inline-block;margin-right: 16upx;color: #fff;"></uni-tag>
					</view>
					<view class="actions">
						<text class="yticon icon-fenxiang2" @click="share"></text><text class="ic_font">分享</text><text class="yticon icon-shoucang_xuanzhongzhuangtai"
						 :class="{active: data.favorite}" @click="favorite"></text>
						<text class="ic_font">收藏</text>
					</view>
				</view>
			</view>
			<!--工具栏-->
			<view class="info_bottom">
				<image src="/static/me/ic_time@2x.png" class="icon24"></image>2019-12-23 周三 线下活动
			</view>
		</view>

		<!--地址-->
		<view class="blank"></view>
		<view class="article-meta">
			<view class="article-meta-text article-title">场馆详情</view>
		</view>
		<view class="article-content">
			<view>
				上海宋庆龄故居纪念馆占地面积4844平方米，馆藏文物1.3万余件。基本陈列以故居主楼为代表，辅助陈列为宋庆龄文物馆，以宋庆龄生平和寓所生活为主线，展陈孙中山、宋庆龄的手稿、信函、照片、生活用品等文物。
				<image src="http://p9.pstatp.com/origin/pgc-image/f1ba2e230ef143d28ab3fca551f64718" mode="aspectFit"></image>
			</view>

		</view>
		<!-- 报名 -->
		<view class="but_block"> <button type="warn" plain="true">报名参加</button></view>
		<view class="blank"></view>
		<view class="service_list_block product_list_row">
			<!--列表-->
			<view class=" list_title">相关单品</view>
			<!-- 标题卡片模式 -->
			<view class="card_list">
				<view class="card_item flex flex-row" v-for="(item,index) in serviceList" :key="index">
					<view class="medie_images">
						<navigator url="/pages/activity/detail/detail">
							<image :src="item.image" mode="aspectFill"></image>
						</navigator>
					</view>
					<view class="card_item_con">

						<view class="flex justify-between">
							<navigator url="/pages/activity/detail/detail">
								<view class="card_title">{{item.title}}</view>
								<view class="card_info">薄如蝉翼，丝滑如肌肤</view>
							</navigator>
							<view class="flex flex-1">
								<image src="/static/me/ic_buy@2x.png" class="icon32" mode=""></image>
							</view>
						</view>
						<view class="list_price">
							¥80

						</view>

					</view>
				</view>
			</view>

			<!-- 分享-->
			<view class="but_block"> <button type="warn">分享有惊喜</button>
				<view class="font-sm text-center mt-1 text-light-muted">
					<view>每个专题每天首次分享即可参加抽奖</view>
					<view>最高100元优惠券</view>
					<view>(分享后，返回万乐福才能抽奖哦)</view>
				</view>
			</view>
			<view class="cate-section">
				<view class="cate-item">
					<image src="/static/me/ic_collect2@2x.png"></image>
					<text>323</text>
				</view>
				<view class="cate-item">
					<image src="/static/me/ic_see@2x.png"></image>
					<text>33</text>
				</view>
				<view class="cate-item">
					<image src="/static/me/ic_share2@2x.png"></image>
					<text>453</text>
				</view>
				<view class="cate-item">
					<image src="/static/me/ic_comment@2x.png"></image>
					<text>2323</text>
				</view>
			</view>
		</view>

		<!-- 热门评论 -->
		<view class="evalution">
			<view class="section-tit flex justify-between">
				<view>精选评论(3)</view>
				<view style="margin-right: 32rpx;" class="text-danger font-sm" @click="navTo('/pages/comment/edit/edit')">写评论</view>
			</view>
			<view class="eva-list" :class="{Skeleton:!loaded}">
				<view v-for="(item, index) in data.evaList" :key="index" class="eva-item">
					<image :src="item.src" mode="aspectFill"></image>
					<view class="eva-right">
						<text>{{item.nickname}}</text>

						<text class="content">{{item.content}}</text>
						<text>{{item.time}}</text>
						<view class="more-box">
							<image src="/static/me/ic_more_b.svg" class="icon24"></image>
						</view>
						<view class="zan-box">
							<text class="yticon icon-pingjia"></text>
							<text>{{item.zan}}</text>
							<navigator url="/pages/detail/comment/comment"><text class="yticon icon-xiaoxi"></text>
								<text>{{item.zan}}</text></navigator>
						</view>
					</view>
				</view>
			</view>
		<view class="but_block"> <button type="warn" plain="true">全部评论</button></view>
		</view>
		<!--活动推荐-->
		<view class="service_list_block">
			<!--列表-->
			<view class="list_title">活动推荐</view>
			<!-- 标题卡片模式 -->
			<view class="card_list">
				<view class="card_item flex flex-row" v-for="(item,index) in serviceList" :key="index">
					<view class="medie_images">
						<navigator url="/pages/activity/detail/detail">
							<image :src="item.image" mode="aspectFill"></image>
						</navigator>
					</view>
					<view class="card_item_con">
						<navigator url="/pages/activity/detail/detail">
							<view class="">
								<text class="mini_tag">优选</text>
							</view>
							<view class="card_title">{{item.title}}</view>
							<view class="flex flex-column">
								<view class="card_info"><text>{{item.date}}</text><text>{{item.week}}</text><text>{{item.type}}</text></view>

								<view>
									<text class="mini_tag has_line">{{item.tip}}</text>
								</view>

							</view>
						</navigator>
					</view>
				</view>
			</view>

		</view>

		<!-- 分享 -->
		<share ref="share" :contentHeight="580" :shareList="shareList"></share>
	</view>
</template>

<script>
	import share from '@/components/share';

	export default {
		components: {
			share
		},
		data() {
			return {
				loaded: false,
				shareList: [],
				serviceList: [{
						id: 0,
						image: "https://inews.gtimg.com/newsapp_ls/0/11425971379_294195/0",
						title: "直击“至尊公主号”邮轮获准停靠在加州奥克兰港",
						date: "03/05",
						week: "周三",
						type: "线下活动",
						isTicket: true,
						tip: "福利IT/互联网热门排行榜第一名"
					},
					{
						id: 1,
						image: "https://inews.gtimg.com/newsapp_ls/0/11425365624_294195/0",
						title: "侠客岛：疫情肆虐全球，美国居然又打起了“台湾牌”",
						date: "02/19",
						week: "周三",
						type: "线下活动",
						isTicket: true,
						tip: "最近最热"
					},
					{
						id: 2,
						image: "https://inews.gtimg.com/newsapp_ls/0/11426006624_294195/0",
						title: "疫情大爆发、开始封城的意大利，当地华侨都经历了什么？",
						date: "02/02",
						week: "周三",
						type: "线下活动",
						isTicket: false,
						tip: "线下培训第一名"
					}
				]

			};
		},
		async onLoad() {
			let detailData = await this.$api.json('detailData');
			let shareList = await this.$api.json('shareList');
			this.loaded = true;
			this.data = detailData;
			this.shareList = shareList;
		},

		methods: {
			//分享
			share() {
				this.$refs.share.toggleMask();
			},
			//收藏
			favorite() {
				this.data.favorite = !this.data.favorite;
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
				})
			}
		},
		
		//处理遮罩层物理返回键
		onBackPress() {
			if (this.$refs.share.show) {
				this.$refs.share.toggleMask();
				return true;
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	.wrapper {
		display: flex;
		justify-content: center;
		align-content: center;
		width: 100%;
		height: 320upx;
		overflow: hidden;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.scroll-view-wrapper {
		display: flex;
		align-items: center;
		height: 90upx;
		padding: 20upx 0 20upx 40upx;
		background: #fff;
	}

	.episode-panel {
		white-space: nowrap;
		width: 100%;

		view {
			display: inline-block;
			margin-right: 30upx;
			width: 56upx;
			font-size: $font-lg;
			color: $font-color-base;

			&.current {
				color: #07a7a7;
			}
		}
	}

	.info {
		// display: flex;
		// align-items: center;
		padding: 10upx 40upx;
		background: #fff;

		.title {
			flex: 3;
			display: flex;
			flex-direction: column;
			font-size: $font-lg + 10upx;
			color: $font-color-dark;

			text:last-child {
				font-size: $font-sm;
				color: $font-color-light;
				margin-top: 4upx;

				&.Skeleton {
					width: 220upx;
				}
			}

			.title_bottom {
				height: 80upx;
				line-height: 80upx;
			}
		}

		// .actions{flex: 1;display: flex;justify-content:space-between}
		.tags {}

		.info_bottom {
			height: 80upx;
			line-height: 80upx;
			border-top: 2upx solid #E5E5E5;
			font-size: $font-base;
			margin-top: 16upx;
		}

		.yticon {
			font-size: 44upx;
			color: $font-color-base;
			margin: 0 10upx 0 30upx;
		}
	}

	.actions {
		padding: 10upx 28upx;
		background: #fff;
		overflow: hidden;

		.ic_font {
			font-size: $font-sm;
			line-height: 80upx;
			vertical-align: top;
		}

		.icon_block {
			float: left;
			overflow: hidden;
			margin-right: 32rpx;
		}

		.yticon {
			font-size: 46upx;
			color: $font-color-base;
			padding: 10upx 12upx;

			&.active {
				color: #ff4443;
			}

			&:nth-child(2) {
				font-size: 50upx;
			}
		}
	}

	.section-tit {
		height: 80upx;
		line-height: 80upx;
		font-size: $font-lg;
		font-weight: 500;
		color: $font-color-dark;
		margin-bottom: 30upx;
		text-align: left;
		margin-left: 32rpx;
	}

	.but_block {
		padding: 32rpx 100upx;
		box-sizing: border-box;
		background-color: #fff;
		border-top: 2upx solid #E5E5E5;

		button {
			border-radius: 400rpx;
		}

		;
	}

	.guess {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 30upx 40upx 10upx;
		margin-top: 16upx;
		background: #fff;
	}

	.guess-list {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
	}

	.guess-item {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
		min-width: 40%;
		margin-right: 26upx;
		padding-bottom: 40upx;

		&:nth-child(2n) {
			margin-right: 0;
		}

		image {
			width: 100%;
			height: 200upx;
			border-radius: 10upx;
		}

		text {
			font-size: $font-sm;
			color: $font-color-light;

			&.Skeleton {
				width: 180upx;

				&.title {
					width: 140upx;
				}
			}

			&.title {
				font-size: $font-base+2upx;
				color: $font-color-dark;
				margin-top: 16upx;
				margin-bottom: 8upx;
			}
		}
	}

	.evalution {
		display: flex;
		flex-direction: column;
		background: #fff;
		margin-top: 16upx;
		padding: 40upx 0;
	}

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

		.more-box,
		.zan-box {
			display: flex;
			align-items: base-line;
			position: absolute;
			bottom: 10upx;
			right: 10upx;

			.yticon {
				margin-left: 8upx;
			}
		}

		.more-box {
			top: 0;
			right: 0;

			image {
				margin-right: 0;
			}
		}

		.content {
			font-size: $font-base;
			color: #333;
			padding-top: 20upx;
		}
	}


	.article-meta {
		background-color: #fff;
		width: 100%;
		display: flex;

		padding: 20upx 30upx 0 32upx;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;

		.article-meta-text {
			color: gray;
		}

		.article-text {
			font-size: 26upx;
			line-height: 50upx;
			margin: 0 20upx;
		}

		.article-author {
			font-size: 30upx;
		}

		.article-time {
			font-size: 30upx;
		}


	}

	.article-content {
		background-color: #fff;
		font-size: 28upx;
		padding: 30upx;
		box-sizing: border-box;
		overflow: hidden;

		image {
			width: 100%;
			margin: 32rpx 0;
		}
	}

	.service_list_block.product_list_row {
		background-color: #fff;

		.list_title {
			text-align: left;
		}

		.card_list {
			margin-bottom: 0;

			.medie_images,
			.medie_images image {
				width: 160upx;
				height: 160upx;
			}

			.card_title {
				height: auto;
				-webkit-line-clamp: 1;
			}

			.list_price {
				color: $base-color;
				margin-top: 32rpx;
			}
		}
	}

	.service_list_block {
		background-color: #F7F7F7;
		padding: 16rpx;
		width: 100%;
		height: 100%;
		box-sizing: border-box;

		.list_title {
			text-align: center;
			font-size: $font-lg;
			width: 100%;
			height: 80upx;
			line-height: 80upx;
			position: relative;

			.tag_time {
				position: absolute;
				right: 0;
				top: 20upx;
				z-index: 999;
				background-color: #fff;
				border-radius: 100rpx;
			}

		}
	}

	.card_list {

		margin-bottom: 200rpx;

		.card_item {
			background-color: #fff;
			padding: 16rpx;
			box-sizing: border-box;
			margin-bottom: 16rpx;
		}

		.medie_images {
			width: 320rpx;
			height: 200rpx;
			margin-right: 32rpx;
		}

		.medie_images image {
			width: 320rpx;
			height: 200rpx;
			overflow: hidden;

		}

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

		.mini_tag.has_line {
			background-color: #fff;
			border: 0.5px solid #EEEEEE;
			color: #666;
			overflow: hidden;
			text-overflow: ellipsis;
			// display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
		}
	}

	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		padding: 30upx 22upx;
		background: #fff;

		.cate-item {
			display: flex;
			flex-direction: row !important;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
		}

		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 48upx;
			height: 48upx;
			// border-radius: 50%;
			opacity: .7;
			margin-right: 16rpx;
			// box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
		}
	}
</style>
