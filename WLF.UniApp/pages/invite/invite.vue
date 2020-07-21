<template>
	<view>
		<!--头部图-->
		<view class="ad_invite">
			<!-- <button type="primary" open-type="share" class="btn_pos"></button> -->
			<button type="primary" @click="inviteFriends" class="btn_pos"></button>
			<view class="image-wrapper">
				<image src="http://img.wanlef.com/mp/img_invite.png" class="loaded" mode="aspectFill"></image>
			</view>
		</view>

		<!--名次列表-->
		<view class="list_content">
			<!--标题-->
			<view class="cate-section">
				<view class="cate-item">
					<text>成功邀请</text>
					<text>{{people_num}}人</text>
				</view>
				<view class="cate-item">
					<text>累计奖励</text>
					<text>福豆{{reward_num}}</text>

				</view>
			</view>

			<!-- 等级表 -->
			<view class="eva-section">
				<view class="e-header">
					<text class="tit">邀请用户列表</text>
					<text class="yticon icon-you"></text>
				</view>
				<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
					<view class="eva-box" v-for="(item, index) in dataList" :key="index">
						<view class="grade">{{index+1}}</view>
						<image class="portrait" :src="item.member_avatar || '/static/missing-face.png'" mode="aspectFill"></image>
						<view class="right">
							<text class="name">{{item.member_name}}</text>
							<view class="bot">
								<text class="attr">{{item.mobile_phone}}</text>
								<text class="price"></text>
							</view>
						</view>
					</view>
				</mescroll-body>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		apiInviteMembers
	} from "@/api/data.js"
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import API from "@/common/API.js"

	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				imgUrl: API.config.imgUrl,
				dataList: [],
				people_num: 0,
				reward_num: 0
			}
		},
		methods: {
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				//联网加载数据
				let member_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID');
				console.log('member_id=' + member_id);
				apiInviteMembers(page.num, page.size, member_id).then(curPageData => {
					this.mescroll.endSuccess(curPageData.length);
					if (page.num == 1) this.dataList = []; //如果是第一页需手动制空列表
					this.dataList = this.dataList.concat(curPageData); //追加新数据
					this.people_num = this.dataList.length;
					this.reward_num = this.people_num*10;
				}).catch(() => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			},
			//end
			inviteFriends(){
				this.$api.msg('邀请好友暂未开放，尽情期待！');
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: #efefef;
	}

	.ad_invite {
		height: 722upx;
		position: relative;

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.btn_pos {
			position: absolute;
			margin: auto;
			left: 0;
			right: 0;
			bottom: 60upx;
			width: 80%;
			border-radius: 100rpx;
			z-index: 999;
			background: none;
		}
	}

	.list_content {
		padding: 32rpx;
	}

	/*标题*/
	.cate-section {
		border-radius: 16upx;
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
	}

	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;
		border-radius: 16upx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.tit {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.icon-you {
				margin-left: 10upx;
			}
		}
	}

	.eva-box {
		display: flex;
		padding: 20upx 0;
		border-bottom: 2upx solid #E5E5E5;

		.grade {
			width: 60upx;
			height: 80upx;
			line-height: 80upx;
			font-size: $font-lg;
			font-weight: 800;
		}

		.portrait {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;

			.con {
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color: $font-color-light;

				.price {
					color: $font-color-dark;
					font-size: $font-lg;
					font-weight: 500;
				}
			}
		}
	}

	.eva-box:last-child {
		border-bottom: none;
	}
</style>
