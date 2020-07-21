<template>
	<view>
		<!--banner-->
		<view class="wrapper">
			<image :src="imgUrl+ items.event_img || '/static/default_detail.png' " mode="aspectFill"></image>
		</view>

		<!--标题-->
		<view class="info">
			<view class="title">
				<text>{{ items.event_title }}</text>
				<view class="flex justify-between title_bottom">
					<view class="tags mt-3">
						<uni-tag style="padding-top: 0rpx;" size="small" type="error" :text="items.type_name" inverted="true"></uni-tag>
					</view>
					<view class="actions mt-1">
						<button style="border: none; padding: 5prx 0; margin: 0; background: none; line-height: 50rpx; height: 50rpx;" size="mini" open-type="share">分享</button>
						<!-- <text class="yticon icon-fenxiang2"></text><text class="font-lg">分享</text> -->
						<!-- <text class="yticon icon-shoucang_xuanzhongzhuangtai"
						 :class="{active:favorite}" @click="toFavorite"></text>
						<text class="ic_font">收藏</text> -->
					</view>
				</view>
			</view>
			<!--工具栏-->
			<view class="info_bottom text-dark" style="overflow: hidden;">
				<image src="/static/me/ic_adress@2x.png" class="icon24" style="margin-right: 20rpx;"></image>&nbsp;{{ items.event_address }}
			</view>
			<view class="info_bottom text-dark" style="overflow: hidden;" v-if="items.venue_traffic">
				<image src="/static/me/ic_car@2x.png" class="icon24" style="margin-right: 20rpx;"></image>&nbsp;{{ items.venue_traffic }}
			</view>
			<view class="info_bottom text-dark" style="overflow: hidden;" v-if="items.venue_time">
				<image src="/static/me/ic_time@2x.png" class="icon24" style="margin-right: 20rpx;"></image>&nbsp;{{ items.venue_time }}
			</view>
		</view>

		<!--地址-->
		<view class="blank"></view>
		<view class="article-meta">
			<view class="article-meta-text article-title">场馆介绍</view>
		</view>
		<view class="article-content">
			<view class="text-dark">
				<rich-text :nodes="richText"></rich-text>
			</view>
			<!-- 			<view class="font-sm text-light-muted mt-2">发布日期：{{ items.created_at }}</view> -->
		</view>
		<!-- 预约报名 -->
		<view style="display: none;" class="but_block"> <button type="warn">预约报名</button></view>
		<view class="blank"></view>
		<!-- 热门评论 -->
		<view style="display: none;" class="evalution">
			<view class="section-tit">热门评论(3)</view>
			<view class="eva-list" :class="{Skeleton:!loaded}">
				<view v-for="(item, index) in evaList" :key="index" class="eva-item">
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
							<navigator url="/pages/comment/comment"><text class="yticon icon-xiaoxi"></text>
								<text>{{item.zan}}</text></navigator>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部操作菜单 -->
		<view class="page-bottom" v-if="is_show">
			<button @click="toEnrollEvents" type="warn" class=" action-btn no-border add-now-btn">报名</button>
		</view>

		<!-- 分享 -->
		<share ref="share" :contentHeight="580" :shareList="shareList"></share>
	</view>
</template>

<script>
	import share from '@/components/share';
	import API from '@/common/API.js';
	import HTMLParser from '@/common/html-parser.js'

	export default {
		components: {
			share
		},
		data() {
			return {
				imgUrl: API.config.imgUrl,
				items: {},
				event_id: -1,
				is_show: false,
				richText: ''
			};
		},
		onLoad(options) {
			
			this.event_id = options.id;
			this.getDetails(options.id);
			let old_event_id = uni.getStorageSync('CLOUDIN_WLF_EVENT_ID');
			console.log('old_event_id=' + old_event_id+',id=' + options.id);
			if (old_event_id == this.event_id) {
				this.is_show = false;
			} else {
				this.is_show = true;
			}
		},

		methods: {

			//获取详情
			getDetails(id) {
				API._GET(`/api/events/${id}`, {}, res => {
					console.log('res=' + JSON.stringify(res));
					if (res.code == 0) {
						this.items = res.data;
						let htmlString = res.data.event_content || ''
						htmlString = htmlString.replace(/<o:p><\/o:p>/gi, '')
						this.richText = HTMLParser(htmlString)
					}
				})
			},
			// 报名
			toEnrollEvents() {
				let id = this.items.event_id;
				uni.navigateTo({
					url: `/pages/activity/enroll?id=${id}`
				})
				// API._POST_ID('POST.eventenroll', this.event_id, {
				// 	member_name: '',
				// 	mobile_phone: '',
				// 	enroll_people: 1,
				// 	enroll_remark: '',
				// 	member_id: uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID'),
				// 	event_id: 1,
				// }, res => {
				// 	if (res.code === 0) {
				// 		this.$api.msg('操作成功，等待工会统计');
				// 		setTimeout(() => {
				// 			uni.setStorageSync('CLOUDIN_WLF_EVENT_ID', this.event_id);
				// 			uni.navigateBack();
				// 		}, 1000);
				// 	} else {
				// 		//this.$api.msg(res.msg);
				// 	}
				// });
			},
		},
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
		font-size: $font-lg;
		font-weight: 500;
		color: $font-color-dark;
		margin-bottom: 30upx;
		text-align: left;
		margin-left: 32rpx;
	}

	.but_block {
		padding: 32upx;
		box-sizing: border-box;
		background-color: #fff;
		border: 2upx solid #E5E5E5;

		button {
			background-color: #fff;
			border-radius: 400rpx;
			border: 2upx solid #F62605;
			color: #F62605;
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
		margin-bottom: 200upx;
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

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 120upx;
		border-top: 1rpx solid #eee;
		background: rgba(255, 255, 255, 1);
		padding: 0 64rpx;
		box-sizing: border-box;

		/* box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx; */
		.action-btn {
			width: 100%;
			border-radius: 400rpx;
		}

		.action-btn-group {
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			margin-left: 20upx;
			position: relative;
			width: 100%;
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
		font-size: 28rpx;
		padding: 30rpx 30rpx 200rpx 30rpx;
		box-sizing: border-box;
		overflow: hidden;
		line-height: 45rpx;

		image {
			width: 100%;
			margin: 32rpx 0;
		}
	}
</style>
