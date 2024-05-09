const express = require('express')
const router = express.Router()

let db = new Map() 
var id = 1 // 하나의 객체를 primary key 용도로 사용 

//route로 만들기 

router
    .route('/')  // app.js에 "/channels"를 빼놨다.
    // 채널 전체 조회
    .get((req,res) => { 
        var {userId} = req.body 
        var channels = []    // json 형태는 [{}, {}, {}]] 형식으로!

        if(db.size && userId) {
                 db.forEach(function(value, key) {  
                  if (value.userId === userId) {    // channels가 배열인데, db의 key가 1부터 시작되므로 수정되어야 한다! 
                    channels.push(value)
                        }
                    })

                    if (channels.length) {
                        res.status(200).json(channels)
                    } else {
                        notFoundChannel(res)
                    }
            } else {
                notFoundChannel(res)
            }
        })
            // 예외 처리 2가지
            // 1) user Id가 body에 없으면 => my page를 통해서 들어오기 때문에 그럴 일은 없지만
            // 예외적으로 로그인이 풀린 상태에서 해당 URL로 들어가게 되면 body가 없는 상태가 된다. 
            // => 로그인 페이지로 이동!

            // 2) user Id가 가진 채널이 없으면 
            // 마찬가지로 로그인 페이지로 이동! 


function notFoundChannel(res) {
    res.status(404).json({
        message : `등록된 채널이 없습니다. `})
}



  


    // 채널 개별 생성  == db에 저장 
    router
        .post((req,res) => { 
        if (req.body.channelTitle){
        let channel = req.body

        db.set(id++, channel);

        res.status(201).json({
            message : `${db.get(id-1).channelTitle}채널을 응원합니다!`
        })

    } else { 
        res.status(400).json({
            message : `채널명을 입력해주세요!`
        })
    }


    })  
    

router
    .route('/:id')

    .get((req,res) => { 
       let {id} = req.params  // const는 상수이기 때문에 바꿀 수 없다.
       id = parseInt(id)
       
       var channel = db.get(id)
       if (channel === undefined) {
           notFoundChannel(res)
       } else { 
            res.status(200).json(channel)
       }

    }) // 채널 개별 조회 


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