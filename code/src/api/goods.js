/**
 * 账号管理模块相关的请求
 */

// 引入封装好的 request.js
import axios from '@/utils/request'

/* 账号添加 */
export function addgoods(params) {
    return axios.post('/commodity/addgoods',  params)
}

/* 显示商品 */
export function goddsList(params) {
    return axios.get('/commodity/goddsList',  params)
}

/* 模糊查询 */
export function search(params) {
    return  axios.get('/commodity/search',  params)
}

/* 编辑 */
export function goddsbyid(params) {
    return  axios.get('/commodity/goddsbyid', params )
}

/* 分页请求 */
export function goodsdelete(params) {
    return  axios.get('/commodity/goodsdelete', params)
}






