<template>
	<view>
		<view v-if="!is_logistics">
			<!--步骤条区域 basics < 5 && order_detail.order_status != 6-->
			<view class="bg-white padding solid-top" v-if="false">
				<!--步骤条-->
				<view class="cu-steps">
					<block v-for="(item,index) in basicsList" :key="index">
						<view class="cu-item" :class="index>basics?'':'select'">
							<view class="icon-view" v-if="index>basics">
								<text class="text-red" :class="'cuIcon-' + item.cuIcon"></text>
							</view>
							<view class="bg-red icon-view" v-else>
								<text :class="'cuIcon-' + item.cuIcon"></text>
							</view>
							<view class="text-sm text-black" v-if="index>basics">{{item.name}}</view>
							<view class="text-sm text-black" v-else>{{item.name_s}}</view>
						</view>
					</block>
				</view>

				<!--提示-->
				<view class="text-sm text-center margin-top" v-if="basics == 0">
					<view v-if="order_detail.order_status==5" class="text-black">取消成功。</view>
					<view v-else class="text-black">下单成功，待支付。</view>
				</view>
				<view class="text-sm text-center margin-top" v-if="basics == 1">
					<view class="text-black">支付成功，待商家发货。</view>
				</view>
				<view class="text-sm text-center margin-top" v-if="basics == 2">
					<view class="text-black">已发货，快递正在路上，务必在收到商品后再确认收货。</view>
					<!-- <view class="text-black">
						<text class="text-red">9天23小时57分</text>
						<text>后将自动确认收货</text>
					</view> -->
				</view>
				<view class="text-sm text-center margin-top" v-if="basics == 3 || basics == 13">
					<view class="text-black">给个好评，下次购物更愉快。</view>
				</view>
			</view>

			<!--状态图标-->
			<!-- <view class="bg-white padding solid-top text-center zaiui-status-img-view" v-if="basics == 4 && order_detail.order_status != 13">
				<view class="are-img-view" @tap="cancel = true">
					<image class="are-img" src="/static/zaiui/img/are.png" mode="widthFix" />
				</view>
				<view class="text-sm text-black">交易成功</view>
			</view>
			<view class="bg-white padding solid-top text-center zaiui-status-img-view" v-if="basics == 4 && order_detail.order_status == 13">
				<view class="are-img-view">
					<image class="are-img" src="/static/zaiui/img/are.png" mode="widthFix" />
				</view>
				<view class="text-sm text-black">售后处理中。。</view>
			</view>
			<view class="bg-white padding solid-top text-center zaiui-status-img-view" v-if="basics == 7">
				<view class="are-img-view">
					<image class="are-img" src="/static/zaiui/img/are.png" mode="widthFix" />
				</view>
				<view class="text-sm text-black">订单已退款</view>
			</view>
			<view class="bg-white padding solid-top text-center zaiui-status-img-view" v-if="basics == 8">
				<view class="are-img-view">
					<image class="are-img" src="/static/zaiui/img/are.png" mode="widthFix" />
				</view>
				<view class="text-sm text-black">订单退款已驳回</view>
			</view>
			<view class="bg-white padding solid-top text-center zaiui-status-img-view" v-if="basics == 9">
				<view class="are-img-view">
					<image class="are-img" src="/static/zaiui/img/are.png" mode="widthFix" />
				</view>
				<view class="text-sm text-black">订单退款失败</view>
			</view> -->
			<!--状态图标-->
			<!-- <view class="bg-white padding solid-top text-center zaiui-status-img-view" v-if="basics == 5">
				<view class="are-img-view" @tap="cancel = false">
					<image class="are-img" src="/static/zaiui/img/arg.png" mode="widthFix" />
				</view>
				<view class="text-sm text-black">订单已取消</view>
			</view> -->
			
			<!--基本信息-->
			<view class="bg-white zaiui-card-box">
				<view class="zaiui-card-view zaiui-address-view">
					<view class="text-lg text-bold text-black">基本信息</view>
					<view class="solid-line"></view>
					<view class="cu-list menu-avatar">
						<view class="cu-item">
							<view class="bg-grey icon-view">
								<text class="cuIcon-locationfill" />
							</view>
							<view class="content">
								<view class="text-black">
									<text>收货人：</text>
									<text>{{order_detail.member_name}}</text>
									<text class="margin-left">{{order_detail.member_phone}}</text>
								</view>
								<view class="text-gray text-sm">
									<view class="text_two">{{order_detail.province_name}} {{order_detail.city_name}} {{order_detail.district_name}} {{order_detail.member_address}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!--商品信息-->
			<view class="bg-white zaiui-card-box" v-for="(item, key) in order_detail.goods">
				<view class="zaiui-card-view zaiui-shop-view">
					<view class="shop-info-view">
						<view class="cu-avatar round sm" :style="[{backgroundImage:`url(${imgUrl}${item.goods_img})`}]" />
						<view class="text-black text-bold text-lg title-view" style="overflow: hidden;white-space: nowrap;text-overflow:ellipsis;width: 320px;">{{item.goods_name}}</view>
					</view>
					<view class="goods-list-view">
						<view class="cu-avatar radius" :style="[{backgroundImage:`url(${imgUrl}${item.goods_img})`}]" />
						<view class="goods-info-view" style="position: relative;">
							<view class="text-black text-cut name">{{item.goods_brief}} </view>
							<!-- <view class="text-gray text-sm text-cut introduce">测试介绍内容的</view> -->
							<view class="text-cut tag-view">
								<text class="cu-tag sm line-blue radius">{{item.attr_name}}</text>
							</view>
							<view class="text-price text-red text-lg">{{item.shop_price.toFixed(2)}}</view>
							<view class="refund" v-if="order_detail.pay_status == 3 && basics == 1 && order_detail.order_status ==2">
								<button class="cu-btn refund_btn" @click="confirmDialog(item.og_id)">申请退款</button>
							</view>
                            <view v-if="order_detail.order_status == 4" class="refund">
                                <button class="cu-btn line-black radius" @click="applyService">申请售后</button>
                            </view>
						</view>
					</view>
					<view class="zaiui-foot-view">
						<view class="left-view">
							<text class="text-black">数量 {{item.goods_amount}}</text>
						</view>
						<text class="text-black text-right">￥ {{item.shop_price * item.goods_amount}}</text>
					</view>
					<view style="text-align: right; padding: 5rpx; margin: 10rpx 0;" v-if="basics == 3">
						<text @click="appraiseTap(item)" style="color: red;">我要评价</text>
					</view>
				</view>
			</view>

			<!--商品金额-->
			<view class="bg-white zaiui-card-box">
				<view class="zaiui-card-view zaiui-price-view">
					<view class="text-black title-view">
						<view class="title">福豆总额</view>
						<view class="text-right">
							<text class="text-price">{{order_detail.total_price}}</text>
						</view>
					</view>
					<view class="text-black title-view">
						<view class="title">运费</view>
						<view class="text-right">
							<text class="margin-right-xs">+</text>
							<text class="text-price">0.00</text>
						</view>
					</view>
					<!-- <view class="text-black title-view">
						<view class="title">其他费用</view>
						<view class="text-right">
							<text class="margin-right-xs">+</text>
							<text class="text-price">0.00</text>
						</view>
					</view> -->
					<view class="text-black text-bold title-right-view">
						<text class="margin-right-xs">应付福豆：</text>
						<text class="text-price">{{order_detail.total_price}}</text>
					</view>

					<view class="solid-line"></view>

					<view class="text-center text-black" @click="handleKefu">联系客服</view>
				</view>
			</view>

			<!--订单信息-->
			<view class="bg-white zaiui-card-box">
				<view class="zaiui-card-view zaiui-order-view">
					<view class="text-lg text-bold text-black">订单信息</view>
					<view class="solid-line"></view>
					<view class="text-black title-view">
						<view class="title">订单编号</view>
						<view class="text-right">
							<text class="margin-right-xs">{{order_detail.order_no}}</text>
							<!-- <button class="cu-btn sm line-black">复制</button> -->
						</view>
					</view>
					<view class="text-black title-view">
						<view class="title">订单状态</view>
						<view class="text-right">
							<text>{{order_detail.status_name}}</text>
						</view>
					</view>
					<view class="text-black title-view">
						<view class="title">下单时间</view>
						<view class="text-right">
							<text>{{order_detail.created_at}}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="bg-white zaiui-card-hight-box" />

			<!--底部-->
			<view class="foot-hight-view" />

			<view>
				<view class="bg-white zaiui-footer-fixed zaiui-foot-padding-bottom" v-if="basics == 0 && order_detail.order_status==5">
					<button class="cu-btn line-black radius" @click="callService">客服电话</button>
				</view>
				
				<view class="bg-white zaiui-footer-fixed zaiui-foot-padding-bottom" v-else>
					<button class="cu-btn line-black radius" @click="cancelOrder">取消订单</button>
					<button class="cu-btn bg-red" @click="gotoPay">确认支付</button>
				</view>
			</view>
			
			<view>
				<view class="bg-white zaiui-footer-fixed zaiui-foot-padding-bottom" v-if="order_detail.pay_status == 3 && basics == 1 && order_detail.order_status==6 || basics == 1 && order_detail.order_status==7 || basics == 1 && order_detail.order_status==8 || basics == 1 && order_detail.order_status==9">
					<button class="cu-btn line-black radius" @click="callService">客服电话</button>
				</view>
				<view class="bg-white zaiui-footer-fixed zaiui-foot-padding-bottom" v-else >
					<button class="cu-btn line-black radius" @click="callService">客服电话</button>
					<button v-if="order_detail.order_status == 10" class="cu-btn bg-red" @tap="confirmReceipt">确认收货</button>
					<button v-else-if="order_detail.order_status == 1" class="cu-btn bg-red" @tap="cancelOrder">取消订单</button>
					<!-- <button v-else-if="order_detail.order_status == 5" class="cu-btn bg-red">已取消</button> -->
					<button v-else-if="order_detail.order_status != 5" class="cu-btn bg-red" @click="orderhurry">提醒发货</button>
				</view>
			</view>

			

			<view class="bg-white zaiui-footer-fixed zaiui-foot-padding-bottom" v-if="basics == 2">
				<button class="cu-btn line-black radius" @click="callService">客服电话</button>
				<button class="cu-btn line-black radius" @click="viewLogistics">查看物流</button>
				<button class="cu-btn line-black radius" @click="confirmReceipt">确认收货</button>
			</view>

			<view class="bg-white zaiui-footer-fixed zaiui-foot-padding-bottom" v-if="basics == 3">
				<button class="cu-btn line-black radius" @click="callService">客服电话</button>
				<button class="cu-btn line-black radius" @click="viewLogistics">查看物流</button>
			</view>
			
			<view class="bg-white zaiui-footer-fixed zaiui-foot-padding-bottom" v-if="basics == 4">
				<!-- <button class="cu-btn bg-orange sm" @tap="nextTap">测试下一步</button> -->
				<button class="cu-btn line-black radius" @click="viewLogistics">查看物流</button>
				<button class="cu-btn line-black radius" @click="callService">客服电话</button>
			</view>
			
			<view class="bg-white zaiui-footer-fixed zaiui-foot-padding-bottom" v-if="basics == 13">
				<!-- <button class="cu-btn bg-orange sm" @tap="nextTap">测试下一步</button> -->
				<button class="cu-btn line-black radius" @click="viewLogistics">查看物流</button>
				<button class="cu-btn line-black radius" @click="callService">客服电话</button>
			</view>

			<!--弹出框-->
			<view class="cu-modal bottom-modal" :class="bottomModal?'show':''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white solid-bottom">
						<view class="text-black text-center title">手机安全验证</view>
						<text class="text-gray cuIcon-close close" @tap="closeModalTap"></text>
					</view>
					<view class="bg-white modal-view">
						<view class="content">
							<view class="tel-btn-view">
								<view class="text-black tel-view">验证码已发至：138****8000</view>
								<button class="cu-btn sm" @tap="getCodeKey" v-if="btnKey">获取</button>
								<button class="cu-btn sm" v-else>56s</button>
							</view>
							<view class="text-sm text-black margin-tb">
								<text>确认收货后，交易将结束。您之前付款到平台的</text>
								<text class="text-red">￥1.00</text>
								<text>，将会打给卖家。</text>
							</view>
							<view class="text-sm text-gray margin-bottom">
								提醒:确认收货后钱款将脱离平台,届时平台无法保障您的钱款安全,请务必谨慎点击确认收货，谨防诈骗。
							</view>
							<view class="code-view">
								<text class="code" v-if="!codeKey[0]"> — </text>
								<text class="code" v-else> {{codeKey[0]}} </text>

								<text class="code" v-if="!codeKey[1]"> — </text>
								<text class="code" v-else> {{codeKey[1]}} </text>

								<text class="code" v-if="!codeKey[2]"> — </text>
								<text class="code" v-else> {{codeKey[2]}} </text>

								<text class="code" v-if="!codeKey[3]"> — </text>
								<text class="code" v-else> {{codeKey[3]}} </text>
							</view>
						</view>

						<!--数字键盘-->
						<!-- <view class="num-lock-view">
							<view class="cu-list grid col-3 solid-top">
								<block v-for="(item,index) in 9" :key="index">
									<view class="cu-item" @tap="codeKeyTap(item)">
										<text class="text-black num">{{item}}</text>
									</view>
								</block>
								<view class="cu-item">
									<text class="text-black num"></text>
								</view>
								<view class="cu-item" @tap="codeKeyTap(0)">
									<text class="text-black num">0</text>
								</view>
								<view class="cu-item" @tap="codeKeyDelTap">
									<text class="cuIcon-close close"></text>
								</view>
							</view>
						</view> -->
					</view>
				</view>
			</view>
		</view>
		<view v-else>
			<logistics :wlInfo="wlInfo"></logistics>
		</view>
		<uni-popup ref="dialogInput" type="dialog">
			<uni-popup-dialog mode="input" title="输入原因" value="" placeholder="请输入原因" @confirm="(done, val) => dialogInputConfirm (done, val)"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="dialogCommentInput" type="dialog">
			<uni-popup-dialog mode="input" title="评价" value="" placeholder="请输入评价" @confirm="(done, val) => dialogCommentConfirm (done, val)"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import logistics from '@/components/xinyu-logistics/xinyu-logistics.vue';
	import API from "@/common/API.js";
	
	export default {
		components: {
			uniPopupDialog,
			logistics
		},
		data() {
			return {
				mdl: {
					order_id: 0,
					return_remark: ''
				},
				order_status_arr: [
					{status: 1, msg: '待付款', basics: 0},
					{status: 2, msg: '已支付', basics: 1},
					{status: 3, msg: '待评价', basics: 3},
					{status: 4, msg: '已完成', basics: 4},
					{status: 5, msg: '已取消', basics: 0},
					{status: 6, msg: '退款申请中', basics: 1},
					{status: 7, msg: '退款成功', basics: 1},
					{status: 8, msg: '退款驳回', basics: 1},
					{status: 9, msg: '退款失败', basics: 1},
					{status: 10, msg: '已发货', basics: 2},
					{status: 11, msg: '付款失败', basics: 0},
					{status: 13, msg: '申请售后', basics: 4},
				],
				order_id: 0,
				basics: 0,
				bg_img: '/static/icon_fubi.png',
				avatar: '/static/icon_fubi.png',
				cancel: false,
				is_logistics:false,
				imgUrl: API.config.imgUrl,
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
				basicsList: [{
						cuIcon: 'cartfill',
						name: '未下单',
						name_s: '已下单'
					}, {
						cuIcon: 'card',
						name: '待付款',
						name_s: '已付款'
					},
					{
						cuIcon: 'deliver_fill',
						name: '待收货',
						name_s: '已发货'
					}, {
						cuIcon: 'formfill',
						name: '评价',
						name_s: '评价'
					},
					{
						cuIcon: 'presentfill',
						name: '未完成',
						name_s: '已完成'
					}
				],
				bottomModal: false,
				codeKey: [],
				btnKey: true,
				order_detail: {}
			}
		},
		onLoad(option) {
			this.order_id = option.order_id;
			this.handle()
		},
		onReady() {

			uni.pageScrollTo({
				scrollTop: 0,
				duration: 0
			});
		},
		methods: {
			handle () {
				API._GET_ID('GET.order_detail', this.order_id, res => {
					console.log(res)
					if(res.code == 0) {
						
						this.order_detail = res.data
						let obj = this.order_status_arr.find(item => item.status == res.data.order_status)
						
						this.basics = obj? obj.basics: 0
					}
				})
			},
			//确认支付
			gotoPay(item){
				uni.redirectTo({
					url: '/pages/money/pay?money=' + this.order_detail.total_price + '&orderID=' + parseInt(this.order_detail.order_id)
				})
			},
			nextTap() {
				this.basics = this.basics == this.basicsList.length - 1 ? 0 : this.basics + 1;
			},
			cancelOrder() {
				let params = {order_id: parseInt(this.order_id), member_id: uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID')}
                uni.showModal({
                    content: '是否取消订单?',
                    success: (e) => {
                        if (e.confirm) {
                            API._GET('GET.order_cancel', params, res => {
                            	//取消订单后删除待付款中该项
                            	// let list = this.goods;
                            	// let index = list.findIndex(val=>val.id === item.id);
                            	// index !== -1 && list.splice(index, 1);
                            	
                            	// uni.hideLoading();
                            	this.$api.msg('取消成功！');
                                this.handle()
                            	setTimeout(() => {
                            		uni.navigateBack({
                            			delta: 1
                            		});
                            	}, 10)
                            })
                        }
                    }
                })
			},
			
			orderhurry() {
				let params = {order_id: parseInt(this.order_id), member_id: uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID'),hurry_remark: '',user_id: 0}
				API._POST('POST.orderhurry', params, res => {
					//取消订单后删除待付款中该项
					uni.showToast({
						icon: 'none',
						title: '已提醒卖家发货！',
					})
				})
			},
			
			/**
			 * 打开提交信息
			 */
			confirmCommentDialog() {
				this.$refs.dialogCommentInput.open()
			},
			
			/**
			 * 拨打电话
			 */
			callService() {
				uni.makePhoneCall({
					phoneNumber: '4006107666'
				});
			},
			
			/**
			 * 申请售后
			 */
			applyService() {
				
				let params = {
					id:parseInt(this.order_id),
					status:'13'
				}
				console.log(params)
				API._GET('GET.updatestatus', params, res => {
					console.log('res',res)
					if (res.code == 0) {
						this.$api.msg('申请成功，请耐心等待！');
						setTimeout(() => {
							uni.navigateBack({
								url: `/pages/order/details?order_id=${this.order_id}`
							});
						}, 1000)
					}
				})
			},
			
			/**
			 * 打开提交信息
			 */
			confirmDialog(og_id) {
				this.mdl.order_id = parseInt(this.order_id)
				this.mdl.og_id = og_id
				this.$refs.dialogInput.open()
				// console.log(this.og_id)
			},
			
			confirmReceipt() {
				uni.showModal({
					title: '收货提醒',
					content: '请务必确认已收到商品后再确认收货，让您提前确认收货的都是骗子、不走平台交易的都是骗子、让您私下打款的都是骗子',
					confirmText: '确认收货',
					confirmColor: '#0081ff',
					class: 'zaiui-modal',
					success: res => {
						if (res.confirm) {
							let params = {
								id:parseInt(this.order_id),
								status:'3'
							}
							console.log(params)
							API._GET('GET.updatestatus', params, res => {
								console.log('res',res)
								if (res.code == 0) {
									this.$api.msg('操作成功！');
									setTimeout(() => {
										uni.hideLoading()
										uni.navigateBack({
											url: `/pages/order/details?order_id=${this.order_id}`
										});
									}, 1000)
								}
							})
							// this.bottomModal = true;
						}
					}
				});
			},
			closeModalTap() {
				// this.bottomModal = false;
			},
			codeKeyTap(index) {
				if (this.codeKey.length < 4) {
					this.codeKey.push(index);
				}
			},
			codeKeyDelTap() {
				this.codeKey.pop();
			},
			getCodeKey() {
				this.btnKey = false;
			},
			appraiseTap(row) {
				uni.navigateTo({
					url: `/pages/order/add_appraise?goods_id=${row.og_id}&order_id=${this.order_id}`
				});
			},
			handleKefu() {
				uni.makePhoneCall({
				    phoneNumber: '4006107666' //仅为示例
				});
			},
			viewLogistics(item) {
				uni.navigateTo({
					url: '/pages/logistics/index?order_id=' + this.order_id
				})
				return
				//获取昵称、头像并更新
				console.log(item)
				API._GET('GET.logistics', {
					order_id: parseInt(this.order_id),
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
			// 退单
			returnOrder(item) {
				//
				let params = {order_id: parseInt(item.order_id), og_id: parseInt(item.og_id), member_id: uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID'), return_remark: this.mdl.return_remark}
				console.log(params)
				API._POST('POST.orderreturn', params, res => {
					//取消订单后删除待付款中该项
					// let list = this.goods;
					// let index = list.findIndex(val=>val.id === item.id);
					// index !== -1 && list.splice(index, 1);
					
					// uni.hideLoading();
					this.handle()
				})
			},
			submitComment(params) {
				API._POST('POST.comments', params, res => {
					//取消订单后删除待付款中该项
					// let list = this.goods;
					// let index = list.findIndex(val=>val.id === item.id);
					// index !== -1 && list.splice(index, 1);
					
					// uni.hideLoading();
					this.handle()
				})
			},
			dialogCommentConfirm(done, val) {
				uni.showLoading({
					title: '加载中..'
				})
				
				this.mdl.return_remark = val
				console.log(val);
				setTimeout(() => {
					this.submitComment({member_id: uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID'), object_id: parseInt(this.order_id), object_type: '1', comment_content: ''})
					uni.hideLoading()
					// 关闭窗口后，恢复默认内容
					done()
				}, 3000)
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
					this.returnOrder(this.mdl)
					uni.hideLoading()
					// 关闭窗口后，恢复默认内容
					done()
				}, 3000)
			}
		}
	}
</script>

<style lang="scss">
	@import "../../static/colorui/main.css";
	@import "../../static/colorui/icon.css";
	@import "../../static/zaiui/style/app.scss";
	@import "../../static/zaiui/style/order-details.scss";
</style>
<style scoped>
	.refund{
		position: absolute;
		right: 10rpx;
		bottom: 10rpx;
		font-size: 20rpx;
		background: transparent !important;
	}
	.refund_btn{
		border: 1px solid #333333;
		background: transparent !important;
	}
	.text_two{
		text-overflow: -o-ellipsis-lastline;
		  overflow: hidden;
		  text-overflow: ellipsis;
		  display: -webkit-box;
		  -webkit-line-clamp: 2;
		  line-clamp: 2;
		  -webkit-box-orient: vertical;
	}
	.cu-item{
		height: 120rpx !important;
	}
	.tag-view{
		height: 68rpx !important;
	}
</style>
