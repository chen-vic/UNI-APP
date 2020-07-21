<template>
	<view class="content text-dark font">
		<view v-if="flag==1" class="has_line">
			<view class="box p-2">
				<view class="question font-bold">Q：怎么才能找到万乐福平台？</view>
				<view class="answer">A：您好，微信小程序搜索“万乐福福利平台”、或者到应用商城中搜索“万乐福”下载App（仅限安卓）。或者输入网址https://www.wanlef.com就可以找到我们平台了。</view>
			</view>
			<view class="box p-2">
				<view class="question font-bold">Q：怎么注册万乐福平台？</view>
				<view class="answer">A：网页端：打开浏览器，输入网址https://www.wanlef.com，点击右上角登录按钮输入账号、密码即可登录（仅限工会主席）
小程序端：打开微信，在搜索栏搜索“万乐福福利平台”，点击进入-点击“我的”-“授权登陆”-“关联微信号”-点击允许-注册完成。
App注册：打开App输入手机号、密码、验证码注册即可。</view>
			</view>
			
		</view>
		<view v-if="flag==2" class="has_line">
			<view class="box p-2">
				<view class="question font-bold">Q：怎么激活福豆卡券？</view>
				<view class="answer">A：您好，打开微信，登陆“万乐福福利平台”小程序，点击“我的”，点击“我的福豆”，点击“激活福豆”，输入卡号和密码（注意区分数字和大小写字母），点击确认激活就好了。</view>
			</view>
			<view class="box p-2">
				<view class="question font-bold">Q：激活福豆显示失败？</view>
				<view class="answer">A：您好，您先查看下输入的福豆卡券是否过有效期或者输入错误。输入错误：请正确输入卡券卡号和密码，注意区分大小写字母和数字。输入正确：您好，请告知下您的福豆卡券，我后台查询下回复您，谢谢。</view>
			</view>
			
		</view>
		<view v-if="flag==3" class="has_line">
			<view class="box p-2">
				<view class="question font-bold">Q：商品显示无货买不了大概多久能上架？</view>
				<view class="answer">A：您好，平台商品根据供应商库存来上架，您可以先收藏该商品，等商品重新上架后就可以购买了。收藏按钮在商品页面左下角爱心标志。</view>
			</view>
			<view class="box p-2">
				<view class="question font-bold">Q：商品是不是都是正品？</view>
				<view class="answer">A：您好，我们商品都是供应商统一发货，您可以放心购买。</view>
			</view>
		</view>
		<view v-if="flag==4" class="has_line">
			<view class="box p-2">
				<view class="question font-bold">Q：怎么退货？</view>
				<view class="answer">A：您好，购买商品确认收货后才能申请退款，退款金额会按原路返回，您可以注意查看余额。</view>
			</view>
			<view class="box p-2">
				<view class="question font-bold">Q：怎么换货？</view>
				<view class="answer">A：您好，您收到物品后可以联系在线客服来申请换货。</view>
			</view>
			
		</view>
		<view v-if="flag==5" class="has_line">
			<view class="box p-2">
				<view class="question font-bold">Q：购买商品时为什么显示支付未成功？</view>
				<view class="answer">A：您好，请看下福豆余额还有吗？没有的话，充值后再次付款就可以了。</view>
			</view>
		</view>
		<view v-if="flag==6" class="has_line">
			<view class="box p-2">
				<view class="question font-bold">Q：如何索取发票？</view>
				<view class="answer">A：您好，您可以联系在线客服登记相关发票信息来申请发票。</view>
			</view>
		</view>
		<view v-if="flag==7" class="has_line">
			<view class="box p-2">
				<view class="question font-bold">Q：我这几天没空能不能换个时间派送快递？</view>
				<view class="answer">A：您好，我们快递都是给第三方物流公司，您可以根据网点派送情况联系配送员商量派送时间。</view>
			</view>
			<view class="box p-2">
				<view class="question font-bold">Q：商品价格能不能便宜点？</view>
				<view class="answer">A：您好，商品价格都是按照供应商设置的，目前调整不了。或者您可以关注下我们平台会有不定时的促销活动。</view>
			</view>
			<view class="box p-2">
				<view class="question font-bold">Q：商品活动页面价格和实际下单价格不符？</view>
				<view class="answer">A：您好，限时折扣的商品请在购买时确认折扣开始时间，如果折扣时间未到，拍下就是原价。商品如果不包邮，在拍下付款时，是加上运费的价格，建议在付款时仔细核实。</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				flag: 1,
			};
		},
		onLoad(options) {
			this.flag = options.id;
		},
		created() {

		},
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}
	.box{
		
	}
</style>
