<template>
	<view class="container">
		<view class="icon-1">
			<image src="../../static/slogan.jpg"></image>
		</view>
		<view class="icon-2">
			<image src="../../static/app-h.png"></image>
		</view>
		<view class="icon-3">
			万乐福福利平台全新上线
		</view>
		<view class="icon-4" @click="goIos">
			<image src="../../static/ios.png"></image>
			ios版下载
		</view>
		<view class="icon-4" @click="goAnzhuo">
			<image src="../../static/anzhuo.png"></image>
			Android版下载
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {

		}
	},
	onShow() {

	},
	methods: {
		goIos(){
			window.location.href = 'https://apps.apple.com/cn/app/%E4%B8%87%E4%B9%90%E7%A6%8F/id1513129745'
		},
		goAnzhuo(){
			window.location.href = 'https://sj.qq.com/myapp/search.htm?kw=%E4%B8%87%E4%B9%90%E7%A6%8F'
		}
	}
}
</script>

<style lang="scss" scoped>
	.container{
		.icon-1{
			padding: 20upx 0;
			display: flex;
			justify-content: flex-end;
			image{
				width: 204upx;
				height: 74upx;
			}
		}
		.icon-2{
			padding: 30upx 0;
			image{
				width: 100%;
			}
		}
		.icon-3{
			font-size: 28upx;
			color: #333;
			margin-bottom: 50upx;
			text-align: center;
		}
		.icon-4{
			width: 200upx;
			height: 50upx;
			display: flex;
			align-items: center;
			font-size: 16upx;
			color: #333;
			background: #ccc;
			border-radius: 4rpx;
			padding-left: 40rpx;
			box-sizing: border-box;
			margin: 0 auto 20upx;
			image{
				width: 32upx;
				height: 32rpx;
				margin-right: 10upx;
			}
		}
	}	
</style>
