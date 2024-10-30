// https://www.shecodes.io/athena/73117-how-to-generate-an-array-of-random-colors-in-javascript
// https://codingartistweb.com/2022/09/simon-game-with-javascript/
// https://www.google.com/search?client=safari&sca_esv=59c13155e087bde1&q=simon+game+code+js&tbm=vid&source=lnms&sa=X&ved=2ahUKEwj3vY-7weeEAxUkYEEAHdoNCPAQ0pQJegQIChAB&biw=991&bih=743&dpr=2#fpstate=ive&vld=cid:643674e2,vid:W0MxUHlZo6U,st:0
// https://www.w3schools.com/jsref/met_win_setinterval.asp
// https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
// https://www.w3schools.com/jsref/jsref_object_keys.asp

const buttons = {
    topLeft: document.querySelector('.bt.topleft'),
    topRight: document.querySelector('.bt.topright'),
    bottomLeft: document.querySelector('.bt.bottomleft'),
    bottomRight: document.querySelector('.bt.bottomright')
};
// button press
Object.keys(buttons).forEach(key => {
    buttons[key].addEventListener('click', () => ButtonPress(key));
});
// start button click
const startbt = document.querySelector('.start');
startbt.addEventListener('click', startGame);
//Display area
const progressDisplay = document.getElementById('right');
const highestScore = document.getElementById('left');
const light = document.querySelector('.light');

let sequence = [];   // sequence of buttons that the player needs to repeat.
let userSequence = [];   // to determine whether the player's input is correct.
let progress = 0;
let highScore = 0;
let gameInProgress = false;
let speed = 1000;
let responseTimeout;  //5 seconds

// Start game function
function startGame() {
    clearTimeout(responseTimeout);
    sequence = [];
    userSequence = [];
    progress = 0;
    gameInProgress = true;   // the game is started and the sequence can start generated
    speed = 1000;
    updateDisplays();
    light.style.backgroundColor = 'limegreen';
    setTimeout(nextStep, 3000);  // specified delay in milliseconds
}

// random buttons
function nextStep() {
    const buttonsKeys = Object.keys(buttons);
    const random = buttonsKeys[Math.floor(Math.random() * buttonsKeys.length)];
    sequence.push(random);
    showSequence();
}

// Show the patterns
function showSequence() {
    let i = 0; // position 0
    // setInterval continues to run the code at the specified interval until it is explicitly stopped using clearInterval.
    const interval = setInterval(() => {
        flashButton(buttons[sequence[i]]);   // the current flashed button
        i++;
        if (i >= sequence.length) {   // all the sequence are showed
            clearInterval(interval);   //stop the interval, no more sequences can be generated
            responseTimeout = setTimeout(gameOver, 5000);  //if after 5sec, then game over
        }
    }, speed);
}

// Flash button after 0.3sec
function flashButton(button) {
    button.classList.add('active');
    setTimeout(() => button.classList.remove('active'), 300);
}

// button press by the player
function ButtonPress(buttonKey) {
    if (!gameInProgress) return;
    clearTimeout(responseTimeout);
    // sequence[userSequence.length] to track the user sequence to the sequence
    const expectedButton = sequence[userSequence.length];
    if (buttonKey === expectedButton) {  // buttonkey is the player press button
        userSequence.push(buttonKey);    // put the button that the player pressed in to userSequence
        flashButton(buttons[buttonKey]);   // flash the button that the player pressed
        if (userSequence.length === sequence.length) {
            progress = sequence.length;
            updateDisplays();
            userSequence = [];  // reset
            setTimeout(nextStep, 1000);  // 1sec after start the next round
        }
    } else {
        gameOver();
    }
}

// Update the score displays
function updateDisplays() {
    progressDisplay.textContent = progress.toString().padStart(2, '0');  // textContent need to use string type
    highestScore.textContent = highScore.toString().padStart(2, '0');
    //padStart make sure that the length of score is 2 and if is a single number then it will add a 0 at front
}

// Game over
function gameOver() {
    clearTimeout(responseTimeout);
    gameInProgress = false;
    light.style.backgroundColor = 'red';   //status light turn red
    if (progress > highScore) {
        highScore = progress;
    }
    updateDisplays();
    flashAllButtons();
}

// Flash all buttons
function flashAllButtons() {
    let flashes = 0;
    const flashInterval = setInterval(() => {
        Object.values(buttons).forEach(button => button.classList.toggle('active'));
        flashes++;
        if (flashes === 10) {  // light up and off count as 1 flash, so 5 times has to be doubled
            clearInterval(flashInterval);
            Object.values(buttons).forEach(button => button.classList.remove('active'));
        }
    }, 500);
}