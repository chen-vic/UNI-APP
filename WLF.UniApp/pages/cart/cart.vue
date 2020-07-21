<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="empty === true || !is_login" class="empty">
			<image src="/static/empty_cart.png" mode="aspectFit"></image>
			<view v-if="is_login" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="is_login" url="../index/index" open-type="switchTab">随便逛逛></navigator>
			</view>
			<view v-else class="empty-tips flex-row justify-center align-center">
				空空如也
				<!-- #ifdef H5 -->
				<view class="navigator" @click="navToLogin">去登陆></view>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<button class="login" open-type="getUserInfo" @getuserinfo="wxGetUserInfo">去登录</button>
				<!-- #endif -->
				<!-- #ifdef APP-PLUS -->
				<view class="navigator" @click="navToLogin">去登录</view>
				<!-- #endif -->
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="item.id">
					<view class="cart-item" :class="{ 'b-b': index !== cartList.length - 1 }">
						<view class="yticon icon-xuanzhong2 checkbox" :class="{ checked: item.checked }" @click="check('item', index)"></view>
						<view class="image-wrapper">
							<!-- :class="[item.loaded]" -->
							<image :src="imgUrl+item.goods_img" class="loaded" mode="aspectFill" @load="onImageLoad('cartList', index)"
							 @error="onImageError('cartList', index)"></image>
						</view>
						<view class="item-right">
							<text class="clamp title">{{ item.goods_name }}</text>
							<text class="attr">{{ item.attr_val }}</text>
							<text class="price text_one" style="font-size: 24rpx;">{{ item.attr_name}}</text>
							<view class="flex justify-between" style="margin-top: 10rpx;">
								<text class="price" style="color: rgb(227,62,36);">{{ item.attr_price?item.attr_price:item.goods_price }}</text>
								<!-- :isMax="item.goods_amount >= item.stock ? true : false" :isMin="item.goods_amount === 1" -->
								<uni-number-box class="step" :min="1" :max="99" :value="item.goods_amount"
								  :index="index" @eventChange="numberChange($event)"></uni-number-box>
							</view>
						</view>
						<text class="del-btn yticon icon-fork" @click="deleteCartItem(index)"></text>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section">
				<view class="checkbox">
					<image :src="allChecked ? '/static/selected.png' : '/static/select.png'" mode="aspectFit" @click="check('all')"></image>
					<view class="clear-btn" :class="{ show: allChecked }" @click="clearCart">清空</view>
				</view>
				<view class="total-box">
					<text class="price">{{ total }}</text>
					<text class="coupon">已优惠<text>0</text>福豆</text>
				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNumberBox from '@/components/uni-number-box.vue';
	import basicMixins from '@/common/basic-mixins.js';
	import API from '@/common/API.js';
	export default {
		mixins: [basicMixins],
		components: {
			uniNumberBox
		},
		data() {
			return {
				imgUrl: API.config.imgUrl,
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: [],
				is_login: false,
                page: 1, // 当前页
                count: 0, //  总条数
			};
		},
		onLoad(option) {
			this.is_login = option.is_login
		},
		onShow() {
            this.page = 1
			let get_member_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID');
			console.log('get_member_id='+get_member_id);
			if (get_member_id =='' || get_member_id==undefined) {
				// #ifdef MP
				this.empty = true;
				this.is_login = false;
				this.getOpenId();
				// #endif
			} else {
				this.empty = false;
				this.is_login = true;
                this.cartList = []
				this.loadData();
				this.allChecked = false
				this.total = 0
			}
		},
        onPageScroll() {
            if (this.page < Math.ceil(this.count/10)) {
                this.page++
            } else {
                this.loadData()
            }
        },
		watch: {
			//显示空白页
			cartList(e) {
				console.log(e)
				if (e) {
					let empty = e.length === 0 ? true : false;
					if (this.empty !== empty) {
						this.empty = empty;
					}
				}
			}
		},
		methods: {
			
			//获取OPENID
			async getOpenId() {
				//
				await uni.login({
					success: res => {
						console.log('code=' + res.code);
						API._GET('GET.wxLogin', {
							code: res.code
						}, (res) => {
							console.log('msg=' + res.msg);
							if (res.code == 0) {
								console.log('res=' + JSON.stringify(res));
								this.wechatData = res.data;
								console.log('openid=' + this.wechatData.openid);
							}
						})
					}
				});
			},

			//授权获取用户昵称或头像
			wxGetUserInfo: function(res) {
				if (!res.detail.iv) {
					uni.showToast({
						title: "您取消了授权,登录失败",
						icon: "none"
					});
					return false;
				} else {
					//console.log('detail=' + JSON.stringify(res.detail));
					console.log('avatarUrl=' + res.detail.userInfo.avatarUrl);
					console.log('nickName=' + res.detail.userInfo.nickName);
					console.log('gender=' + res.detail.userInfo.gender);
					console.log('city=' + res.detail.userInfo.city);
					console.log('province=' + res.detail.userInfo.province);
					console.log('country=' + res.detail.userInfo.country);

					uni.setStorageSync('CLOUDIN_WLF_MEMBER_OPENID', this.wechatData.openid);
					uni.setStorageSync('CLOUDIN_WLF_MEMBER_AVATAR', res.detail.userInfo.avatarUrl);
					uni.setStorageSync('CLOUDIN_WLF_MEMBER_NAME', res.detail.userInfo.nickName);

					//获取昵称、头像并更新
					API._POST('POST.update', {
						open_id: this.wechatData.openid,
						member_avatar: res.detail.userInfo.avatarUrl,
						member_name: res.detail.userInfo.nickName,
						real_name: res.detail.userInfo.nickName,
						member_gender: '' + res.detail.userInfo.gender,
					}, res => {
						if (res.code == 0) {
							this.is_login = true;
							this.getMemberInfo();
							console.log('msg=' + res.msg);
						}
					});

				}

			},

			//获取会员信息
			async getMemberInfo() {
				// #ifndef MP
				let open_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_OPENID');
				await API._POST('/api/members/applogin?openid=' + open_id, null, res => {
					if (res.code == 0) {
						console.log('member_id=' + res.data.member_id);
						uni.setStorageSync('CLOUDIN_WLF_MEMBER_ID', res.data.member_id);
						uni.setStorageSync('CLOUDIN_WLF_COMPANY_ID', res.data.company_id);
						uni.setStorageSync('CLOUDIN_WLF_QRCODE', res.data.member_qrcode);
						uni.setStorageSync('CLOUDIN_WLF_MEMBER_STATUS', res.data.member_status);
				
					}
				});
				// #endif
			},

			//请求数据
			async loadData() {
				let memberID = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID')
				if(memberID){
					API._GET('/api/cart/me',{page: this.page,limit:10,member_id:memberID},res=>{
						console.log(res)
                        this.count = res.count
						for(var i = 0 ; i < res.data.length ; i++){
                            if (this.allChecked) {
                                res.data[i].checked = true
                            } else {
                                res.data[i].checked = false
                            }
						}
                        this.cartList = [...this.cartList, ...res.data]
                        this.calcTotal(); //计算总价
					})
				}
			},
			//请求数据
			async loadData1() {
				let memberID = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID')
				if(memberID){
					API._GET('/api/cart/me',{page:1,limit:10,member_id:memberID},res=>{
						console.log(res)
			
						for(var i = 0 ; i < res.data.length ; i++){
							res.data[i].checked = false
						}
						this.cartList = res.data;
					})
				}
			},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
			navToLogin() {
				uni.navigateTo({
					url: '/pages/public/login'
				});
			},
			//选中状态处理
			check(type, index) {
				console.log(type)
				if (type === 'item') {
					this.cartList[index].checked = !this.cartList[index].checked;
				} else {
					const checked = !this.allChecked;
					const list = this.cartList;
					list.forEach(item => {
						item.checked = checked;
					});
					this.allChecked = checked;
				}
				this.calcTotal(type);
			},
			//数量
			numberChange(data) {
				// /api/cart/amount?card_id&is_add=true
				console.log(data)
				let cart_id = this.cartList[data.index].cart_id
				API._POST(`/api/cart/amount?card_id=${cart_id}&amount=${data.number}`,{}, res => {
				  console.log(res)
				  if (res.code == 0) {
				    this.calcTotal();
				  }
				})
				this.cartList[data.index].goods_amount = data.number;
			},
			//删除
			deleteCartItem(index) {
                let list = this.cartList;
                let row = list[index];
                let id = row.cart_id;
                console.log(list,'---',row,'---',id)
                uni.showModal({
                    content: '是否删除？',
                    success: e => {
                        if (e.confirm) {
                            // /api/cart/del/{id}
                            API._POST_ID('/api/cart/del',id,{}, res => {
                              console.log(res)
                              if (res.code == 0) {
                                uni.showToast({
                                  title: "删除成功",
                                });
                                this.cartList.splice(index, 1);
                                this.calcTotal();
                              }
                            })
                        }
                    }
                })
			},
			//清空
			clearCart() {
				let memberID = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID')
				uni.showModal({
					content: '清空购物车？',
					success: e => {
						if (e.confirm) {
							this.cartList = [];
							API._POST('/api/cart/removeme?member_id='+memberID,{}, res => {
							  console.log(res)
							  if (res.code == 0) {
							    uni.showToast({
							      title: "清空购物车成功!",
							    });
							  }
							})
						}
					}
				});
			},
			//计算总价
			calcTotal() {
				let list = this.cartList;
				console.log('list',list)
				if (list.length === 0) {
					this.empty = true;
					return;
				}
				console.log(list)
				let total = 0;
				let checked = true;
				list.forEach(item => {
					if (item.checked === true) {
						total += item.attr_price * item.goods_amount;
					} else if (checked === true) {
						checked = false;
					}
				});
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
			},
			//创建订单
			createOrder() {
				let list = this.cartList;
				console.log(list)
				let goodsData = [];
				list.forEach(item => {
					if (item.checked) {
						goodsData.push({
							// attr_val: item.attr_val,
							title:item.goods_name,
							number: item.goods_amount,
							price: item.goods_price.toFixed(2),
							id:item.cart_id
						});
					}
				});
				console.log(goodsData)
				if (goodsData.length <= 0) {
					uni.showToast({
						title: '请选择商品!',
						icon: "none"
					});
					return
				}
				let idArr = []
				for(var a = 0;a < goodsData.length;a ++){
					idArr.push(goodsData[a].id)
				}
				console.log(idArr)
				let ids = idArr.join(",")
				console.log(ids)
				///api/cart/goods?ids=cart_ids
				API._GET('/api/cart/goods',{ids:ids},res=>{
					console.log(res)
					if (res.code == 0) {
						uni.navigateTo({
							url: `/pages/order/createOrder?data=${JSON.stringify({
							goodsData: goodsData})}&status=shop&page=${this.page}`
						});
					}
				})

				// this.$api.msg('跳转下一页 sendData');

			}
		}
	};
</script>

<style lang="scss">
	.container {
		padding-bottom: 134upx;

		/* 空白页 */
		.empty {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100vh;
			padding-bottom: 100upx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			background: #fff;

			image {
				width: 240upx;
				height: 160upx;
				margin-bottom: 30upx;
			}

			.empty-tips {
				display: flex;
				font-size: $font-sm + 2upx;
				color: $font-color-disabled;

				.navigator {
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}

	/* 购物车列表项 */
	.cart-item {
		display: flex;
		position: relative;
		padding: 30upx 20upx;

		.b-b:after {
			border: none;
		}

		.image-wrapper {
			width: 176upx;
			height: 176upx;
			flex-shrink: 0;
			position: relative;

			image {
				border-radius: 8upx;
			}
		}

		.checkbox {
			/* position:absolute;
			left:-16upx;
			top: -16upx;
			z-index: 8; */
			margin-top: 60upx;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background: #fff;
			border-radius: 50px;
		}

		.item-right {
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position: relative;
			padding-left: 30upx;

			.title,
			.price {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}

			.attr {
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}

			.price {
				height: 50upx;
				line-height: 50upx;
			}
		}

		.del-btn {
			padding: 4upx 10upx;
			font-size: 34upx;
			height: 50upx;
			color: $font-color-light;
		}
	}

	/* 底部栏 */
	.action-section {
		/* #ifdef H5 */
		margin-bottom: 100upx;
		/* #endif */
		position: fixed;
		left: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 690upx;
		height: 100upx;
		padding: 0 30upx;
		background: rgba(255, 255, 255, 0.98);
		box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
		border-radius: 16upx;

		.checkbox {
			height: 52upx;
			position: relative;

			image {
				width: 52upx;
				height: 100%;
				position: relative;
				z-index: 5;
			}
		}

		.clear-btn {
			position: absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius: 0 50px 50px 0;
			display: none;
			transition: 0.2s;

			&.show {
				display: block;
				width: 120upx;
			}
		}

		.total-box {
			flex: 1;
			display: flex;
			flex-direction: column;
			text-align: right;
			padding-right: 40upx;

			.price {
				font-size: $font-lg;
				color: $base-color;
			}

			.coupon {
				font-size: $font-sm;
				color: $font-color-light;

				text {
					color: $font-color-dark;
				}
			}
		}
		
		.confirm-btn {
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
		}
	}
	
	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked {
		color: $uni-color-primary;
	}

	.login {
		margin-left: 20rpx;
	}
	.text_one{
		 white-space: nowrap;
		    text-overflow: ellipsis;
		    overflow: hidden;
	}
</style>
