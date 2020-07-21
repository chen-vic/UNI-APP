import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const setST = (key, data) => {
	uni.setStorage({
		key,
		data
	})
}
const getST = (key) => {
	return uni.getStorageSync(key)
}
const clearST = (key) => {
	uni.removeStorage({
		key
	})
}

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: getST('CLOUDIN_WLF_USERINFO') || {},
		_token: '',
	},
	mutations: {
		setToken(state, token) {
			state._token = token;
			setST('_token', token)
		},
		login(state, provider) {
			state.hasLogin = true;
			store.commit('setUserInfo', provider)
		},
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo
            //缓存用户信息
            setST('CLOUDIN_WLF_USERINFO', userInfo)
        },
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			clearST('userInfo')
		}
	},
	actions: {

	}
})

export default store
