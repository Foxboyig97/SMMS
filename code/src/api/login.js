/**
 * 登录模块相关的请求
 */

// 引入封装好的 request.js
import axios from '@/utils/request'

/* 检查用户名和密码是否正确 */
export function checkLogin(params) {
    return axios.post('/login/checklogin',  params)
}

