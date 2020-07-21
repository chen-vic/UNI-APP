import API from '@/common/API.js'
import {
	mapState,
	mapMutations
} from 'vuex';

export default {
	data() {
		return {
			statusbarHeight: 0,
			page: 1,
			limit: API.config.pageSize,
			load_more: true,
			screenHeight: 0
		}
	},
	computed: {
		...mapState(['hasLogin', 'userInfo'])
	},
	onLoad() {
		// #ifdef APP-PLUS-NVUE
		this.statusBarHeight = plus.navigator.getStatusbarHeight();
		// #endif
		this.screenHeight = uni.getSystemInfoSync().screenHeight - (this.statusbarHeight || 0)
	},
	computed: {
		// 可见高度
		screenHeightClass() {
			return `height:${this.screenHeight}px;`
		},
		// 不包含 menu 的高度
		scrollHeightClass() {
			return `height: ${this.screenHeight - 60}px`
		},
		scrollHeight() {
			return `height: ${this.screenHeight - 180}px`;
		}
	},
	methods: {
		...mapMutations(['login', 'logout', 'setToken']),
		// 获取用户信息
		getUserInfoHandler(callback) {
			const self = this;
			uni.getUserInfo({
				success(res) {
					if (typeof callback == 'function') {
						callback(res)
					}
				},
				fail() {
					self.$api.msg('登录失败！')
				}
			})
		},
		// 小程序登录
		wxlogin(callback) {
			let self = this;
			uni.login({
				provider: 'weixin',
				success(res) {
					if (res.errMsg == 'login:ok') {
						
						API._GET(
							'GET.wxLogin', {
								code: res.code
							},
							item => {
								if (item.code === 0 && item.data.strJSONDataList != undefined) {
									const info = JSON.parse(item.data.strJSONDataList)
									
									// const ordersStatus = res.data.ordersStatus;
									// const data = JSON.parse(res.data.strJSONDataList);
									// console.log('data=' + data);
									// self.setGD('_token', data.openid, true);
									// self.setGD('session_key', data.session_key, true);
									// self.setGD('access_token', data.access_token, true);
									// self.setToken()

									if (typeof callback === 'function') {
										callback(item);
									}
								}
							}
						);
					} else {
						self.$api.msg('微信授权登录失败！')
					}
				},
				fail(err) {
					uni.hideLoading();
					self.$api.msg('微信授权登录失败！')
				}
			});
		},
		getMembersInfo(){
			
		},
		// 多图片上传
		toUpload(paths, index, name) {
			let self = this;
			let leng = paths.length - 1;
			let path = paths[index];
			if (index == 0) {
				uni.showLoading();
			}
			self.uploadFile(path, res => {
				const result = JSON.parse(res);
				console.log(result)
				if (leng == index) {
					uni.hideLoading();
					uni.showToast({
						title: '文件上传成功！'
					})
				} else if (leng > index) {
					self.toUpload(paths, index + 1, name);
				}
				if (result.code == 0) {
					//self[name].push(result.path)
					self[name][0] = result.path;
				}
			});
		},
		// 单文件上传接口
		uploadFile(filePath, callback) {
			uni.uploadFile({
				url: API.config.basicUrl + API.config.URL['upload'],
				filePath: filePath,
				name: 'file',
				success: uploadFileRes => {
					callback(uploadFileRes.data)
				}
			});
		},
		// 参数序列化
		serialize(params) {
			let arr = [];
			for (let i in params) {
				arr.push(i + '=' + JSON.stringify(params[i]));
			}
			return arr.join("&");
		},
		// 对象转码
		encodeURI(params) {
			return encodeURI(JSON.stringify(params));
		},
		// 对象解码
		decodeURI(params) {
			return JSON.parse(decodeURI(params))
		},
		// 页面跳转
		goPage(path) {
			console.log(path);
			uni.navigateTo({
				url: "/pages/" + path
			})
		},
		goTabPage(path) {
			console.log(path)
			uni.switchTab({
				url: "/pages/" + path
			})
		},
		isPhone(p) {
			if (!/(^1[3|4|5|6|7|8|9][0-9]{9}$)/.test(p)) {
				return false;
			} else {
				return true;
			}
		}
	}
}
