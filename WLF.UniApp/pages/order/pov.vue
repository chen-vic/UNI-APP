<template>
	<view>
		<view style="text-align: center;">换货</view>	
		<view class="a-bg" >
			<text>快递单号</text>
			<input placeholder="快递单号" type="number" />
		</view>
		<view class="b-bg" >
			<text >换货原因</text>
			<input placeholder="快递单号" type="text" />
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				thordernumber:null,
				thoe:null,
				is_return:3
			}
		},
		methods:{
			select(item){
				console.log(this.is_return)
			}
		}
	}
</script>

<style >
.a-bg{
	display: flex;
	width: 100%;
	height: 50px;
	border-bottom: 1px solid #0F6674;
}

.b-bg{
	display: flex;
	width: 100%;
	height: 50px;
	border-bottom: 1px solid #0F6674;
}
</style>
