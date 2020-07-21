<template>
	<view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="notice-item" v-for="(item, index) in dataList" :key="index" @click="navToWebPage(item)">
				<text class="time">{{item.created_at}}</text>
				<view class="content">
					<text class="title">{{item.message_title}}</text>
					<view class="img-wrapper">
						<image class="pic" :src="item.message_img?imgUrl+item.message_img:'/static/default_list.jpg'"></image>
					</view>
					<view class="introduce" v-html="item.message_content"></view>
					<view class="bot b-t">
						<text>查看详情</text>
						<text class="more-icon yticon icon-you"></text>
					</view>
				</view>
			</view>
		</mescroll-body>

	</view>
</template>

<script>
	import {
		apiMessages
	} from "@/api/data.js"
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import API from "@/common/API.js"
	

	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				imgUrl: API.config.imgUrl,
				dataList: [],
			}
		},
		methods: {
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				//联网加载数据
				apiMessages(page.num, page.size).then(curPageData => {
					this.mescroll.endSuccess(curPageData.length);
					if (page.num == 1) this.dataList = []; //如果是第一页需手动制空列表
					this.dataList = this.dataList.concat(curPageData); //追加新数据
				}).catch(() => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			},
			//end
			/**
			 * 跳转到网页
			 */
			navToWebPage(item) {
				console.log(item)
				uni.navigateTo({
					url: '/pages/notice/newsDetail?id='+item.message_id
				});
			},
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: #f7f7f7;
		padding-bottom: 30upx;
	}

	.notice-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.time {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80upx;
		padding-top: 10upx;
		font-size: 26upx;
		color: #7d7d7d;
	}

	.content {
		width: 710upx;
		padding: 0 24upx;
		background-color: #fff;
		border-radius: 4upx;
	}

	.title {
		display: flex;
		align-items: center;
		height: 90upx;
		font-size: 32upx;
		color: #303133;
	}

	.img-wrapper {
		width: 100%;
		height: 260upx;
		position: relative;
	}

	.pic {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 6upx;
	}

	.cover {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .5);
		font-size: 36upx;
		color: #fff;
	}

	.introduce {
		display: inline-block;
		padding: 16upx 0;
		font-size: 28upx;
		color: #606266;
		line-height: 38upx;
		height: 38px;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space:nowrap
	}

	.bot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80upx;
		font-size: 24upx;
		color: #707070;
		position: relative;
	}

	.more-icon {
		font-size: 32upx;
	}
</style>
