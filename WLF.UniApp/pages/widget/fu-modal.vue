<template>
    <view class="modal">
        <view class="con">
            <image class="fu" src="../../static/fu.png" mode="aspectFit"></image>
            <view class="btn" @click="toUrl">兑换福利</view>
        </view>
        <image class="close" src="../../static/close.png" mode="aspectFit" @click="close"></image>
    </view>
</template>

<script>
    export default {
        data () {
            return {}
        },
        methods: {
            close() {
                this.$emit('close')
            },
            toUrl() {
                this.$emit('close')
                uni.navigateTo({
                    url: '/pages/coin/activation/activation'
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modal {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, .5);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999;
        .con {
            position: relative;
            display: flex;
            justify-content: center;
            .fu {
                width: 628rpx;
                height: 640rpx;
            }
            @keyframes animation {
                0% {
                	transform: scale(1);
                }
                100% {
                	transform: scale(1.1);
                }
            }
            .btn {
                position: absolute;
                left: calc(50% - 160rpx);
                bottom: 18rpx;
                width: 360rpx;
                height: 90rpx;
                line-height: 90rpx;
                text-align: center;
                font-size: 40rpx; 
                color: #fff;
                background: url(../../static/fu_button.png) no-repeat;
                background-size: cover;
                animation: animation .5s ease-in infinite both alternate;
            }
        }
        .close {
            margin-top: 60rpx;
            width: 80rpx;
            height: 80rpx;
        }
    }
</style>