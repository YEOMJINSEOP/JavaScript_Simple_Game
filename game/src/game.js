'use strict';

import Field from './field.js';
import * as sound from './sound.js';

// Builder Pattern
export default class GameBuilder{
  gameDuration(duration){
    this.gameDuration = duration;
    return this;
  }

  carrotCount(num){
    this.carrotCount = num;
    return this;
  }

  bugCount(num){
    this.bugCount = num;
    return this;
  }

  build(){
    return new Game(
      this.gameDuration,
      this.carrotCount,
      this.bugCount
    );
  }
}



class Game{
  constructor(gameDuration, carrotCount, bugCount){
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.gameBtn = document.querySelector('.game__button');
    this.gameTimer = document.querySelector('.game__timer');
    this.gameScore = document.querySelector('.game__score');

    this.gameBtn.addEventListener('click', () => {
      if(this.started){
        this.stop();
      } else{
        this.start();
      }
    })

    this.started = false;
    this.score = 0;
    this.timer = undefined;

    this.gameField =  new Field(this.carrotCount, this.bugCount);
    this.gameField.setClickListener(this.onItemClick);

  }

  onItemClick = (item) => {

    if(!this.started){
      return;
    }
  
    if(item === 'carrot'){
      this.score++;
      this.updateScoreBoard();
      if(this.score === this.carrotCount){
        this.finish(true);
      }
    } else if(item === 'bug'){
      this.finish(false);
    }
  }

  setGameStopListener(onGameStop){
    this.onGameStop = onGameStop;
  }

  start(){
    this.started = true;
    this.initGame();
    this.showStopButton();
    this.showTimerAndScore();
    this.startGameTimer();
    sound.playBgm();
  }

  stop(){
    this.started = false;
    this.stopGameTimer();
    this.hideGameButton();
    this.showStartButton();
    this.onGameStop && this.onGameStop('cancel');
    sound.stopBgm();
  }

  finish(win){
    this.started = false;
    this.score = 0;
    this.stopGameTimer();
    this.hideGameButton();
    this.showStartButton();
    sound.stopBgm();
    this.onGameStop && this.onGameStop(win? 'win' : 'lose');
  }

  updateScoreBoard(){
    this.gameScore.innerText = this.carrotCount - this.score;
  }


  updateTimerText(sec){
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    this.gameTimer.innerText = `${minutes}:${seconds}`;
  }
  
  initGame(){
    this.gameScore.innerText = this.carrotCount;
    this.gameField.init();
  }
  
  
  showStopButton(){
    this.gameBtn.style.visibility = 'visible';
    const icon = document.querySelector('.fa-play');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play')
  }
  
  showStartButton(){
    const icon = document.querySelector('.fa-stop');
    icon.classList.add('fa-play');
    icon.classList.remove('fa-stop');
  }
  
  showTimerAndScore(){
    this.gameTimer.style.visibility = 'visible';
    this.gameScore.style.visibility = 'visible';
  }
  
  startGameTimer(){
    let remainingTimeSec = this.gameDuration;
    this.updateTimerText(remainingTimeSec);
    this.timer = setInterval(() => {
      if(remainingTimeSec <= 0){
        clearInterval(this.timer);
        this.finish(this.carrotCount === this.score);
        return;
      }
      this.updateTimerText(--remainingTimeSec)
    }, 1000);
  }
  
  
  
  stopGameTimer(){
    clearInterval(this.timer);
  }
  
  hideGameButton(){
    this.gameBtn.style.visibility = 'hidden';
  }
}