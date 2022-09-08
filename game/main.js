'use strict';

const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 10;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();

const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popUp = document.querySelector('.pop-up');
const popUpMessage = document.querySelector('.pop-up__message');
const popUpBtn = document.querySelector('.pop-up__refresh');

const carrotSound = new Audio('../carrot2/sound/carrot_pull.mp3');
const bugSound = new Audio('../carrot2/sound/bug_pull.mp3');
const BGM = new Audio('../carrot2/sound/bg.mp3');

let started = false;
let score = 0;
let timer = undefined;

gameBtn.addEventListener('click', () => {
  console.log('started was', started);
  if(started){
    stopGame();
  } else{
    startGame();
  }

  console.log('now started is', started);
  console.log("---------");
})

popUpBtn.addEventListener('click', () => {
  hidePopUp();  
  startGame();
})


function startGame(){
  started = true;
  bgmPlay();
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
}


function stopGame(){
  started = false;
  bgmPause();
  showPopUpWithText('REPLAY?👻');
  stopGameTimer();
  hideGameButton();
  showStartButton();
}


function finishGame(win){
  started = false;
  bgmPause();
  showPopUpWithText(win? 'YOU WON' : 'YOU LOST');
  stopGameTimer();
  hideGameButton();
  showStartButton();
  score = 0;
  console.log('score: ', score);
}


// Game Start!

function bgmPlay(){
  BGM.currentTime = 0;
  BGM.play();
}

function updateTimerText(sec){
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  gameTimer.innerText = `${minutes}:${seconds}`;
}

function initGame(){
  // 시작될 때 마다 field를 비움.
  field.innerHTML = '';

  gameScore.innerText = CARROT_COUNT;


  // 당근과 벌레를 생성한 뒤 field에 추가해 줌.
   addItem('carrot', CARROT_COUNT, '../carrot2/img/carrot.png');
   addItem('bug', BUG_COUNT, '../carrot2/img/bug.png');

}


function addItem(className, count, imgPath){
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;
  for(let i = 0; i < count; i++){
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    item.style.position = 'absolute';

    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);

    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
}

function randomNumber(min, max){
  return Math.random() * (max-min) + min;
 }


function showStopButton(){
  gameBtn.style.visibility = 'visible';
  const icon = document.querySelector('.fa-play');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play')
}

function showStartButton(){
  const icon = document.querySelector('.fa-stop');
  icon.classList.add('fa-play');
  icon.classList.remove('fa-stop');
}

function showTimerAndScore(){
  gameTimer.style.visibility = 'visible';
  gameScore.style.visibility = 'visible';
}

function startGameTimer(){
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if(remainingTimeSec <= 0){
      clearInterval(timer);
      finishGame(CARROT_COUNT === score);
      return;
    }
    updateTimerText(--remainingTimeSec)
  }, 1000);
}

function hidePopUp(){
  popUp.style.visibility = 'hidden';
}


// Game Stop

function bgmPause(){
  BGM.pause();
}

function stopGameTimer(){
  clearInterval(timer);
}

function hideGameButton(){
  gameBtn.style.visibility = 'hidden';
}

function showPopUpWithText(text){
 popUp.style.visibility = 'visible'; 
 popUpMessage.innerText = text;
}

// Game Play

field.addEventListener('click', onFieldClick);

function onFieldClick(event){

  // 예외 사항은 빠르게 return 될 수 있도록 처리한다. 여기서는 game이 시작되지 않았을 떄!
  if(!started){
    console.log(started);
    return;
  }

  const target = event.target;
  if(target.classList.contains('carrot')){
    carrotSound.play();
    target.remove();
    score++;
    updateScoreBoard();
    if(score === CARROT_COUNT){
      finishGame(true);
    }
  } else if(target.classList.contains('bug')){
    bugSound.play();
    finishGame(false);
  }
}

function updateScoreBoard(){
  gameScore.innerText = CARROT_COUNT - score;
}
