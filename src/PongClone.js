/*jslint indent: 4, maxlen: 80, devel: true*/
var myCanvas;
var myCanvasContext;
var fps = 60;
var SCREEN_LEFT = 0;
var viewport = {};
viewport.width = 0;
viewport.height = 0;
// Ball Variables
var ballX = 50;
var ballY = 100;
var ballRadius = 10;
var ballColor = 'white';
var ballSpeedX = 6;
var ballSpeedY = 4;
/*
 * If you want to learn and use Javascript as currently standardized,
 * namely ECMAScript Edition 3, then you can't use const as that is not
 * part of that standard.
 * const
 * https://bytes.com/topic/javascript/answers/852393-newbie-constants-javascript
 */
// Paddle Variables
// const PADDLE_HEIGHT = 100;
// const PADDLE_WIDTH = 10;
var PADDLE_HEIGHT = 120;
var PADDLE_WIDTH = 10;
var paddle1Y = 250;
var paddle2Y = 250;
// Set up score variables
var player1Score = 0;
var player2Score = 0;
// const WINNING_SCORE = 5;
var WINNING_SCORE = 5;
var player1Winner = "Player 1 is the Winner! Click to continue";
var player2Winner = "Player 2 is the Winner! Click to continue";
var winner = "";
// Make gameState
var showingWinScreen = false;


// Helper function to draw circle on canvas
function colorCircle(x, y, radius, color) {
    "use strict";
    myCanvasContext.fillStyle = color;
    myCanvasContext.beginPath();
    myCanvasContext.arc(x, y, radius, 0, Math.PI * 2, true);
    myCanvasContext.fill();
}


// Helper function to draw rectangle on canvas
function colorRect(x, y, width, height, color) {
    "use strict";
    myCanvasContext.fillStyle = color;
    myCanvasContext.fillRect(x, y, width, height);
}


// AI for paddle 2
function paddleAI() {
    "use strict";
    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
    // Make right paddle wait to move for a little bit
    if (ballX < (myCanvas.width / 2) - 200) {
        return;
    }
    // Is paddle above the ball?
    // Is ball below the paddle?
    if (paddle2YCenter < ballY + ballRadius + ballSpeedY) {
        // Smooth the movement (Hacky :P)
        if (ballSpeedY > 3) {
            paddle2Y += 6.5;
        } else {
            paddle2Y += 1;
        }
    // Is paddle below the ball?
    // Is ball above the paddle?
    } else if ((paddle2YCenter + PADDLE_HEIGHT >
                ballY + ballRadius + ballSpeedY)) {
        // Smooth the movement (Hacky :P)
        if (ballSpeedY < -3) {
            paddle2Y -= 6.5;
        } else {
            paddle2Y -= 1;
        }
    }
}



// drawNet
function drawNet() {
    "use strict";
    var i;
    for (i = 10; i < myCanvas.height - 10; i += 40) {
        colorRect(myCanvas.width / 2 - 1, i, 2, 20, 'grey');
    }
}


// Function to draw everything
function drawStuff() {
    "use strict";
    // Draw background
    colorRect(0, 0, myCanvas.width, myCanvas.height, 'black');
    // Draw net
    drawNet();
    // Draw paddle 1, player paddle
    colorRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'grey');
    // Draw paddle 2, computer paddle
    colorRect(myCanvas.width - PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH,
              PADDLE_HEIGHT, 'grey');
    // Draw ball
    colorCircle(ballX, ballY, ballRadius, ballColor);

    // Draw score
    myCanvasContext.fillText(player1Score, 100, 100);
    myCanvasContext.fillText(player2Score, myCanvas.width - 100, 100);
}


// Function to reset ball at the center, reverse the ball velocity
function ballReset() {
    "use strict";
    // Check if there is a winner
    if (player1Score >= WINNING_SCORE) {
        showingWinScreen = true;
        winner = player1Winner;
    } else if (player2Score >= WINNING_SCORE) {
        showingWinScreen = true;
        winner = player2Winner;
    }
    ballSpeedX = -ballSpeedX;
    // Make the vertical ball speed sane for a reset
    if (ballSpeedY > 4) {
        ballSpeedY = 4;
    } else if (ballSpeedY < -4) {
        ballSpeedY = -4;
    }
    ballX = (myCanvas.width / 2) + (ballRadius / 2);
    ballY = (myCanvas.height / 2) + (ballRadius / 2);
}


// Helper function to call reset function
function reset() {
    "use strict";
    ballReset();
}


// Function to update game logic
function updateStuff() {
    "use strict";
    var deltaY;
    // Move paddle2
    paddleAI();
    
    // Test if ball hit right wall
    if (ballX > myCanvas.width - ballRadius) {
        player1Score += 1;
        reset();
    // Test if ball hit left wall
    } else if (ballX < SCREEN_LEFT + ballRadius) {
        player2Score += 1;
        reset();
    // Test if ball hit left paddle
    } else if ((ballX < PADDLE_WIDTH + ballRadius + 5 &&
                (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT))) {
        ballSpeedX = -ballSpeedX;
        deltaY = ballY - (paddle1Y + (PADDLE_HEIGHT / 2));
        ballSpeedY = deltaY * 0.2;
        ballX = PADDLE_WIDTH + ballRadius + 5;
    // Test if ball hit right paddle
    } else if ((ballX > myCanvas.width - (PADDLE_WIDTH + ballRadius + 5) &&
                 (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT))) {
        ballSpeedX = -ballSpeedX;
        deltaY = ballY - (paddle2Y + (PADDLE_HEIGHT / 2));
        ballSpeedY = deltaY * 0.2;
        ballX = myCanvas.width - (PADDLE_WIDTH + ballRadius + 5);
    }

    // Make sure the ballSpeedY is not faster than 8 in either direction
    if (ballSpeedY > 8) {
        ballSpeedY = 8;
    } else if (ballSpeedY < -8) {
        ballSpeedY = -8;
    }

    // Test if ball hit bottom
    if (ballY > myCanvas.height - ballRadius) {
        ballSpeedY = -ballSpeedY;
    // Test if ball hit top
    } else if (ballY < SCREEN_LEFT + ballRadius) {
        ballSpeedY = -ballSpeedY;
    }

    // See if paddle1Y is going offscreen at the top
    if (paddle1Y > myCanvas.height - PADDLE_HEIGHT) {
        paddle1Y = myCanvas.height - PADDLE_HEIGHT;
    // See if paddle1Y is going offscreen on the bottom
    } else if (paddle1Y < SCREEN_LEFT) {
        paddle1Y =  0;
    }
    // See if paddle2Y is going offscreen at the top
    if (paddle2Y > myCanvas.height - PADDLE_HEIGHT) {
        paddle2Y = myCanvas.height - PADDLE_HEIGHT;
    // See if paddle2Y is going offscreen on the bottom
    } else if (paddle2Y < SCREEN_LEFT) {
        paddle2Y =  0;
    }

    // Update the ballX and ballY values, ball coordinates
    ballX += ballSpeedX;
    ballY += ballSpeedY;
}


// Function to update logic then draw everything
function callBoth() {
    "use strict";
    // If someone won, stop movement
    if (showingWinScreen) {
        // Display score and winner if any
        if (winner !== "") {
            myCanvasContext.fillText(winner, (myCanvas.width / 2) - 65,
                                     (myCanvas.height / 2) - 200);
        }
        return;
    }
    updateStuff();
    drawStuff();
}


// Function to get current mouse coordinates
function calculateMousePos(event) {
    "use strict";
    var rect, root, mouseX, mouseY;
    rect = myCanvas.getBoundingClientRect();
    root = document.documentElement;
    mouseX = event.clientX - rect.left - root.scrollLeft;
    mouseY = event.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}


function checkScreenSize() {
    "use strict";
    var h, w;
    w = window.innerWidth;
    h = window.innerHeight;
    if (viewport.width !== w || viewport.height !== h) {
        viewport.width = w;
        viewport.height = h;
        // console.log("Viewport changed to: " + viewport.width + " " +
        //             viewport.height);
        myCanvas.width = myCanvas.clientWidth;
        myCanvas.height = myCanvas.clientHeight;
        ballReset();
    }
}


// Main game function, called when window is loaded
function myGame() {
    "use strict";
    var checkScreenSizeID, callBothID;
    myCanvas = document.getElementById('gameCanvas');
    myCanvas.width = myCanvas.clientWidth;
    myCanvas.height = myCanvas.clientHeight;
    myCanvasContext = myCanvas.getContext('2d');
    console.log("Hello, world!");
    // console.log("Canvas size: " + myCanvas.width + ", " + myCanvas.height);

    checkScreenSizeID = setInterval(checkScreenSize, 250);

    myCanvas.addEventListener('mousedown', function (event) {
        if (showingWinScreen) {
            player1Score = 0;
            player2Score = 0;
            showingWinScreen = false;
        }
    });

    myCanvas.addEventListener('touchstart', function (event) {
        if (showingWinScreen) {
            player1Score = 0;
            player2Score = 0;
            showingWinScreen = false;
        }
    });

    myCanvas.addEventListener('mousemove', function (event) {
        var mousePos = calculateMousePos(event);
        if (mousePos.y < PADDLE_HEIGHT) {
            mousePos.y -= 15;
        }
        paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
        // See if paddle1Y is going offscreen at the top
        if (paddle1Y > myCanvas.height - PADDLE_HEIGHT) {
            paddle1Y = myCanvas.height - PADDLE_HEIGHT;
        // See if paddle1Y is going offscreen on the bottom
        } else if (paddle1Y < SCREEN_LEFT) {
            paddle1Y =  0;
        }
    });

    myCanvas.addEventListener('touchmove', function (event) {
        var touchPos = calculateMousePos(event);
        paddle1Y = touchPos.y - (PADDLE_HEIGHT / 2);
        // See if paddle1Y is going offscreen at the top
        if (paddle1Y > myCanvas.height - PADDLE_HEIGHT) {
            paddle1Y = myCanvas.height - PADDLE_HEIGHT;
        // See if paddle1Y is going offscreen on the bottom
        } else if (paddle1Y < SCREEN_LEFT) {
            paddle1Y =  0;
        }
    });

    reset();
    drawStuff();
    callBothID = setInterval(callBoth, (1000 / fps));
}

// Load the game when the page is loaded
window.onload = myGame;
