const express = require('express');
const router = express.Router();
const connection = require('./conn')


/* --- 验证token合法性开始 ---- */ 

	// 引入express-jwt模块 此模块主要用于验证token的合法性
	const expressJwt = require('express-jwt');
	//定义秘钥
	const secret = 'itsource';

	// 验证token合法性（检查用户携带的token是否正确）
	router.use(expressJwt ({
	    secret 
	}).unless({
	    path: ['/login/checklogin']  // 不需要验证的url
	}))

	// 如果token不正确，就会抛出错误，如果错误的名字是“UnauthorizedError” 可以断定就是token无效的错误
	router.use(function (err, req, res, next) {
	    if (err.name === 'UnauthorizedError') {  

	    	// token无效 就给前端浏览器响应401状态码 且响应错误提示信息 
	        res.status(401).send('无效的token，前端发送的请求，必须在请求头上携带token，才能拿到数据哦！');
	    }
	})

/* --- 验证token合法性结尾 ---- */

router.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'authorization') // 允许携带的头
    next();
});

//显示商品
router.get("/goddsList", (req, res) => {
    let {
      pageSize,
      currentPage,
      categories,
      keyword
      ,
    } = req.query;
    pageSize = pageSize ? pageSize : 10;
    currentPage = currentPage ? currentPage : 1;

    let sqlStr = `select * from t_goods where 1=1`

    if(categories =='货币' || categories =='氪金商品'){
     
      sqlStr += ` and categories='${categories}'`;
      console.log(sqlStr);
      
    }
    if(keyword){
      sqlStr +=` AND categories = "${categories}" AND NAME LIKE "%${keyword}%"`
      console.log(sqlStr);
    }
    else{
      
      sqlStr += " order by ctm desc "
      console.log(sqlStr);
      
       
    }
    connection.query(sqlStr, (err, data) => { 
          if (err) throw err;
          let total = data.length;
          let n = (currentPage - 1) * pageSize;
          sqlStr += ` limit ${n}, ${pageSize}`;
          connection.query(sqlStr, (err, data) => {
            if (err) throw err;
            res.send({
              total,
              data,
              // address
            })
          })
        })
    
    
  })
//模糊查询
router.get('/search', (req, res) => {
    let { categories, keyword } = req.query;
    let sqlStr = `select * from t_goods where 1=1`
    if (categories) {
      sqlStr += ` and categories='${categories}'`;
    }
    if (keyword) {
      sqlStr += ` and (name like '%${keyword}%')`
    }
  
    connection.query(sqlStr, (err, data) => {
      if (err) throw err;
      console.log(data);
      
      res.send(data)
    })
  })
//id查询
router.get('/goddsbyid', (req, res) => {
  let { id } = req.query;
  const sqlStr = `select * from t_goods where id='${id}'`;
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    res.send(data);
  })
});
//添加商品
router.post('/addgoods',(req,res) =>{
  let {categories,code,name,address ,id} =req.body;
  console.log(id);
  if(id){
    const sqlStr =`update t_goods set categories='${categories}',code='${code}',name='${name}',address='${address}' where id=${id}`
    connection.query(sqlStr,(err,data) => {
      if(err)throw err;
      if(data.affectedRows >0 ){
        res.send({ "code": 0, "msg": "添加商品成功" });
      }else{
        res.send({ "code": 1, "msg": "添加商品失败" });
      }
    })
  }else{
    const {categories,code,name,address} =req.body;
  const sqlStr = `insert into t_goods(categories, code,name,address) values('${categories}', '${code}','${name}','${address}')`;
  connection.query(sqlStr,(err,data) =>{
     if(err) throw err;
      if(data.affectedRows >0 ){
        res.send({ "code": 0, "msg": "添加商品成功" });
      }else{
        res.send({ "code": 1, "msg": "添加商品失败" });
      }
  
  })
  }
  
        
     

})
//删除商品
router.get('/goodsdelete',(req,res)=>{
  let {
    id
  } = req.query
  const sqlStr = `delete from t_goods where id = ${id}`;
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    if (data.affectedRows > 0) {
      res.send({
        'code': 0,
        "msg": '删除商品成功'
      })
    } else {
      res.send({
        'code': 1,
        "msg": '删除商品失败'
      })

    }
  })
})

module.exports = router;