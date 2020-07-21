import API from '@/common/API.js'

// 获取消费记录列表
export function apiConsume(pageNum, pageSize) {
	return new Promise((resolute, reject) => {
		try {
			let list = [];
			API._GET('GET.consume', {
				page: pageNum,
				limit: pageSize,
				mid: uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID'),
			}, res => {
				console.log('res=' + JSON.stringify(res));
				if (res.data.length > 0) {
					for (let i = 0; i < res.data.length; i++) {
						list.push(res.data[i]);
					}
				}
				console.log("page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length);
				resolute(list);
			});
		} catch (e) {
			reject(e);
		}
	})
}


// 获取我的地址列表
export function apiAddress(pageNum, pageSize) {
	return new Promise((resolute, reject) => {
		try {
			let list = [];
			API._GET('GET.address', {
				page: pageNum,
				limit: pageSize,
				mid: uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID'),
			}, res => {
				console.log('res=' + JSON.stringify(res));
				if (res.data.length > 0) {
					for (let i = 0; i < res.data.length; i++) {
						list.push(res.data[i]);
					}
				}
				console.log("page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length);
				resolute(list);
			});
		} catch (e) {
			reject(e);
		}
	})
}


// 获取我的订单列表
export function apiOrders(pageNum, pageSize, status, mid) {
	return new Promise((resolute, reject) => {
		try {
			console.log('status='+status);
			let list = [];
			API._GET('GET.myorder', {
				page: pageNum,
				limit: pageSize,
				status: status,
				mid: uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID'),
			}, res => {
				//console.log('res=' + JSON.stringify(res));
				if (res.data.length > 0) {
					for (let i = 0; i < res.data.length; i++) {
						list.push(res.data[i]);
					}
				}
				console.log("page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length);
				resolute(list);
			});
		} catch (e) {
			reject(e);
		}
	})
}

// 获取首页贴心服务列表
export function apiServices(pageNum, pageSize) {
	return new Promise((resolute, reject) => {
		try {
			let list = [];
			API._GET('GET.services', {
				page: pageNum,
				limit: pageSize,
			}, res => {
				console.log('res=' + JSON.stringify(res));
				if (res.data.length > 0) {
					for (let i = 0; i < res.data.length; i++) {
						list.push(res.data[i]);
					}
				}
				console.log("page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length);
				resolute(list);
			});
		} catch (e) {
			reject(e);
		}
	})
}
// 根据分类获取贴心服务列表
export function apiServicesList(pageNum, pageSize, type_id) {
	return new Promise((resolute, reject) => {
		try {
			let list = [];
			API._GET('GET.serviceslist', {
				page: pageNum,
				limit: pageSize,
				type_id: type_id
			}, res => {
				console.log('res=' + JSON.stringify(res));
				if (res.data.length > 0) {
					for (let i = 0; i < res.data.length; i++) {
						list.push(res.data[i]);
					}
				}
				console.log("page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length);
				resolute(list);
			});
		} catch (e) {
			reject(e);
		}
	})
}

// 获取团建活动列表
export function apiEvents(pageNum, pageSize, mid) {
	return new Promise((resolute, reject) => {
		try {
			let list = [];
			API._GET('GET.events', {
				page: pageNum,
				limit: pageSize,
				mid: mid,
			}, res => {
				console.log('res=' + JSON.stringify(res));
				if (res.data.length > 0) {
					for (let i = 0; i < res.data.length; i++) {
						list.push(res.data[i]);
					}
				}
				console.log("page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length);
				resolute(list);
			});
		} catch (e) {
			reject(e);
		}
	})
}

// 获取场馆列表
export function apiEventsVenue(pageNum, pageSize) {
	return new Promise((resolute, reject) => {
		try {
			let list = [];
			API._GET('GET.venue', {
				page: pageNum,
				limit: pageSize,
			}, res => {
				console.log('res=' + JSON.stringify(res));
				if (res.data.length > 0) {
					for (let i = 0; i < res.data.length; i++) {
						list.push(res.data[i]);
					}
				}
				console.log("page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length);
				resolute(list);
			});
		} catch (e) {
			reject(e);
		}
	})
}

// 获取商品列表
export function apiGoods(pageNum, pageSize) {
	return new Promise((resolute, reject) => {
		try {
			let list = [];
			API._GET('GET.goods', {
				page: pageNum,
				limit: pageSize,
			}, res => {
				console.log('res=' + JSON.stringify(res));
				if (res.data.length > 0) {
					for (let i = 0; i < res.data.length; i++) {
						list.push(res.data[i]);
					}
				}
				console.log("page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length);
				resolute(list);
			});
		} catch (e) {
			reject(e);
		}
	})
}

// 获取消息列表
export function apiMessages(pageNum, pageSize) {
	return new Promise((resolute, reject) => {
		try {
			let list = [];
			API._GET('GET.message', {
				page: pageNum,
				limit: pageSize,
			}, res => {
				console.log('res=' + JSON.stringify(res));
				if (res.data.length > 0) {
					for (let i = 0; i < res.data.length; i++) {
						list.push(res.data[i]);
					}
				}
				console.log("page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length);
				resolute(list);
			});
		} catch (e) {
			reject(e);
		}
	})
}

// 小程序我的团建活动
export function apiMeEvents(pageNum, pageSize, mid) {
	return new Promise((resolute, reject) => {
		try {
			let list = [];
			API._GET('GET.meevents', {
				page: pageNum,
				limit: pageSize,
				member_id: mid,
			}, res => {
				console.log('res=' + JSON.stringify(res));
				if (res.data.length > 0) {
					for (let i = 0; i < res.data.length; i++) {
						list.push(res.data[i]);
					}
				}
				console.log("page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length);
				resolute(list);
			});
		} catch (e) {
			reject(e);
		}
	})
}

// 获取我的团建活动列表
export function apiMyEvents(pageNum, pageSize, mid) {
	return new Promise((resolute, reject) => {
		try {
			let list = [];
			API._GET('GET.myevents', {
				page: pageNum,
				limit: pageSize,
				member_id: mid,
			}, res => {
				console.log('res=' + JSON.stringify(res));
				if (res.data.length > 0) {
					for (let i = 0; i < res.data.length; i++) {
						list.push(res.data[i]);
					}
				}
				console.log("page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length);
				resolute(list);
			});
		} catch (e) {
			reject(e);
		}
	})
}

// 获取我的服务列表
export function apiMyServices(pageNum, pageSize, mid) {
	return new Promise((resolute, reject) => {
		try {
			let list = [];
			API._GET('GET.myservices', {
				page: pageNum,
				limit: pageSize,
				member_id: mid,
			}, res => {
				console.log('res=' + JSON.stringify(res));
				if (res.data.length > 0) {
					for (let i = 0; i < res.data.length; i++) {
						list.push(res.data[i]);
					}
				}
				console.log("page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length);
				resolute(list);
			});
		} catch (e) {
			reject(e);
		}
	})
}

// 获取我邀请用户列表
export function apiInviteMembers(pageNum, pageSize, mid) {
	return new Promise((resolute, reject) => {
		try {
			let list = [];
			API._GET('GET.membersinvite', {
				page: pageNum,
				limit: pageSize,
				member_id: mid,
			}, res => {
				console.log('res=' + JSON.stringify(res));
				if (res.data.length > 0) {
					for (let i = 0; i < res.data.length; i++) {
						list.push(res.data[i]);
					}
				}
				console.log("page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length);
				resolute(list);
			});
		} catch (e) {
			reject(e);
		}
	})
}

// 获取搜索商品
export function apiSearchGoods(pageNum, pageSize, keyword) {
	return new Promise((resolute, reject) => {
		try {
			let list = [];
			API._GET('GET.goodssearch', {
				page: pageNum,
				limit: pageSize,
				search_key: keyword,
			}, res => {
				console.log('res=' + JSON.stringify(res));
				if (res.data.length > 0) {
					for (let i = 0; i < res.data.length; i++) {
						list.push(res.data[i]);
					}
				}
				console.log("page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length);
				resolute(list);
			});
		} catch (e) {
			reject(e);
		}
	})
}


// 获取收藏商品
export function apiFavoriteGoods(pageNum, pageSize) {
	return new Promise((resolute, reject) => {
		try {
			let list = [];
			API._GET('GET.goodsfavorite', {
				page: pageNum,
				limit: pageSize,
				mid: uni.getStorageSync('CLOUDIN_WLF_MEMBER_ID'),
			}, res => {
				console.log('res=' + JSON.stringify(res));
				if (res.data.length > 0) {
					for (let i = 0; i < res.data.length; i++) {
						list.push(res.data[i]);
					}
				}
				console.log("page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length);
				resolute(list);
			});
		} catch (e) {
			reject(e);
		}
	})
}

// pc登录
export function apiLoginPc(account, pwd) {
	return new Promise((resolute, reject) => {
		try {
			API._GET('GET.pclogin', {
				uid: account,
				pwd: pwd,
			}, res => {
				resolute(res.data);
			});
		} catch (e) {
			reject(e);
		}
	})
}
