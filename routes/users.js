
// express 모듈 세팅 
const express = require('express')
const router = express.Router() // 유저 전용 라우터
const conn = require('../mariadb') //mariadb.js 안에 connection 모듈을 가져옴 
// app.js 파일에서 호출하기 때문에 필요가 없다. 
// const app = express()
// app.listen(7777)


//로그인
router.use(express.json()) // http 외 모듈 'json'
router.post('/login', (req, res) => {  // userId, pwd

    const {email, password} = req.body; 
    var hasUserId = false 
    let sql = `SELECT * FROM users WHERE email = ?`
    conn.query(
        sql, email,
        function (err, results) {
            var loginUser = results[0];

            if(loginUser && loginUser.password == password) {
                res.status(200).json({
                    message : `${loginUser.name}님 로그인 되었습니다.`
                })
            } else { 
            res.status(400).json({
                message : `이메일 또는 비밀번호가 틀렸습니다.`
            })
        }
        }
    )
})


//회원가입  (id, pwd, name 값이 들어간다)
router.route('/join')
    .post((req, res) => { 

    if (req.body == {}) { 
        res.status(400).json({
            message : `입력이 제대로 되지 않았어요! `
        })

    } else {
        const {email, name, password, contact} = req.body;

        let sql = `INSERT INTO users (email, name, password, contact)
        VALUES (?, ?, ?, ?)`
        let values = [email, name, password, contact]

        conn.query(sql, values,
        
            function(err, results) { 
                res.status(201).json(results)
            }
        )

    }
})


//회원 개별 조회
router.route('/users')  
    .get ((req, res) => { 
        let {email} = req.body

        let sql =  `SELECT * FROM users WHERE email = ?`
        conn.query(sql, email,
            function (err, results) {
                if(results.length) {
                res.status(200).json (results)
            } else { 
                res.status(404).json({
                    message : `찾으시는 회원 정보가 없네요ㅠ.ㅠ`
                })
            }
            }
        );
    })

    //회원 삭제 
router.route('/users')
    .delete ((req, res) => {
        let {email} = req.body

        let sql = `DELETE FROM users WHERE email = ?`
        conn.query(sql, email,
            function (err, results) {
                if(results.length) {
                res.status(200).json (results)
            } else { 
                res.status(404).json({
                    message : `찾으시는 회원 정보가 없네요ㅠ.ㅠ`
                })
            }
            }
        );
    })



//모듈화
module.exports = router 