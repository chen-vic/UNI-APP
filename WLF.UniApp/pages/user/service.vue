<template>
	<view>
		<view class="cate-section">
<!-- 			<view class="cate-item">
				<text class="yticon icon-icon--"></text>
				<button class="btns" open-type="contact" bindcontact="handleContact">在线客服</button>
			</view> -->
			<view class="cate-item" @click="call">
				<text class="yticon icon-dianhua-copy"></text>
				<button class="btns">客服热线</button>
			</view>
		</view>
		<view class="blank"></view>
		<view class="list_block">
			<uni-list>
				<uni-list-item title="常见问题" @click="navTo('/pages/user/serviceview?id=1')" thumb="/static/me/ic_problem.svg" />
				<uni-list-item title="激活福豆问题" @click="navTo('/pages/user/serviceview?id=2')" thumb="/static/me/ic_problem.svg" />
				<uni-list-item title="商品问题" @click="navTo('/pages/user/serviceview?id=3')" thumb="/static/me/ic_problem.svg" />
				<uni-list-item title="退换货问题" @click="navTo('/pages/user/serviceview?id=4')" thumb="/static/me/ic_problem.svg" />
				<uni-list-item title="支付问题" @click="navTo('/pages/user/serviceview?id=5')" thumb="/static/me/ic_problem.svg" />
				<uni-list-item title="发票问题" @click="navTo('/pages/user/serviceview?id=6')" thumb="/static/me/ic_problem.svg" />
				<uni-list-item title="其他问题" @click="navTo('/pages/user/serviceview?id=7')" thumb="/static/me/ic_problem.svg" />
			</uni-list>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			};
		},
		methods: {
			/**
			 * 拨打电话
			 */
			call() {
				uni.makePhoneCall({
					phoneNumber: '4006107666'
				});
			},
			/**
			 * 在线客服
			 */
			handleContact(e) {
				console.log(e.detail.path)
				console.log(e.detail.query)
			},
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url) {
				// if( this.hasLogin){
				uni.navigateTo({
					url
				})
				// }else {
				// this.$api.msg('请先登录！')
				// }
			},
		}
	}
</script>

<style lang="scss">
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		padding: 30upx 22upx;
		background: #fff;

		.cate-item {
			text-align: center;
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
		}

		.yticon {
			width: 88upx;
			height: 88upx;
			margin-bottom: 14upx;
			font-size: 88upx;
		}
	}
	.btns {
	  border: none;
	  background-color: #fff;
	 }
	 .btns::after {
	  border: none;
	 }
</style>
