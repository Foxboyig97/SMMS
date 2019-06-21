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

//解决跨越
router.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'authorization') // 允许携带的头
  next();
});
//添加
router.post('/add', (req, res) => {
  // 接收参数
  let {
    username,
    password,
    usergroup
  } = req.body;

  // 准备sql语句
  const sqlStr = `insert into t_userinfo(account, password,usergroup) values('${username}', '${password}','${usergroup}')`;
  // 执行sql
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;

    // 插入的结果data是一个对象 里面有个属性叫affectedRows（受影响的行数）如果大于0 证明至少影响了一行 成功！
    if (data.affectedRows > 0) {
      res.send({
        code: 0,
        msg: '添加成功'
      })
    } else {
      res.send({
        code: 1,
        msg: '注册失败'
      })
    }
  })
})
//用户验证
router.post('/isaccountexist', (req, res) => {
  // 接收账号
  let {
    username
  } = req.body;
  // 已经有的账号
  let accountArr = `select * from t_userinfo where account= '${username}' `;
  connection.query(accountArr, (err, data) => {
    if (err) throw err;
    console.log(data)
    if (data.length) {
      res.send({
        code: 0,
        msg: '用户名存在'
      })
    } else {
      res.send({
        code: 1,
        msg: '可以注册'
      })
    }
  })
  // 如果账号已经存在 响应数据给前端

  // if (accountArr.includes( account )) {
  //   res.send({code: 1, msg: '账号已经存在'})
  // } else {
  //   res.send({code: 0, msg: '可以使用'})
  // }
})
//用户查询--分页
router.get("/AccountList", (req, res) => {
  let {
    pageSize,
    currentPage
  } = req.query;
  pageSize = pageSize ? pageSize : 3;
  currentPage = currentPage ? currentPage : 1;
  let sqlStr = "select * from t_userinfo order by id desc"
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    let total = data.length;
    let n = (currentPage - 1) * pageSize;
    sqlStr += ` limit ${n}, ${pageSize}`;
    connection.query(sqlStr, (err, data) => {
      if (err) throw err;
      res.send({
        total,
        data
      })
    })
  })
})
//删除用户
router.get('/AccountDel', (req, res) => {
  let {
    id
  } = req.query
  const sqlStr = `delete from t_userinfo where id = ${id}`;
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    if (data.affectedRows > 0) {
      res.send({
        'code': 0,
        "msg": '删除数据成功'
      })
    } else {
      res.send({
        'code': 1,
        "msg": '删除数据失败'
      })

    }
  })
})
//编辑用户
router.get("/AccountChange", (req, res) => {
  //接收id
  let {
    id
  } = req.query;
  const sqlStr = `select * from t_userinfo where id = ${id}`;
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    res.send(data)
  });

})
//删除后保存
router.post('/AccountSave', (req, res) => {
  let {
    account,
    editId,
    usergroup
  } = req.body;
  //把数据存入数据库
  const sqlStr = `update t_userinfo set account='${account}',usergroup='${usergroup}' where id=${editId}`;
  console.log(sqlStr);

  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    //如果大于0表示成功
    if (data.affectedRows > 0) {
      res.send({
        "code": 0,
        "msg": "修改用户名成功"
      });
    } else {
      //防护失败对象
      res.send({
        "code": 1,
        "msg": "修改用户名失败"
      });
    }
  });

})
//批量删除
router.get('/batchDelete', (req, res) => {
  let {
    selectedId
  } = req.query;
  console.log(selectedId);

  const sqlStr = `delete from t_userinfo where id in(${selectedId})`;
  console.log(sqlStr);

  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    if (data.affectedRows > 0) {
      res.send({
        "code": 0,
        "msg": "删除数据成功"
      });
    } else {
      res.send({
        "code": 1,
        "msg": "删除数据失败"
      });
    }
  })
})
//检查旧密码
router.post('/checkoldpwd',(req,res) =>{
  let {oldpass,name} =req.body;
  console.log(oldpass,name);
  
  const sqlStr = `select * from t_userinfo where account='${name}' and password='${oldpass}'`;
  connection.query(sqlStr,(err,data) =>{
    if(data.length){
      res.send({'code':0,'msg':'与原密码一直可以修改'})
    }else{
      res.send({'code':1,'msg':'请重新输入原密码'})
    }
  })
})
//保存旧密码
router.post('/saveNewpwd',(req,res) => {
  let {name,oldpass,newpass} =req.body
  const sqlStr = `update t_userinfo set password="${newpass}" where account="${name}" and password="${oldpass}"`
  console.log(sqlStr);
  
  connection.query(sqlStr,(err,data) =>{
    if(err)throw err;
    if(data.affectedRows>0){
      res.send({'code':0,'msg':'修改成功'})
    }else{
      res.send({'code':1,'msg':'修改失败'})

    }
  })
  
})
//获取用户信息
router.post('/getUserinfo',(req,res) =>{
  let {username} = req.body
  let sqlStr = `SELECT * FROM t_userinfo where account = '${username}'`
  connection.query(sqlStr,(err,data) =>{
      if(err) throw err;
      res.send(data)
  })
})


/* -----上传开始---- */ 
// 引入node上传模块
var multer = require('multer');

// 配置存储路径 和 重命名
var storage = multer.diskStorage({
    // 图片上传到服务器以后 要放置的路径
    destination: 'public/upload',

    // 图片重命名
    filename: function (req, file, cb) {
        var fileFormat =(file.originalname).split(".");
        // 获取时间戳
        var filename = new Date().getTime();  
        // 124354654 + "." + jpg
        cb(null, filename + "." + fileFormat[fileFormat.length - 1]);
    }
});

// 上传对象
var upload = multer({
    storage,
});

// 接收上传请求
router.post('/uploadavatar', upload.single('file'), (req, res) => {
    // 接收到的文件信息
    var file = req.file;
   let id = req.user.id
    
  
    let fileName = file.filename
	//拼接文件路径
	let avatarUrl = '/upload/' + fileName
  console.log(avatarUrl);
  
	//构造sql
	const sqlStr = `update t_userinfo set avatarUrl = '${avatarUrl}' where id='${id}'`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({code: 0, reason: "上传成功", avatarUrl})
		} else {
			res.send({code: 1, reason: "上传失败"})
		}
	})
})

/* ----上传结束----- */ 


module.exports = router;