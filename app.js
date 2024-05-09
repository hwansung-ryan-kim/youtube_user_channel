//대장 파일
// express 모듈 호출 
const express = require('express')
const app = express()

app.listen(7777)

const userRouter = require('./routes/users')
const channelRouter = require('./routes/channels')
// channel-demo와 user-demo 호출

app.use("/", userRouter) // users.js에서는 공통 URL이 없기 때문에 '/'를 활용할 필요가 없다. 
app.use("/channels", channelRouter) 
// "/"에 들어가는 값은 기본 URL로 설정되기 때문에
// channels.js에서는 관련된 것들을 "/"로 모두 변경 가능하다.       
