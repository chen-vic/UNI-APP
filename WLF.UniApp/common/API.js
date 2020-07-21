const URL = {
	//GET
	'GET.ads': '/api/ads', // 获取广告位
	'GET.cart': '/api/cart', // 获取购物车数据
	'GET.comments': '/api/comments/goods', // 评论列表
	'GET.coupons': '/api/coupons', // 优惠券列表
	'GET.events': '/api/events', // 活动列表
	'GET.express': '/api/express', // 物流公司列表
	'GET.goods': '/api/goods', // 商品列表
	'GET.goodscate': '/api/goods/cate', // 根据分类获取商品列表
	'GET.goodssearch': '/api/goods/search_key', // 搜索商品
	'GET.goodsfavorite': '/api/favorites/my', // 收藏商品
	'GET.goods.favor': '/api/goods/favor', // 商品列表
	'GET.goodsCategory': '/api/goodscategory', // 商品分类
	'GET.goodsCategoryNew': '/api/goodscategory/new', // 商品分类
	'GET.address': '/api/memberaddress', // 收货地址列表
	'GET.addressadd': '/api/memberaddress/addupdate', // 新增或更新收货地址
	'GET.addressupdate': '/api/memberaddress/addupdate', // 新增或更新收货地址
	'GET.mycoin': '/api/membercoin', // 微信登录
	'GET.membercoin': '/api/membercoin', // 福币明细列表
	'GET.memberpoints': '/api/memberpoints', // 积分明细列表
	'GET.consume': '/api/consume', // 消费列表
	'GET.message': '/api/messages', // 消息列表
	'GET.news': '/api/news', // 新闻列表
	'GET.order': '/api/orders', // 订单列表
	'GET.order_detail': '/api/Orders', // 订单详情
	'GET.order_cancel': '/api/orders/cancel/new', // 取消订单
	'GET.myorder': '/api/orders/status', // 获取我的订单
	'GET.pointrecords': '/api/pointrecords', // 积分消费记录列表
	'GET.services': '/api/services', // 贴心服务列表
	'GET.myservices': '/api/serviceorders/my', // 我的贴心服务列表
	'GET.serviceslist': '/api/services/typelist', // 根据分类显示贴心服务列表
	'GET.wxLogin': '/api/wechat/openid', // 微信登录
	// 'GET.detail': '/api/services', // 预约详情
	'GET.serviceTypelist': '/api/services/typelist', // 贴心服务列表-指定类型
	'GET.activity': '/api/events/company', // 团建活动列表
	'GET.events': '/api/events/new', // 推荐团建活动列表
	'GET.myevents': '/api/eventenroll/my', // 我的推荐活动列表
	'GET.meevents': '/api/eventenroll/me', // 我的团建活动
	'GET.venue': '/api/events/venue', // 获取场馆列表
	'GET.eventscompany': '/api/events/company', // 获取公司团建活动列表
	'GET.message': '/api/messages', // 获取消息列表
	'GET.membersinvite': '/api/members/invite', // 获取我邀请用户列表
	'GET.logistics': '/api/express/info',
	'GET.updatestatus':'/api/orders/updatestatus',				//确认收货
	//POST
	'POST.comments': '/api/comments', // 提交评论
	'POST.applogin': '/api/members/applogin', // pc登录
	'POST.update': '/api/members/update', // 授权登陆后更新用户信息
	'POST.cardactive': '/api/cards', // 激活卡号
	'POST.serviceorders': '/api/serviceorders/add',  // 预约服务
	'POST.eventenroll': '/api/eventenroll/add',  // 报名活动
	'POST.addressdel': '/api/memberaddress/del',  // 删除地址
	'POST.orderreturn': '/api/orderreturn',  // 退款
	'POST.orderhurry': '/api/OrderHurry',
	
}
const basicUrl = 'https://api.wanlef.com';
const imgUrl = 'http://img.wanlef.com';
const _token = uni.getStorageInfoSync('_token');

const req = (url, method, params, onSuccess, showToast, isQuery = false) => {
	console.log('URL=' + basicUrl + url);
	//console.log('Paras='+JSON.stringify(params))
	uni.showLoading({
		title: '加载中..'
	});
	
	let option = {
		method: method,
		url: basicUrl + url,
		data: params,
		header: {
			_token: _token || ''
		},
		success(res) {
			//console.log('res=' + JSON.stringify(res));
			if (res.statusCode == 200) {
				let data = res.data;
				if (data.code != 0 && showToast) {
					uni.showToast({
						icon: 'none',
						title: data.msg || '请求失败！',
					})
				}
				onSuccess && onSuccess(data)
			} else if (res.statusCode == 500) {
				uni.showToast({
					icon: 'none',
					title: '服务器异常！',
				})
			} else if (res.statusCode == 404) {
				uni.showToast({
					icon: 'none',
					title: '接口不存在',
				})
			} else if (res.statusCode == 401) {
				uni.showToast({
					title: '授权失败',
				})
			} else if (res.statusCode == 400) {
				uni.showToast({
					icon: 'none',
					title: '异常错误',
				})
			}
		},
		complete() {
			setTimeout(() => {
				uni.hideLoading()
			}, 500)
		}
	}
	
	if(isQuery) {
		option = Object.assign({}, option, {query: params})
	}
	uni.request(option)
}

export default {
	_GET(urlName, params, onSuccess, showToast) {
		let _s = showToast == undefined ? true : showToast;
		req(URL.hasOwnProperty(urlName) ? URL[urlName] : urlName, 'GET', params, onSuccess, _s)
	},
	_GET_ID(urlName, id, onSuccess, showToast) {
		let _s = showToast == undefined ? true : showToast;
		req((URL.hasOwnProperty(urlName) ? URL[urlName] : urlName) + '/' + id, 'GET', {}, onSuccess, _s)
	},
	_POST(urlName, params, onSuccess, showToast) {
		let _s = showToast == undefined ? true : showToast;
		req(URL.hasOwnProperty(urlName) ? URL[urlName] : urlName, 'POST', params, onSuccess, _s)
	},
	_POST_ID(urlName, id, params, onSuccess, showToast) {
		let _s = showToast == undefined ? true : showToast;
		req((URL.hasOwnProperty(urlName) ? URL[urlName] : urlName) + '/' + id, 'POST', params, onSuccess, _s)
	},
	_PUT(urlName, id, params, onSuccess, showToast) {
		let _s = showToast == undefined ? true : showToast;
		req((URL.hasOwnProperty(urlName) ? URL[urlName] : urlName) + '/' + id, 'POST', params, onSuccess, _s)
	},
	_DELETE(urlName, id, params, onSuccess, showToast) {
		let _s = showToast == undefined ? true : showToast;
		req((URL.hasOwnProperty(urlName) ? URL[urlName] : urlName) + '/' + id, 'DELETE', params, onSuccess, _s)
	},
	config: {
		URL,
		basicUrl,
		imgUrl,
		pageSize: 10
	}
}
