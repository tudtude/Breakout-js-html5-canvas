let ball, brick, display, GameStart, lives, numberBrick, paddle, score
let running = false
let paused = false
let gameOver = false
let ballHitCount = 0


// Setup display
display = document.getElementById('display').getContext('2d')
display.width = 500
display.height = 500


//------------------------------ Setup object ----------------------------------
ball = {
    x: 0,
    y: 0,
    radius: 10,
    color: 'darkred',
    update: ballUpdate,
    speedX: 1,
    speedY: -1,
    show: ballShow
}

paddle = {
    x: 150,
    y: 400,
    height: 5,
    width: 100,
    color: 'yellow',
    show: paddleShow,
    update: paddleUpdate,
    moveLeft: false,
    moveRight: false
}

brick = {
    x: 5,
    y: 10,
    height: 20,
    width: 90,
    brickList: [],
    show: brickShow,
    color: 'green',
    number: -1,
    update: brickUpdate,
    row: 3,
    column: 5
}

//-------------------------------- End setup object-----------------------------


// init display when start first time
initDisplay()

// connect to html buttom
function buttonStart() {
    if (running ) {
        return false
    } else {
        startGame()
    }
}

//---------------------------Recive Input from Keyboard--------------------------------
document.onkeydown = function (event) {
    if (event.keyCode == 37) {
        paddle.moveLeft = true
        paddle.moveRight = false
    } else if (event.keyCode == 39) {
        paddle.moveLeft = false
        paddle.moveRight = true
    }
    
    if( event.keyCode == 32 &&  !gameOver && running ){
        paused = !paused
    }
}

document.onkeyup = function (event) {
    if (event.keyCode == 37) {
        paddle.moveLeft = false
    } else if (event.keyCode == 39) {
        paddle.moveRight = false
    }
}

//---------------------------- End recive Input from Keyboard--------------------------

function ballShow() {
    display.fillStyle = ball.color
    display.beginPath()
    display.arc(ball.x, ball.y, ball.radius, 0, 180)
    display.fill()
}

function paddleShow() {
    display.fillStyle = paddle.color
    display.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
}

function brickShow() {
    brick.brickList.forEach(item => {
        display.fillStyle = brick.color
        display.fillRect(item.x, item.y, brick.width, brick.height)
    })
}

function paddleUpdate() {
    if (paddle.moveLeft) {
        paddle.x = paddle.x - 1
    } else if (paddle.moveRight) {
        paddle.x += 1
    }

    if (paddle.x < 0) {
        paddle.x = 0
    }
    if (paddle.x > display.width - paddle.width) {
        paddle.x = display.width - paddle.width
    }
}

function ballUpdate() {
    
    if (paddle.x + ball.radius < ball.x &&
        paddle.x + paddle.width + ball.radius > ball.x &&
        paddle.y < ball.y + ball.radius &&
        paddle.y + paddle.height + ball.radius > ball.y) {
        
        updateBallSpeed()
        ball.speedY = -ball.speedY
    }

    //    impact border
    if (ball.x > display.width - ball.radius || ball.x < ball.radius) {
        updateBallSpeed()
        ball.speedX = -ball.speedX
    }

    if (ball.y > display.height - ball.radius || ball.y < ball.radius) {
        updateBallSpeed()
        ball.speedY = -ball.speedY
    }
    if (ball.y + ball.radius > 500) {
        lives--
    }
    ball.x = ball.x + ball.speedX
    ball.y = ball.y + ball.speedY
    
}

function brickUpdate() {

    for (let i in brick.brickList) {
        if (
            brick.brickList[i].x < ball.x &&
            brick.brickList[i].x + brick.width > ball.x &&
            brick.brickList[i].y + brick.height + ball.radius > ball.y &&
            brick.brickList[i].y + ball.radius < ball.y
        ) {

            ball.speedY = -ball.speedY
            score++
            delete brick.brickList[i]
        }
    }
}

function isGameOver() {
    
    if( lives == 0 || score == brick.row * brick.column ){
        clearInterval( GameStart )
        running = false
        brick.y = 10
        gameOver = true
        display.font = '40px Verdana'
        display.fillStyle = 'darkred'
        display.textAlign = 'center'
        brick.brickList = []

        if( score == brick.row * brick.column ){
            display.fillText("You win!", display.width/2, display.height/2)  
        }
        if( lives == 0){
            display.fillText("Game Over", display.width/2, display.height/2)
        }
        
        score = 0
        lives = 3
        return true
                    
    } else {
        return false
    }
        
}

function isGamePause(){
    if( paused ){
        display.rect( 0, 0, display.width, display.height )
        display.fillStyle = 'rgba(0, 0, 0, 0.5)'
        display.fill()
        display.textAlign = 'center'
        display.fillStyle = 'white'
        display.fillText("Game paused", display.width/2, display.height/2 )
        return true
    }else{
        return false
    }
}

function updateDisplay() {
    
    
    display.fillStyle = 'gray'
    display.fillRect(0, 0, 500, 500)

    display.font = " 20px Verdana"
    display.fillStyle = 'white'
    display.textAlign = 'left'
    display.fillText("Score: " + score, 5, 490)
    display.fillText("Lives: " + lives, 410, 490)

    
    brick.show()
    paddle.show()
    ball.show()
    
    if( isGameOver()) return
    if( isGamePause() ) return
    
    ball.update()
    paddle.update()
    brick.update()
}

function startGame() {
    display.clearRect(0, 0, display.width, display.height)
    display.fillStyle = 'gray'
    running = true
    gameOver = false
    score = 0
    lives = 3
    ballHitCount = 0
    paddle.x = 150
    ball.x = paddle.x + 100
    ball.y = paddle.y - 100
    ball.speedX = 1
    ball.speedY = -1
    brick.y = 10
    for (let j = 0; j < brick.row ; j++) {
        for (let i = 0; i < brick.column; i++) {
            brick.number++
            brick.brickList[brick.number] = {
                x: brick.x,
                y: brick.y
            }
            brick.x += brick.width + 10
        }
        brick.y += brick.height + 5
        brick.x = 5
    }

    GameStart = setInterval(updateDisplay, 5)

}

function initDisplay() {
    display.clearRect(0, 0, display.width, display.height)
    display.fillStyle = 'gray'
    display.fillRect(0, 0, 500, 500)
    paddle.show()
    ball.x = paddle.x + 100
    ball.y = paddle.y - 100
    ball.show()  
}

function updateBallSpeed(){
    ballHitCount ++
    if( ballHitCount % 3 == 0 && ball.speedX < 1.6 && ball.speedX > - 1.6 ){
        console.log( ball.speedX )
        ball.speedX = ball.speedX * 1.07
        ball.speedY = ball.speedY * 1.07
    }
}