	<!-- 菜单悬浮的原理: 监听滚动条的位置大于某个值时,控制顶部菜单的显示和隐藏 -->
<!-- iOS可使用position:sticky, 为了兼容Android手机这里是监听列表滚动事件实现-->
<template>
	<view class="cu-list menu sm-border padding-tb-sm bg-white">
		<!-- 一般用法 -->
		<uni-card is-full="true" :title="order_detail.order_no" :extra="order_detail.status_name">
		    <view class="cu-item solid-bottom" v-for="(item,index) in order_detail.goods" :key="index" >
		    	<view class="flex justify-start">
		    		<view>
		    			<image style="width: 110px; height: 95px;" class="basic" :src="`${imgUrl}${item.goods_img}`"></image>
		    		</view>
		    		<view class="content margin-left-sm">
		    			<text class="text-ellipsis2">{{item.goods_name}}</text>
		    			<view class="margin-bottom-xs">
		    				<view class='cu-tag radius sm text-gray'>{{item.attr_name}}</view>
		    			</view>
		    			<view class="flex">
		    				<view class="text-red">
		    					<text class="text-df">￥</text>
		    					<text class="text-xxl">{{item.shop_price}}</text>
								<text class="price">{{item.goods_amount}}</text>
		    				</view>
		    			</view>
		    		</view>
		    	</view>
		    </view>
		</uni-card>
		<view style="margin: 30px;"></view>
		<uni-card is-full="true" title="收货人信息">
			<view class="footer-box" style="color: #c0c0c0;">
				<view>手机号: {{order_detail.member_phone}}</view>
				<view>姓名: {{order_detail.member_name}}</view>
				<view>地址: {{order_detail.member_address}}</view>
			</view>
		</uni-card>
	</view>
</template>

<script>
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import logistics from '@/components/xinyu-logistics/xinyu-logistics.vue'
	import AppTabs from "@/components/app-tabs.vue";
	import API from "@/common/API.js"
	import {apiOrders} from "@/api/data.js"
	import uniCard from '@/components/uni-card/uni-card.vue'

	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		components: {
			AppTabs,
			logistics,
			uniPopupDialog,
			uniCard
		},
		data() {
			return {
				order_id: 0,
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
				tabs: ['全部', '待支付', '待发货', '待评价', '已完成'],
				tabIndex: 0, // tab下标
				navTop: null, // nav距离到顶部的距离 (如计算不准确,可直接写死某个值)
				isShowSticky: false, // 是否悬浮
				status: 1,
				order_detail: {}
			}
		},
		methods: {
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
			handle () {
				API._GET_ID('GET.order_detail', this.order_id, res => {
					console.log(res)
					if(res.code == 0) {
						
						this.order_detail = res.data
					}
				})
			},
			viewLogistics(item) {
				//获取昵称、头像并更新
				API._GET('GET.logistics', {
					order_id: item.order_id,
				}, res => {
					if (res.code == 0) {
						res.data = JSON.parse(res.data)
						console.log(res.data);
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
						
						res.data.data.map((item) => {
							this.wlInfo.list.push({
								"time": item.ftime,
								"timeArr": [item.time],
								"context": item.context,
								// "location": ""
							})
						})
						
						console.log(this.wlInfo);
						this.is_logistics = true
					}
				});
			},
			/**
			 * 打开提交信息
			 */
			confirmDialog(item) {
				this.mdl = item
				this.$refs.dialogInput.open()
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
				}, 3000)
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
		onLoad (option) {
			this.order_id = option.order_id
			this.handle()
		}
	}
</script>
<style>
	page {
		/* background-color: #FFFFFF; */
		/* overflow: hidden; */
	}

	.tools-alert {
		height: 100%;
		position: fixed;
		width: 100%;
		left: 0;
		box-sizing: border-box;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: 100;
	}

	.filter-content {
		overflow-y: auto;
		/* #ifdef H5 */
		height: calc(100vh - 105px);
		/* #endif */
		/* #ifdef MP-WEIXIN */
		height: calc(100vh - 125px);
		/* #endif */
		/* #ifdef APP-VUE */
		height: calc(100vh - 145px);
		/* #endif */
	}

	.filter-price-input {
		width: 232upx;
		height: 80upx;
		border-radius: 6upx;
	}

	.solids-center {
		height: 4upx;
		background-color: #eee;
		width: 30upx;
		margin-top: 38upx;
	}
	
	.text-xxl {color: red;}
	.cu-tag {margin: 2px 0; color: #c0c0c0;}
	.cu-item {margin: 10px 0;}
</style>

