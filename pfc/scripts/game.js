export default class Game {

  /* construction of the game */
  constructor(p1, p2) {
    this.players = [p1, p2];
    this.choices = [null, null]; /* at the start of the game, all choices are null */
    this.scores = [0, 0]; /* keeps track of the scores */
    this.nbRound = 0; /* counts the number of rounds */

    this.notifyAllPlayers('<h3>We found a player !</h3><h3> The game can start. </h3>');
    this.play();
  }

  /* sends a notification to one player */
  notifyPlayer(index, msg) {
    this.players[index].emit('message', msg);
  }

  /* sends a notification to both players */
  notifyAllPlayers(msg) {
    this.players.forEach(p => p.emit('message', msg));
  }

  /* clears all event for each player */
  clearAll() {
    this.players.forEach(p => p.emit('clear'));
  }

  play() {
    this.players.forEach((player, index) => player.on('choice', choice => this.playerChoice(index, choice)));
  }

  playerChoice(index, choice) {
  this.choices[index] = choice;
  this.notifyPlayer(index, `<h3>You selected ${choice}</h3>`);

  if (this.choices[0] && this.choices[1]) {
    this.playRound();
    this.nbRound++;
    this.players.forEach(p => p.emit('next-round'));

    if (this.nbRound === 5) {
      this.endGame();
      this.resetGame();
      this.players.forEach(p => p.emit('disable'));
    }
    this.choices = [null, null]; /* reset the choices for the next round */
  } else {
    const otherPlayer = index === 0 ? 1 : 0;
    this.players[index].emit('disable');
    this.notifyPlayer(index, `<p> Your opponent is making a choice...</p>`);
    this.notifyPlayer(otherPlayer, `<p> Your opponent has made a choice, it's your turn !</p>`);
  }
}


  endGame() {
    this.notifyAllPlayers('<h1> END OF THE GAME </h1>');
    this.notifyAllPlayers(`<h2>Scores: ${this.scores[0]} - ${this.scores[1]}</h2>`); /* display the scores */
    const winMsg = '<h1>YOU WON THE GAME ! (｡◕‿◕｡)</h1>';
    const looseMsg = '<h1>YOU LOST THE GAME ! (҂◡_◡)</h1>';

    if (this.scores[0] > this.scores[1]) {
      this.notifyPlayer(0, winMsg);
      this.notifyPlayer(1, looseMsg);
    } else if (this.scores[1] > this.scores[0]) {
      this.notifyPlayer(1, winMsg);
      this.notifyPlayer(0, looseMsg);
    } else {
      this.notifyAllPlayers(`<h1> IT'S A TIE ( ͡° ͜ʖ ͡°)<h1>`);
    }
  }


  playRound() {
    this.players.forEach(p => p.emit('activate'));
    let p1Choice = this.choices[0];
    let p2Choice = this.choices[1];
    this.notifyAllPlayers(this.choices.join(' vs '));

    if (p1Choice === p2Choice) {
      this.notifyAllPlayers("<h3>TIE</h3>");
    } else if (p1Choice === 'rock' && p2Choice === 'scissors') {
      this.endRoundNotification(this.players[0], this.players[1]);
      this.scores[0]++;
    } else if (p1Choice === 'scissors' && p2Choice === 'paper') {
      this.endRoundNotification(this.players[0], this.players[1]);
      this.scores[0]++;
    } else if (p1Choice === 'paper' && p2Choice === 'rock') {
      this.endRoundNotification(this.players[0], this.players[1]);
      this.scores[0]++;
    } else {
      this.endRoundNotification(this.players[1], this.players[0]);
      this.scores[1]++;
    }
  }

  /* sets the choices at null, the scores of each player and number of round at 0 */
  resetGame() {
    this.choices = [null, null]; /* reset the choices for the next round */
    this.scores = [0, 0];
    this.nbRound = 0;
  }


  endRoundNotification(winner, looser) {
    winner.emit('message', '<h3> Congratulations ! YOU WON </h3>');
    looser.emit('message', '<h3> YOU LOST </h3>');
  }
}
