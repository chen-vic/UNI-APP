<template>
	<view class="container">
		<!--头部图-->
		<view class="carousel">
			<swiper indicator-dots circular="true" duration="400">
				<swiper-item class="swiper-item" v-for="(item, index) in imgList" :key="index">
					<view class="image-wrapper">
						<image :src="item" class="loaded" mode="aspectFill"></image>
						<text>{{item}}</text>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!---->
		<view class="introduce-section">
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price" v-if="goodsSelected">{{goodsPrice}}</text>
				<text class="price" v-else>{{goodsSpecifMoney}}</text>
				<!-- <text class="m-price">¥488</text>
				<text class="coupon-tip">7折</text> -->
			</view>
			<text class="title">{{goodsTitle}}</text>
		</view>

		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec1">
				<text class="tit">已选</text>
				<view class="con-list">
					<text v-if="goodsSelected">请选择规格</text>
					<text v-else>{{goodsSpecifSelected}}</text>
					<text>本商品支持保障服务</text>
				</view>
				<image src="/static/me/ic_more_b.svg" class="ic_pos icon32"></image>
			</view>
			<!-- <view class="c-row b-b">
				<text class="tit">送至</text>
				<view class="con-list">
					<text>{{goodsAddress}}</text>
					<text>23：00前下单，预计明天(02月19日)送达，受全国铁路交通影响，您的订单会延迟派送，请您耐心等待</text>
				</view>
				<image src="/static/me/ic_more_b.svg" class="ic_pos icon32"></image>
			</view>
			<view class="c-row b-b">
				<text class="tit">运费</text>
				<view class="bz-list con"><text>店铺单笔订单不满69元，在线支付运费6元</text></view>
				<image src="/static/me/ic_more_b.svg" class="ic_pos icon32"></image>
			</view> -->
			<view class="c-row b-b">
				<text class="tit">服务</text>
				<view class="bz-list con">
					<image class="ic icon12" src="/static/me/ic_ok.svg" mode=""> 7天无理由退换货</image>
					<image class="ic icon12" src="/static/me/ic_ok.svg" mode=""> 特权保障</image>
				</view>
			</view>
		</view>

		<!-- 评价 -->
		<view class="eva-section" @click="redirectTo(`/pages/comment/comment?goods_id=${goodsID}`)">
			<view class="e-header">
				<text class="tit">评价</text>
				<!-- <text class="red">好评率 99%</text> -->
				<text class="tip">共{{evaluationNum}}条</text>
				<text class="yticon icon-you"></text>
			</view>
			<!-- <view class="eva-box" v-if="IFcomments">
				<view class="right">
					<text class="name">{{evaluationName}}</text>
					<text class="con">{{evaluationRemark}}</text>
					<view class="bot">
						<text class="time">{{evaluationTime}}</text>
                        
					</view>
				</view>
			</view>
            <view class="eva-box" v-else>
                <text class="no-data">该商品暂无评论</text>
            </view> -->
		</view>

		<view class="detail-desc">
			<view class="d-header"><text>图文详情</text></view>
			<!--  v-for="(item,index) in imgList" :key="index" -->
			<!-- <view style="text-align: center;" class="detail-desc_img" v-html="imgUrl"></view> -->
			<!-- imgUrl -->
			<!-- <view >
				<image :src="item" class="loaded" mode="aspectFill"></image>
			</view> -->
			<rich-text class="detail-desc_img" :nodes="imgUrl"></rich-text>
		</view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<!-- <navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator> -->
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-gouwuche"></text>
				<!-- <view class="badge_pos"><uni-badge class="uni-badge-left-margin" :text="shoppingCartNum" type="primary" size="small" /></view> -->
				<text class="badge_pos" v-if="shoppingCartNum > 0">{{shoppingCartNum}}</text>
				<text>购物车</text>
			</navigator>
			<view class="p-b-btn" :class="{ active: favorite }" @click="toFavorite">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view>

			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border add-now-btn" @click="shoppingCartClick">加入购物车</button>
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="buy">立即购买</button>
			</view>
		</view>

		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="imgList[0]"></image>
					<view class="right">
						<text v-if="goodsSelected" class="price">¥{{goodsSpecifications[0].attr_price}}</text>
						<text v-else class="price">¥{{goodsSpecifMoney}}</text>
						<text class="stock">库存：{{goodsObj.goods_amount}}件</text>
						<view class="selected">
							已选：
							<text v-if="goodsSelected" class="selected-text">{{goodsSpecifications[0].attr_name}}</text>
							<text v-else class="selected-text">{{goodsSpecifSelected}}</text>
							<!--  v-for="(sItem, sIndex) in goodsSpecifications"  :key="sIndex" -->
						</view>
					</view>
				</view>
				<view v-for="(item, index) in goodsSpecificationsparent" :key="index" class="attr-list">
					<text>{{ item.attr_name }}</text>
					<view class="item-list">
						<!-- v-if="childItem.pid === item.id" -->
						<text v-for="(childItem, childIndex) in item.children" :key="childItem.attr_id" class="tit" :class="{ selected: childItem.selected }"
						 @click="selectSpec(index, childIndex)">
							{{ childItem.attr_name }}
						</text>
					</view>
				</view>
				<button class="btn" @click="toggleSpecClick">确定</button>
			</view>
		</view>
		<!-- 分享 -->
		<share ref="share" :contentHeight="580" :shareList="shareList"></share>
	</view>
</template>

<script>
	import share from '@/components/share';
	import basicMixins from '@/common/basic-mixins.js';
	import API from '@/common/API.js';
	export default {
		mixins: [basicMixins],
		components: {
			share
		},
		data() {
			return {
				imgUrl:"",
				goodsgSta:'0',	//判断是    1是点击加入购物车弹出的规格界面 2是点击立即购买弹出的规格 3是直接点击规格弹出的规格界面
				goodsSpecif: {}, //已选择商品
				goodsSelected: true,
				goodsSpecifMoney: '', //已选择商品金额
				goodsSpecifSelected: '', //已选择商品名字
				goodsSpecificationsparent: [], //商品规格标准
				goodsSpecifications: [], //商品规格数组内容
				IFcomments: true,
				evaluationTime: "", //评论时间
				evaluationRemark: '', //评论内容
				evaluationName: "", //评论人
				evaluationNum: 0, //评价条数
				shoppingCartID: "", //购物车id
				shoppingCartNum: 0, //购物车数量
				goodsAddress: '', //地址
				goodsTitle: "", //商品名称
				goodsPrice: 0, //商品价格
				goodsID: "", //商品id
				goodsObj: {}, //商品详情
				specClass: 'none',
				specSelected: [],
				favorite: false,
				shareList: [],
				imgList: [],
				imgurl: API.config.imgUrl,
				// imgList: [
				// 	{
				// 		src: 'https://image.dongfangfuli.com/2018/09/26/be92db4a3a2e04abe2e45e3df7687ee5e9b579f650d44ff29aaa4d0e6ed85546.jpg!s498.498'
				// 	},
				// 	{
				// 		src: 'https://image.dongfangfuli.com/2018/09/26/0c8c61ce0c715a9cb70b0c8c727075b9ae34194b24bcd0d5e68a821b5d6ab29a.jpg!s498.498'
				// 	},
				// 	{
				// 		src: 'https://image.dongfangfuli.com/2018/09/26/30f0aa4a9daa46a0248caf60e7be5d7db77ddc3820ab74045616d834c55ee372.jpg!s498.498'
				// 	}
				// ],
				desc: `
					<div style="width:100%">
						<img style="width:100%;display:block;" src="https://image.dongfangfuli.com/2018/09/26/c6acc65bcef67260c98ebf06ba03612c903417f9f0fe296a0afdf9c4c15b62d0.jpg" />
						<img style="width:100%;display:block;" src="https://image.dongfangfuli.com/2018/09/26/3b4ec59cda17c2f935b2733377485f5798a3e210a8a46d9294af6de140533024.jpg" />
						<img style="width:100%;display:block;" src="https://image.dongfangfuli.com/2018/09/26/135d92f77fb07804b77412a7107871a008d71020de750f37bf1fa1740efa2d57.jpg" />
						<img style="width:100%;display:block;" src="hhttps://image.dongfangfuli.com/2018/09/26/8ecf6c98d3caa7660d3630a7efe0d440c446b12cfcd78bcb2397ef9c2f5caf5a.jpg" />
					</div>
				`,
				specList: [{
						id: 1,
						name: '尺寸111111111111111111'
					},
					{
						id: 2,
						name: '颜色111111111111111111111'
					}
				],
				specChildList: [{
						id: 1,
						pid: 1,
						name: 'XS'
					},
					{
						id: 2,
						pid: 1,
						name: 'S'
					},
					{
						id: 3,
						pid: 1,
						name: 'M'
					},
					{
						id: 4,
						pid: 1,
						name: 'L'
					},
					{
						id: 5,
						pid: 1,
						name: 'XL'
					},
					{
						id: 6,
						pid: 1,
						name: 'XXL'
					},
					{
						id: 7,
						pid: 2,
						name: '白色'
					},
					{
						id: 8,
						pid: 2,
						name: '珊瑚粉'
					},
					{
						id: 9,
						pid: 2,
						name: '草木绿'
					}
				]
			};
		},
		created() {
			// this.goodsDetail()
		},
		async onLoad(options) {
			//接收传值,id里面放的是标题，因为测试数据并没写id
			console.log(options)
			this.goodsID = Number(options.id)
			let id = options.id;
			if (id) {
				this.$api.msg(`点击了${id}`);
			}
			this.goodsDetail()
			//规格 默认选中第一条
			this.specList.forEach(item => {
				for (let cItem of this.specChildList) {
					if (cItem.pid === item.id) {
						this.$set(cItem, 'selected', true);
						this.specSelected.push(cItem);
						break; //forEach不能使用break
					}
				}
			});
			// 外部Json文件为测试数据，生产数据待定 DOTO
			// this.shareList = await this.$api.json('shareList');
		},
		methods: {
			redirectTo(url) {
				console.log(url)
				return uni.navigateTo({
					url: url
				});
			},
			//点击加入购物车
			shoppingCartClick() {
				this.goodsgSta = '1'
				let member_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID');
				console.log('member_id=' + member_id);
				if (member_id == '' || member_id == undefined) {
					uni.showModal({
						title: '提示',
						content: '你还没有授权，请先登陆！',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/login/login'
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				} else {
					console.log(this.goodsSelected)
					//POST 'https://api.wanlef.com/api/cart'
					this.toggleSpec()


					// if (!this.goodsSelected) {
					// 	let memberID = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID')
					// 	let params = {
					// 		goods_id: this.goodsID,
					// 		goods_amount: 1,
					// 		member_id: memberID,
					// 		goods_attr: this.goodsSpecif.attr_id
					// 	}

					// 	console.log(params, '/api/cart======')
					// 	console.log('-',this.shoppingCartNum)
					// 	API._POST('/api/cart', params, res => {
					// 		console.log(res)
					// 		if (res.code == 0) {
					// 			this.shoppingCartID = res.data.cart_id
					// 			this.shoppingCartNum++;
					// 			uni.showToast({
					// 				title: '加入购物车成功!'
					// 			});
					// 			console.log('=',this.shoppingCartNum)
					// 		}
					// 	})

					// } else {
					// 	this.toggleSpec()
					// }

				}


			},
			//已选规格 直接购买
			shoppingCart() {

				let member_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID');
				console.log('member_id=' + member_id);

				let params = {
					goods_id: this.goodsID,
					goods_amount: 1,
					member_id: member_id,
					goods_attr: this.goodsSpecif.attr_id
				}
				console.log(params)
				API._POST('/api/cart?is_forced=true', params, res => {
					console.log(res)
					if (res.code == 0) {
						this.shoppingCartID = res.data.cart_id
						this.shoppingCartNum++;
						this.settlement()
					}
				})

			},
			//请求商品详情
			goodsDetail() {
				// https://api.wanlef.com/api/goods/2
				let member_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID');
				let str = member_id?member_id:0
				API._GET('/api/goods/'+this.goodsID+'?member_id='+str,{}, res => {
					console.log(res)
					if (res.code == 0) {
						// commentCount  评论总数
						//comment		评论内容
						this.goodsObj = res.data
						this.goodsTitle = res.data.goods_name
						this.goodsPrice = res.data.shop_price
						this.favorite = res.data.is_favorite
						var reContent= res.data.desc_mobile.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi,function(match,reSrc){
						　　//reSrc,返回每个匹配的字符串
							console.log(reSrc)
						　　var newImg='<img src='+reSrc+' alt="" style="width:100%;" />';
						　　return newImg;
						})
						console.log('reContent', reContent)
						this.imgUrl = reContent
						// this.imgUrl = res.data.desc_mobile
						// this.goodsSpecifications = res.data.attr
                        // 暂时这样解决，后续改为递归
						for (var i = 0; i < res.data.attr.length; i++) {
							if (res.data.attr[i].parent_id == -1) {
								this.goodsSpecificationsparent.push(res.data.attr[i])
							} else {
								this.goodsSpecifications.push(res.data.attr[i])
							}
						}
                        for (let i = 0; i < this.goodsSpecificationsparent.length; i++) {
                            let item = this.goodsSpecificationsparent[i]
                            item.children = []
                            for (let j = 0; j < this.goodsSpecifications.length; j++) {
                                let val = this.goodsSpecifications[j]
                                if (item.attr_id == val.parent_id) {
                                    item.children.push(val)
                                }
                            }
                        }
						this.selectSpec1(0)
						for (var i = 0; i < res.data.goods_photos.length; i++) {
							this.imgList.push(this.imgurl + res.data.goods_photos[i].goods_img)
						}
						this.evaluationNum = res.data.commentCount
						console.log(this.imgList)
						if (res.data.comments_list.length > 0) {
                            let latestComment = res.data.comments_list[this.evaluationNum - 1]
							this.evaluationTime = latestComment.created_at
							this.evaluationRemark = latestComment.comment_content
							this.evaluationName = latestComment.member_name
							this.evaluationNum = res.data.commentCount
						} else {
							this.IFcomments = false
						}
						console.log(this.goodsObj)
					}
				})

			},
			//点击规格里的确定按钮
			toggleSpecClick() {
				// if(this.goodsSelected ) {
				// 	uni.showModal({
				// 		title: '提示',
				// 		content: '请选择规格！',
				// 		success: function(res) {
				// 		}
				// 	});
				// 	return false;
				// }
				this.goodsSelected = false
				console.log('===',this.goodsgSta)
				if (this.goodsgSta == '1') {
					//点击购物车弹出
					// this.shoppingCartClick()
					let memberID = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID')
					let params = {
						goods_id: this.goodsID,
						goods_amount: 1,
						member_id: memberID,
						goods_attr: this.goodsSpecif.attr_id
					}

					console.log(params, '/api/cart======')
					console.log('-',this.shoppingCartNum)
					API._POST('/api/cart', params, res => {
						console.log(res)
						if (res.code == 0) {
							this.shoppingCartID = res.data.cart_id
							this.shoppingCartNum++;
							uni.showToast({
								title: '加入购物车成功!'
							});
							console.log('=',this.shoppingCartNum)
						}
					})
				} else if (this.goodsgSta == '2') {
					//点击立即购买弹出
					this.shoppingCart()
				} else {

				}
				if (this.specClass === 'show') {
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
			},
			//直接点击规格弹出规格弹框
			toggleSpec1() {
				this.goodsgSta = '3'
				if (this.specClass === 'show') {
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
			},
			//规格弹窗开关
			toggleSpec() {
				if (this.specClass === 'show') {
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
			},
			//规格界面出现默认选择第一个
			selectSpec1(index) {
				let list = this.goodsSpecifications;
				this.goodsSpecif = list[index]
				this.goodsSpecifSelected = list[index].attr_name
				this.goodsSpecifMoney = `${list[index].attr_price || 0}`
				uni.setStorageSync('goodsSpecifMoney', this.goodsSpecifMoney);
				list.forEach(item => {
					this.$set(item, 'selected', false);
				});
				this.$set(list[index], 'selected', true);
			},
			//选择规格
			selectSpec(index, childIndex) {
				let list = this.goodsSpecificationsparent[index].children;
				this.goodsSpecif = list[childIndex]
				this.goodsSpecifSelected = list[childIndex].attr_name
				this.goodsSpecifMoney = `${list[childIndex].attr_price || 0}`
				uni.setStorageSync('goodsSpecifMoney', this.goodsSpecifMoney);
				this.goodsSelected = false
                // 所有数据选择状态改为false
                for (let i = 0; i < this.goodsSpecificationsparent.length; i++) {
                    let goodsList = this.goodsSpecificationsparent[i]
                    for (let j = 0; j < goodsList.children.length; j++) {
                        this.$set(goodsList.children[j], 'selected', false)
                    }
                }
				this.$set(list[childIndex], 'selected', true);
				//存储已选择
				/**
				 * 修复选择规格存储错误
				 * 将这几行代码替换即可
				 * 选择的规格存放在specSelected中
				 */
				this.specSelected = [];
				list.forEach(item => {
					if (item.selected === true) {
						this.specSelected.push(item);
					}
				});
			},
			//分享
			share() {
				this.$refs.share.toggleMask();
			},
			//收藏
			toFavorite() {

				let member_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID');
				console.log('member_id=' + member_id);
				if (member_id == '' || member_id == undefined) {
					uni.showModal({
						title: '提示',
						content: '你还没有授权，请先登陆！',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/login/login'
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				} else {
					this.favorite = !this.favorite;
					let params = {
						object_id: this.goodsID,
						favorite_type: 1,
						member_id: member_id,
					}
					API._POST('/api/Favorites', params, res => {
						console.log('res',JSON.stringify(res))
						if (res.code == 0) {
							uni.showToast({
								title: res.msg
							});
						}
					})
				}


			},
			//点击立即购买
			async buy() {
				this.goodsgSta = '2'
				let member_id = uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID');
				console.log('member_id=' + member_id);
				if (member_id == '' || member_id == undefined) {
					uni.showModal({
						title: '提示',
						content: '你还没有授权，请先登陆！',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/login/login'
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				} else {
					//未选规格
					this.toggleSpec()

					// if (!this.goodsSelected) {
					// 	//已选规格
					// 	this.shoppingCart()
					// } else {
					// 	this.toggleSpec()
					// }

				}
			},
			stopPrevent() {},
			// 结算
			async settlement() {
				if (!this.goodsSelected) {
					let _this = this
					setTimeout(function() {
						uni.navigateTo({
							url: '/pages/order/createOrder?goodsMoney=' + _this.goodsPrice + '&shoppingCartID=' + _this.shoppingCartID +
								'&goodsID=' + _this.goodsID
						});
					}, 400)
				} else {
					this.toggleSpec()
				}
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 160upx;
	}

	.icon-you {
		font-size: $font-base + 2upx;
		color: #888;
	}

	.carousel {
		height: 722upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;

		.title {
			font-size: 45upx;
			color: $font-color-dark;
			height: 60upx;
			line-height: 60upx;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			height: 64upx;
			padding: 10upx 0;
			margin-bottom: 16rpx;
			font-size: 26upx;
			color: $uni-color-primary;
		}

		.price {
			font-size: $font-lg + 30upx;
		}

		.m-price {
			margin: 0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}

		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;

			text {
				flex: 1;
			}
		}
	}

	/* 分享 */
	.share-section {
		display: flex;
		align-items: center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;

		.share-icon {
			display: flex;
			align-items: center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position: relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;

			&:after {
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position: absolute;
				background: $uni-color-primary;
			}
		}

		.icon-xingxing {
			position: relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}

		.tit {
			font-size: $font-base;
			margin-left: 10upx;
		}

		.icon-bangzhu1 {
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}

		.share-btn {
			flex: 1;
			text-align: right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}

		.icon-you {
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}

	.c-list {
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;
		border-top: 1rpx solid #eee;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
		}

		.tit {
			width: 140upx;
		}

		.con {
			flex: 1;
			color: $font-color-dark;

			.selected-text {
				margin-right: 10upx;
			}
		}

		.bz-list {
			height: 40upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			display: flex;
			align-items: center;
			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}

		.red {
			color: $uni-color-primary;
		}
	}

	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.tit {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.icon-you {
				margin-left: 10upx;
			}
		}
	}

	.eva-box {
		display: flex;
		padding: 20upx 0;

		.portrait {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;

			.con {
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color: $font-color-light;
			}
		}
	}

	/*  详情 */
	.detail-desc {
		background: #fff;
		margin-top: 16upx;
		width: 100%;
		// margin-bottom: 75upx;
		padding-bottom: 150upx;
		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;
			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}

	.detail-desc_img{
		width: 100%;
		margin-top: 20upx;
		height: 800upx;
        font-size: 0;
	}
	img{
		width: 100%;
		height: 100%;
	}
	/* 规格选择弹窗 */
	.attr-content {
		padding: 10upx 30upx;

		.a-t {
			display: flex;

			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;
			}

			.right {
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;

				.price {
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}

				.selected-text {
					margin-right: 10upx;
				}
			}
		}

		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}

		.item-list {
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}

			.selected {
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;

			.btn {
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100upx;
		border-top: 1rpx solid #eee;
		background: rgba(255, 255, 255, 1);
		/* box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx; */

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;
			position: relative;
			.badge_pos{
				min-width: 32rpx;
				height: 32rpx;
				line-height: 32rpx;
				color: #fff;
				font-size: 12px;
				text-align: center;
				border-radius: 16rpx;
				box-sizing: border-box;
				padding: 0 4rpx;
				position: absolute;
				top: 0;
				right: 0;
				z-index: 99;
				display: inline-block;
				background-color: #f62504;
			}
			.yticon {
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}

			&.active,
			&.active .yticon {
				color: $uni-color-primary;
			}

			.icon-fenxiang2 {
				font-size: 42upx;
				transform: translateY(-2upx);
			}

			.icon-shoucang {
				font-size: 46upx;
			}
		}

		.action-btn-group {
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			margin-left: 70px;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, 0.5);
			}

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base;
				padding: 0;
				border-radius: 100rpx;
				background-color: $base-color;
			}

			.action-btn.buy-now-btn {
				background-color: $uni-color-warning;
			}

			.action-btn.add-now-btn {
				margin-right: 32rpx;
			}
		}
	}

	.redNum {
		width: 25upx;
		height: 30upx;
		color: red;
		text-align: right;
		font-size: bold;
		position: absolute;
		right: 0;
		top: 0;
	}
    
    .no-data {
        font-size: 24rpx;
        color: #888;
    }
</style>
