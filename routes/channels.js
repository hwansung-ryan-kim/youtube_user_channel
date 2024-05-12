const express = require('express')
const router = express.Router()
const conn = require('../mariadb') //mariadb.js 안에 connection 모듈을 가져옴 


let db = new Map() 
var id = 1 // 하나의 객체를 primary key 용도로 사용 


//데이터가 없을 때 
function notFoundChannel(res) {
    res.status(404).json({
        message : `등록된 채널이 없습니다. `})
}


//route로 만들기 
router.route('/')
    // Retrieve all channels
    .get((req, res) => {
        const { userId } = req.body;

        let sql = `SELECT * FROM channels WHERE id = ?`;
        if (userId) {
            conn.query(sql, userId, (err, results) => {
                if (results.length) {
                    res.status(200).json(results);
                } else {
                    res.status(400).end(); // Redirects here if userID is falsy during short-circuit evaluation
                }
            });
        }
    });
  


    // 채널 개별 생성  == db에 저장 
    router
    .route('/') 
    .post((req,res) => { 

        const {name, userId} = req.body 

        if (name && userId){
        let channel = req.body // name, user_id

        let sql = `INSERT INTO users (name, user_id)
        VALUES (?, ?)`
        let values = [name, userId]

        conn.query(sql, values,
        
            function(err, results) { 
                res.status(201).json(results)
            }
        )

    } else { 
        res.status(400).json({
            message : `채널명을 입력해주세요!`
        })
    }


    })  
    


// 채널 개별 조회 
router
    .route('/:id')
    .get((req,res) => { 
       let {id} = req.params  // const는 상수이기 때문에 바꿀 수 없다.
       id = parseInt(id)
       
       let sql =  `SELECT * FROM channels WHERE id = ?`
       conn.query(sql, id,
           function (err, results) {
               if(results.length) {
                    res.status(200).json (results)
              } else { 
                notFoundChannel(res)   
           }
           }
       );

    }) 


    //채널 수정 

    .put((req,res) => { 
        let {id} = req.params  // const는 상수이기 때문에 바꿀 수 없다.
        id = parseInt(id)
        var channel = db.get(id)
        var oldTitle = channel.channelTitle 

        if(channel) {
            var newTitle = req.body.channelTitle

            channel.channelTitle = newTitle
            db.set(id, channel)

            res.status(200).json({
                message : `채널명이 정상적으로 수정되었습니다. 기존 ${oldTitle}에서 ${newTitle}로 수정 완료`
            })

        } else { 
            notFoundChannel(res)
        }


    }) // 채널 개별 수정


    .delete((req,res) => { 
        let {id} = req.params  // const는 상수이기 때문에 바꿀 수 없다.
        id = parseInt(id)
        
        var channel = db.get(id)
        var channelTitle = channel.channelTitle
        if (channel) {
            db.delete(id)

            res.status(200).json({
                message : `${channelTitle}이 정상적으로 삭제되었습니다. `
            })
         } else { 
             res.status(404).json({
                message : `요청하신 정보를 찾을 수 없습니다!`
             })
        }
    }) // 채널 개별 삭제 

    module.exports = router 