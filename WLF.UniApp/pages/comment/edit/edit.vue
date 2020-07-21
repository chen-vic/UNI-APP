<template>
	<view>
		<view class="form_switch">
			<text class="uni-title">匿名评论</text>
			<switch @change="switchChange" />
		</view>
		<view class="uni-textarea">
			<textarea @blur="bindTextAreaBlur" placeholder="评论一下" />
			</view>
		<view class="but_block"> <button type="warn">发表评论</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
			switchChange: function(e) {
				console.log('switch2 发生 change 事件，携带值为', e.target.value)
			}
		}
	}
</script>

<style lang="scss">
	.form_switch{padding: 0 32rpx;text-align: right;}
	.uni-title {margin-right: 32rpx;
		font-size: $font-sm;
		color: $border-color-base;
	}
	.uni-textarea{
		padding: 32rpx;
		box-sizing: border-box;
		width: 100%;
		textarea{height: 300upx;border: 2upx solid #E4E7ED;width: 100%;padding: 16rpx;background-color: #FAFAFA;}
	}

	.but_block {
		padding: 32rpx;
		box-sizing: border-box;
		background-color: #fff;
		
		button {
			border-radius: 400rpx;
		}

		;
	}
</style>
