<!-- 菜单悬浮的原理: 监听滚动条的位置大于某个值时,控制顶部菜单的显示和隐藏 -->
<!-- iOS可使用position:sticky, 为了兼容Android手机这里是监听列表滚动事件实现-->
<template>
	
	<view>
		<view v-if="!is_logistics">
			<!-- 菜单 (悬浮,预先隐藏)-->
			<app-tabs v-if="isShowSticky" v-model="tabIndex" :fixed="true" :tabs="tabs" @change="tabChange"></app-tabs>

			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption" @scroll="scroll"
			 @topclick="topClick">
				<!-- 菜单 (在mescroll-uni中不能使用fixed,否则iOS滚动时会抖动, 所以需在mescroll-uni之外存在一个一样的菜单) -->
				<view id="tabInList">
					<app-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange(tabIndex)"></app-tabs>
				</view>

				<!-- 数据列表 -->
				<view v-for="(item,index) in goods" :key="index" class="order-item">
					<view class="i-top b-b">
						<text class="time">{{item.created_at}}</text>
						<text class="state">{{item.status_name}}</text>
						<text v-if="item.state===9" class="del-btn yticon icon-iconfontshanchu1" @click="deleteOrder(index)"></text>
					</view>

					<scroll-view v-if="item.goods.length > 1" class="goods-box"  scroll-x @click="goodsClick(item)">
						<view v-for="(goodsItem, goodsIndex) in item.goods" :key="goodsIndex" class="goods-item">
							<image class="goods-img" :src="goodsItem.goods_img?imgUrl+goodsItem.goods_img:'/static/default_goods.jpg'" mode="aspectFill"></image>
						</view>
					</scroll-view>
					<view v-if="item.goods.length === 1" class="goods-box-single" v-for="(goodsItem, goodsIndex) in item.goods" :key="goodsIndex">
						<image class="goods-img" @click="goodsClick (item)" :src="goodsItem.goods_img?imgUrl+goodsItem.goods_img:'/static/default_goods.jpg'" mode="aspectFill"></image>
						<view class="right" @click="goodsClick (item)">
							<text class="title clamp">{{goodsItem.goods_name}}</text>
							<text class="attr-box">{{goodsItem.attr_name}} x {{goodsItem.goods_amount}}</text>
							<text class="price">{{goodsItem.shop_price}}</text>
						</view>
					</view>

					<view class="price-box" @click="goodsClick (item)">
						共
						<text class="num">{{item.goods_amount}}</text>
						件商品 实付款
						<text class="price">{{item.total_price}}</text>
					</view>
					<view class="action-box b-t">
						<button v-if="item.order_status==2" class="action-btn" @click="Dialog(item)">换货</button>
						<button v-if="item.order_status==2" class="action-btn" @click="confirmDialog(item)">退款/退货</button>
						<!-- <button v-if="item.order_status==2" class="action-btn" @click="viewLogistics(item)">查看物流</button> -->
						<view v-if="item.order_status==1">
							<button class="action-btn recom" @click="gotoPay(item)">立即支付</button>
						</view>
						<!-- <view v-if="order_status==4"><button @click="service()" class="action-btn recom">申请售后</button></view> -->
					</view>
				</view>
			</mescroll-body>
			<!-- 提交信息 -->
			<uni-popup ref="dialogInput" type="dialog">
				<uni-popup-dialog mode="input" title="输入原因" value="" placeholder="请输入原因" @confirm="(done, val) => dialogInputConfirm (done, val)"></uni-popup-dialog>
			</uni-popup>
		</view>
		<view v-else>
			<logistics :wlInfo="wlInfo"></logistics>
		</view>
	</view>
</template>

<script>
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import logistics from '@/components/xinyu-logistics/xinyu-logistics.vue'
	import AppTabs from "@/components/app-tabs.vue";
	import API from "@/common/API.js"
	import {apiOrders} from "@/api/data.js"

	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		components: {
			AppTabs,
			logistics,
			uniPopupDialog
		},
		data() {
			return {
				wlInfo: {
					delivery_status: 1, //快递状态 1已签收 2配送中
					post_name: '韵达快递', //快递名称
					logo: 'https://cdn.kuaidi100.com/images/all/56/yunda.png', //快递logo
					exp_phone: '95546', //快递电话
					post_no: '4304678557725', //快递单号
					addr: '江西省南昌市青云谱区', //收货地址
					list: [
						{
							"time": "2020-04-12 13:00:57",
							"timeArr": ['2020-04-12', '13:00:57'],
							"context": "江西南昌青云谱区 快件已被 丰巢智能柜 代签收。",
							"location": ""
						}
					]
				},
				mdl: {
					return_remark: ''
				},
				is_logistics:false,
				imgUrl: API.config.imgUrl,
				goods: [], // 数据列表
				upOption: {
					// 如果用mescroll-uni 则需要onScroll: true, 且需要 @scroll="scroll"; 而mescroll-body最简单只需在onPageScroll处理即可
					// onScroll: true // 是否监听滚动事件, 默认false (配置为true时,可@scroll="scroll"获取到滚动条位置和方向)
				},
				tabs: ['全部', '待付款', '待收货', '待评价', '已完成'],
				tabIndex: 0, // tab下标
				navTop: null, // nav距离到顶部的距离 (如计算不准确,可直接写死某个值)
				isShowSticky: false, // 是否悬浮
				status: 1,
			}
		},
        onLoad(option) {
            this.tabIndex = Number(option.status) || 0
            this.tabChange(this.tabIndex)
        },
        onShow() {
            // 刷新订单列表
            this.tabChange(this.tabIndex)
        },
		methods: {
			//确认支付
			gotoPay(item){
				uni.redirectTo({
					url: '/pages/money/pay?money=' + item.total_price + '&orderID=' + item.order_id
				})
			},

			//点击商品跳转详情
			goodsClick(item) {
				
				uni.navigateTo({
					url: `/pages/order/details?order_id=${item.order_id}`
				});
			},
			/*下拉刷新的回调 */
			downCallback() {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.mescroll.resetUpScroll()
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				//联网加载数据
				if (this.isChangeTab) {
					this.mescroll.hideUpScroll(); // 切换菜单,不显示mescroll进度, 显示系统进度条
					uni.showLoading();
				}
				//let keyword = this.tabs[this.tabIndex]
				let member_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID');
				let order_status = uni.getStorageSync('CLOUDIN_WLF_ORDER_STATUS');
				console.log('member_id=' + member_id);
				apiOrders(page.num, page.size, this.tabIndex, member_id).then(curPageData => {
					//联网成功的回调

					//设置列表数据
					if (page.num == 1) this.goods = []; //如果是第一页需手动制空列表
					this.goods = this.goods.concat(curPageData); //追加新数据

					// 数据渲染完毕再隐藏加载状态
					this.$nextTick(() => {
						this.mescroll.endSuccess(curPageData.length);
						// 设置nav到顶部的距离 (需根据自身的情况获取navTop的值, 这里放到列表数据渲染完毕之后)
						// 也可以放到onReady里面,或者菜单顶部的数据(轮播等)加载完毕之后..
						if (!this.navTop) this.setNavTop()
						// 保持tab悬浮,列表数据显示第一条
						if (this.isChangeTab) {
							this.isChangeTab = false;
							uni.hideLoading();
							if (this.isShowSticky) this.mescroll.scrollTo(this.navTop, 0)
						}
					})
				}).catch(() => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			},
			// 设置nav到顶部的距离 (滚动条为0, 菜单顶部的数据加载完毕获取到的navTop数值是最精确的)
			setNavTop() {
				let view = uni.createSelectorQuery().select('#tabInList');
				view.boundingClientRect(data => {
					console.log('tabInList基本信息 = ' + JSON.stringify(data));
					this.navTop = data.top // 到屏幕顶部的距离
				}).exec();
			},
			// mescroll-uni的滚动事件 (需在up配置onScroll:true才生效)
			// 而mescroll-body最简单只需在onPageScroll处理即可
			scroll() {
				console.log('滚动条位置 = ' + this.mescroll.getScrollTop() + ', navTop = ' + this.navTop);
				// 菜单悬浮的原理: 监听滚动条的位置大于某个值时,控制顶部菜单的显示和隐藏
				if (this.mescroll.getScrollTop() >= this.navTop) {
					this.isShowSticky = true // 显示悬浮菜单
				} else {
					this.isShowSticky = false // 隐藏悬浮菜单
				}
			},
			// 点击回到顶部按钮时,先隐藏悬浮菜单,避免闪动
			topClick() {
				this.isShowSticky = false
			},
			// 切换菜单
			tabChange(index) {
				console.log('index=' + index);

				if (index == 0) {
					this.status == -1;
				} else {
					this.status == index;
				}
				uni.setStorageSync('CLOUDIN_WLF_ORDER_STATUS', this.status);
				this.isChangeTab = true;
				this.mescroll.resetUpScroll();
			},
			cancelOrder(item) {
			
				let params = {order_id: item.order_id, member_id: uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID'), return_remark: this.mdl.return_remark}
				console.log(params)
				API._POST(`POST.orderreturn`, params, res => {
					//取消订单后删除待付款中该项
					// let list = this.goods;
					// let index = list.findIndex(val=>val.id === item.id);
					// index !== -1 && list.splice(index, 1);
					
					// uni.hideLoading();
					this.mescroll.resetUpScroll()
				})
			},
			viewLogistics(item) {
				//获取昵称、头像并更新
				console.log(item)
				API._GET('GET.logistics', {
					order_id: item.order_id,
				}, res => {
					console.log('res',res)
					if (res.code == 0) {
						let res1 = JSON.parse(res.data)
						console.log(res1);
						this.wlInfo = {
							// delivery_status: 1, //快递状态 1已签收 2配送中
							// post_name: '韵达快递', //快递名称
							// logo: 'https://cdn.kuaidi100.com/images/all/56/yunda.png', //快递logo
							// exp_phone: '95546', //快递电话
							// post_no: '4304678557725', //快递单号
							// addr: '江西省南昌市青云谱区', //收货地址
							list: [
								
							]
						}
						console.log(res1.data)
						if (res1.data) {
							res1.data.map((item) => {
								this.wlInfo.list.push({
									"time": item.ftime,
									"timeArr": [item.time],
									"context": item.context,
									// "location": ""
								})
							})
							this.is_logistics = true
						} else {
							uni.showToast({
								title: '查无结果',
								icon:"none"
							});
						}
						console.log(this.wlInfo);
						
					}
				});
			},
			/**
			 * 打开提交信息
			 */
			Dialog(item){
				console.log(item)
				uni.navigateTo({
					url: `/pages/order/pov`
				}); 
			 },
			confirmDialog(item) {
				console.log(item)
				// this.mdl = item
				// this.$refs.dialogInput.open()
				uni.navigateTo({
					url: `/pages/order/pok?props=${item.order_id}`
				});
				
			},
			/**
			 * 输入对话框的确定事件
			 */
			dialogInputConfirm(done, val) {
				uni.showLoading({
					title: '加载中..'
				})
				
				this.mdl.return_remark = val
				console.log(val);
				setTimeout(() => {
					this.cancelOrder(this.mdl)
					uni.hideLoading()
					// 关闭窗口后，恢复默认内容
					done()
				}, 30)
			},
		},
		// 使用mescroll-body最简单只需在onPageScroll处理即可
		onPageScroll(e) {
			console.log('滚动条位置 = ' + e.scrollTop + ', navTop = ' + this.navTop);
			if (e.scrollTop >= this.navTop) {
				this.isShowSticky = true // 显示悬浮菜单
			} else {
				this.isShowSticky = false // 隐藏悬浮菜单
			}
		},
	}
</script>
<style lang="scss">
	page,
	.content {
		background: $page-color-base;
		height: 100%;
	}

	.swiper-box {
		height: calc(100% - 40px);
	}

	.list-scroll-content {
		height: 100%;
	}

	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.uni-swiper-item {
		height: auto;
	}

	.order-item {
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;

		.i-top {
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right: 30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;

			.time {
				flex: 1;
			}

			.state {
				color: $base-color;
			}

			.del-btn {
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;

				&:after {
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}

		/* 多条商品 */
		.goods-box {
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;

			.goods-item {
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}

			.goods-img {
				display: block;
				width: 100%;
				height: 100%;
			}
		}

		/* 单条商品 */
		.goods-box-single {
			display: flex;
			padding: 20upx 0;

			.goods-img {
				display: block;
				width: 120upx;
				height: 120upx;
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;

				.title {
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}

				.attr-box {
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
				}

				.price {
					font-size: $font-base + 2upx;
					color: $font-color-dark;

					&:before {
						content: '￥';
						font-size: $font-sm;
						margin: 0 2upx 0 8upx;
					}
				}
			}
		}

		.price-box {
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.num {
				margin: 0 8upx;
				color: $font-color-dark;
			}

			.price {
				font-size: $font-lg;
				color: $font-color-dark;

				&:before {
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}

		.action-box {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}

		.action-btn {
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;

			&:after {
				border-radius: 100px;
			}

			&.recom {
				background: #fff9f9;
				color: $base-color;

				&:after {
					border-color: #f7bcc8;
				}
			}
		}
	}


	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}

	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}

	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}

	.uni-load-more__img>view {
		position: absolute
	}

	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}

	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}

	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}

	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}

	.load2 {
		transform: rotate(30deg)
	}

	.load3 {
		transform: rotate(60deg)
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s
	}

	.load2 view:nth-child(1) {
		animation-delay: .13s
	}

	.load3 view:nth-child(1) {
		animation-delay: .26s
	}

	.load1 view:nth-child(2) {
		animation-delay: .39s
	}

	.load2 view:nth-child(2) {
		animation-delay: .52s
	}

	.load3 view:nth-child(2) {
		animation-delay: .65s
	}

	.load1 view:nth-child(3) {
		animation-delay: .78s
	}

	.load2 view:nth-child(3) {
		animation-delay: .91s
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1
		}

		100% {
			opacity: .2
		}
	}
</style>
