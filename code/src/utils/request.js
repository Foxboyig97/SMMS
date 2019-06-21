/**
 * axios发送请求函数封装
 */

// 引入axios
import axios from 'axios'
// 引入qs
import qs from 'qs';

// 设置请求默认服务器地址
axios.defaults.baseURL = 'http://172.16.12.221:5000'

// 请求拦截器
axios.interceptors.request.use(config => {
    // 获取token
    let token = window.localStorage.getItem('token')

    // 给头部携带token
    config.headers.authorization = `Bearer ${token}` 
    return config
})

export default {
    get(url, params={}) {
       return new Promise((resolve, reject) => {
            axios.get(url, { 
                params
            })
                .then(response => {
                    resolve(response.data)   // 成功
                })
                .catch(err => {
                    reject(err)   // 失败
                })
       })
    },
    post(url, params={}) {
        return new Promise((resolve, reject) => {
            axios.post(url, qs.stringify( params ))
                .then(response => {
                    resolve(response.data)   // 成功
                })
                .catch(err => {
                    reject(err)   // 失败
                })
        })
    }
}

