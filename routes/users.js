
// express 모듈 세팅 
const express = require('express')
const router = express.Router() // 유저 전용 라우터

// app.js 파일에서 호출하기 때문에 필요가 없다. 
// const app = express()
// app.listen(7777)

let db = new Map() 
var id = 1 // 하나의 객체를 primary key 용도로 사용 

//로그인
router.use(express.json()) // http 외 모듈 'json'
router.post('/login', (req, res) => {  // userId, pwd

    // userId가 DB에 저장된 회원인지 확인하셔야 
    const {userId, password} = req.body; 
    var hasUserId = false 
    loginUser = {}

    db.forEach(function(user, id) {
        // a : 데이터 => map의 요소는 {객체}
        // b : 인덱스
        // c : 전체 Map 
        if (user.userId === userId) {
            loginUser = user
        }
    })

    // userID 값을 못 찾았으면..
    if(isExist(loginUser)){    // 객체에 값이 있으면
        // pwd도 맞는지 비교 
        if (loginUser.password === password) {   // forEach문에 있던 user를 쓰는 것이기 때문에 오류가 뜸!
            res.status(200).json({
                message : `${loginUser.name}님 로그인 되었습니다.`
            })
        } else {                
            res.status(400).json({
                message : `비밀번호가 틀렸습니다.`
            })
        }
    } else { 
        res.status(404).json({
            message : `회원정보가 없습니다.`
        })
    }
})

function isExist(obj) { 
    if (Object.keys(loginUser).length) { 
        return true
    } else { 
        return false
    }
}


//회원가입  (id, pwd, name 값이 들어간다)
router.post('/join', (req, res) => { 

    if (req.body.name !== undefined) { 
        const {userId} = req.body
        db.set(userId, req.body)
        res.status(201).json({
            message : `${db.get(userId).name}님 환영해요!`
        }) 

    } else {
        res.status(400).json({
            message : `입력이 제대로 되지 않았어요! `
        })
    }
})


//회원 개별 조회
// '/users/:id'가 겹친다 => routing! 즉 길이 나뉜다!
router.route('/users')     // url이 들어오면 앞으로 이렇게 작동해줘~ 
    .get ((req, res) => { 
        let {userId} = req.body
        const user = db.get(userId)
        
        if (user) { 
            res.status(200).json ({ 
                userID : user.userId,
                name : user.name 
            })
        } else { 
            res.status(404).json({
                message : `찾으시는 회원 정보가 없네요ㅠ.ㅠ`
            })
        }
    })

    //회원 삭제 
router.route('/users')
    .delete ((req, res) => {
    let {userId} = req.body
    const user = db.get(userId)

    if (user) { 
        db.delete(userId)
        res.status(200).json ({ 
            message : `${user.name}님, 다음에 또 뵙겠습니다!`
        })
    } else { 
        res.status(404).json({
            message : `찾으시는 회원 정보가 없네요ㅠ.ㅠ`
        })
    }
    })



//모듈화
module.exports = router 