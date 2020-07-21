<template>
	<view>
	 <view class="header">
	   <view style="text-align: center;">{{item}}</view>
	  </view>
	  <view class="content">
		 <view class="row b-b">
		 	<text class="tit">快递单号</text>
		 	<input class="input" type="number" v-model="copyUserInfo.mobile_phone" placeholder="请输入手机号码" placeholder-class="placeholder" />
		 </view>
		 <view class="row b-b">
		 	<text class="tit">退款原因</text>
		 	<input class="input" type="text" v-model="copyUserInfo.member_name" placeholder="请输入姓名" placeholder-class="placeholder" />
		 	
		 </view>
	  </view>
	  <view class="footer">
		  <button @click="sub(item)">确认</button>
	  </view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				item:'如果您已发货,可输入快递单号后办理退款',
				is_return:1,
				tkordernumber:null
			}
		},
		methods:{
			sub(item){
				if(this.tkordernumber==null){
					uni.showModal({
						title:"请您输入您的退款单号"
					})
				}
			
			}
		},
		onLoad:function(option){
			console.log(option.props)
		}
	}
</script>

<style>
	.header{
		width: 100%;
	}
	.d-header{
		display: block;
		
	}
	.body{
		width: 100%;
		height: 150px;
	}
	.body input{
		display: block;
		width: 80%;
		height: 40%;
		margin-left: 10%;
		border: 1px solid #8799A3;
	}
	.footer{
		width: 100%;
		height: 20px;
		text-align: center;
	}
	button{
		border: 1px solid #909399;
		border-radius: 25px;
		width: 20%;
	}
	.content {
		width: 100%;
		box-sizing: border-box;
		padding: 0 30upx;
	}
	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30upx;
		height: 110upx;
		background: #fff;
	
		.tit {
			flex-shrink: 0;
			width: 140upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
	
		.input {
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.uni-input {
			font-size: 30upx;
		}
		.icon-shouhuodizhi {
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.cate-section {
		width: 100%;
		display: flex;
		margin-top: 40rpx;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		padding: 30upx 22upx;
		background: #fff;
	
		.cate-item {
			width: 50%;
			text-align: center;
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
	
			.button {
				width: 100%;
			}
		}
	}
</style>
