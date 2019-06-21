/**
 * 账号管理模块相关的请求
 */

// 引入封装好的 request.js
import axios from '@/utils/request'

/* 账号添加 */
export function accountAdd(params) {
    return axios.post('/addAccount/add',  params)
}

/* 批量删除 */
export function batchDelete(params) {
    return axios.get('/addAccount/batchDelete',  params)
}

/* 编辑 */
export function AccountChange(params) {
    return  axios.get('/addAccount/AccountChange',  params)
}

/* 保存编辑 */
export function AccountSave(params) {
    return  axios.post('/addAccount/AccountSave', params)
}

/* 单条删除 */
export function AccountDel(params) {
    return  axios.get('/addAccount/AccountDel', params )
}

/* 分页请求 */
export function AccountList(params) {
    return  axios.get('/addAccount/AccountList', params)
}
/* 获取信息 */
export function getUserifon(params) {
    return axios.post('/addAccount/getUserinfo',params)
}





