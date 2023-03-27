var dealerSum = 0;
var yourSum = 0;
var shownDealerSum = 0;
var dealerAceCount = 0;
var yourAceCount = 0;
var hidden, deck;
var canHit = true;
var canStand = true;
var cardShuffleSound;
var takeCardSound;
var cardTurnSound;

window.onload = function () {
  setTimeout(function open(event) {
    document.querySelector('.popup').style.display = 'block';
    document.querySelector('.overlay').style.display = 'block';
    document.querySelector('.cards-container').style.display = 'none';
  });

  document.querySelector('#close').addEventListener('click', function () {
    document.querySelector('.popup').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.cards-container').style.display = 'flex';
    buildDeck();
    shuffleDeck();
    startGame();
  });
};

function buildDeck() {
  let values = [
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
  ];
  let types = ['C', 'D', 'H', 'S'];
  deck = [];

  for (let i = 0; i < types.length; i++) {
    for (let j = 0; j < values.length; j++) {
      deck.push(values[j] + '-' + types[i]); //A-C -> K-C, A-D -> K-D
    }
  }
  // console.log(deck);
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  cardShuffleSound = new Audio('assets/sounds/shuffling-cards.mp3');
  cardShuffleSound.play();
}

function startGame() {
  hidden = deck.pop();

  dealerSum += getValue(hidden);
  dealerAceCount += checkAce(hidden);
  // while (shownDealerSum < 17) {
  //   let card = deck.pop();
  //   dealerSum += getValue(card);
  //   shownDealerSum += getValue(card);
  //   dealerAceCount += checkAce(card);
  //   let cardImg = document.createElement('img');
  //   cardImg.src = './cards/' + card + '.png';

  //   document.getElementById('dealer-cards').append(cardImg);
  // }
  
  for (let i = 0; i < 1; i++) {
    let cardImg = document.createElement('img');
    let card = deck.pop();
    cardImg.src = './cards/' + card + '.png';
    dealerSum += getValue(card);
    shownDealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById('dealer-cards').append(cardImg);
  }
  for (let i = 0; i < 2; i++) {
    let cardImg = document.createElement('img');
    let card = deck.pop();
    cardImg.src = './cards/' + card + '.png';
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    yourSum = reduceAce(yourSum, yourAceCount);
    document.getElementById('your-cards').append(cardImg);
  }

  document.getElementById('hit').addEventListener('click', hit);
  document.getElementById('stand').addEventListener('click', stand);
  document.getElementById('dealer-sum').innerText = shownDealerSum;
  document.getElementById('your-sum').innerText = yourSum;
  document.getElementById('result-message').classList.remove('overlay');
  blackjack();
  
}
function blackjack() {
  let message = '';
  if (yourSum == 21) {
    canHit = false;
    canStand = false;
    message = 'Blackjack! You Win!';
    document.getElementById('results').innerText = message;
    document.getElementById('your-sum').innerText = yourSum;
  }
  if (canHit == false) {
    document.getElementById('hit').classList.add('display');
    document.getElementById('stand').classList.add('display');
    document.getElementById('result-message').classList.add('overlay');
    document.getElementById('result-message').classList.remove('display');
  } else {
    document.getElementById('hit').classList.remove('display');
    document.getElementById('stand').classList.remove('display');
  }

  if (
    message == 'You Lose!' ||
    message == 'Blackjack! You Lose!' ||
    message == 'Busted! You Lose!'
  ) {
    document.getElementById('results').style.color = '#ff0000ab';
  } else if (message == 'Blackjack! You Win!') {
    document.getElementById('results').style.color = '#ffdd00ba';
  } else if (message == 'Push!') {
    document.getElementById('results').style.color = 'rgb(56 236 255 / 78%);';
  } else {
    document.getElementById('results').style.color = '#00ff21bd';
  }
}
function hit() {
  takeCardSound = new Audio('assets/sounds/take-card.mp3');
  takeCardSound.play();
  if (!canHit) {
    return;
  }

  let cardImg = document.createElement('img');
  let card = deck.pop();
  cardImg.src = './cards/' + card + '.png';
  yourSum += getValue(card);
  yourAceCount += checkAce(card);
  document.getElementById('your-cards').append(cardImg);
  if (reduceAce(yourSum, yourAceCount) > 21) {
    //A, J, 8 -> 1 + 10 + 8
    canHit = false;
  }

  let message = '';

  if (yourSum > 21) {
    canHit = false;
    canStand = false;
    message = 'Busted! You Lose!';
    document.getElementById('results').innerText = message;
  } else if (yourSum == 21) {
    blackjack();
  }
  //both you and dealer < 21
  else if (yourSum == dealerSum) {
    message = 'Push!';
  } else if (yourSum < 21 && dealerSum < 21 && yourSum > dealerSum) {
    message = 'You Win!';
  } else if (yourSum < 21 && dealerSum < 21 && yourSum < dealerSum) {
    message = 'You Lose!';
  }
  document.getElementById('your-sum').innerText = yourSum;

  if (canHit == false) {
    document.getElementById('hit').classList.add('display');
    document.getElementById('stand').classList.add('display');
    document.getElementById('result-message').classList.add('overlay');
    document.getElementById('result-message').classList.remove('display');
  } else {
    document.getElementById('hit').classList.remove('display');
    document.getElementById('stand').classList.remove('display');
  }

  if (
    message == 'You Lose!' ||
    message == 'Blackjack! You Lose!' ||
    message == 'Busted! You Lose!'
  ) {
    document.getElementById('results').style.color = '#ff0000ab';
  } else if (message == 'Blackjack! You Win!') {
    document.getElementById('results').style.color = '#ffdd00ba';
  }else if(message == 'Push!') {
    document.getElementById('results').style.color = 'rgb(56 236 255 / 78%);';
  }
  else {
    document.getElementById('results').style.color = '#00ff21bd';
  }
}

function stand() {
  if (!canStand) {
    return;
  }
  cardTurnSound = new Audio('assets/sounds/card-turn-on.mp3');
  cardTurnSound.play();
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  yourSum = reduceAce(yourSum, yourAceCount);

  canHit = false;
  document.getElementById('hidden').src = './cards/' + hidden + '.png';
  while (dealerSum < 17) {
    let card = deck.pop();
    dealerSum += getValue(card);
    shownDealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    let cardImg = document.createElement('img');
    cardImg.src = './cards/' + card + '.png';

    document.getElementById('dealer-cards').append(cardImg);
  }
  let message = '';
  blackjack();
  if (yourSum > 21) {
    message = 'You Lose!';
  } else if (yourSum == 21) {
    blackjack();
  } else if (dealerSum == 21) {
    message = 'Blackjack! You Lose!';
  } else if (yourSum < 21 && dealerSum > 21) {
    message = 'You win!';
  } else if (yourSum > 21 && dealerSum > 21 && yourSum > dealerSum) {
    message = 'You Lose!';
  } else if (yourSum > 21 && dealerSum > 21 && yourSum < dealerSum) {
    message = 'You win!';
  }
  //both you and dealer <= 21
  else if (yourSum == dealerSum) {
    message = 'Tie!';
  } else if (yourSum < 21 && dealerSum < 21 && yourSum > dealerSum) {
    message = 'You Win!';
  } else if (yourSum < 21 && dealerSum < 21 && yourSum < dealerSum) {
    message = 'You Lose!';
  }

  document.getElementById('dealer-sum').innerText = dealerSum;
  document.getElementById('your-sum').innerText = yourSum;
  document.getElementById('results').innerText = message;

  document.getElementById('hit').classList.add('display');
  document.getElementById('stand').classList.add('display');
  document.getElementById('result-message').classList.add('overlay');
  document.getElementById('result-message').classList.remove('display');
   if (
     message == 'You Lose!' ||
     message == 'Blackjack! You Lose!' ||
     message == 'Busted! You Lose!'
   ) {
     document.getElementById('results').style.color = '#ff0000ab';
   } else if (message == 'Blackjack! You Win!') {
     document.getElementById('results').style.color = '#ffdd00ba';
   } else if (message == 'Push!') {
     document.getElementById('results').style.color = 'rgb(56 236 255 / 78%);';
   } else {
     document.getElementById('results').style.color = '#00ff21bd';
   }
}

function getValue(card) {
  let data = card.split('-'); // "4-C" -> ["4", "C"]
  let value = data[0];

  if (isNaN(value)) {
    //A J Q K
    if (value == 'A') {
      return 11;
    }
    return 10;
  }
  return parseInt(value);
}

function checkAce(card) {
  if (card[0] == 'A') {
    return 1;
  }
  return 0;
}

function reduceAce(playerSum, playerAceCount) {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount -= 1;
  }
  return playerSum;
}

function newGame() {
  dealerSum = 0;
  yourSum = 0;
  shownDealerSum = 0;
  dealerAceCount = 0;
  yourAceCount = 0;
  canHit = true;
  canStand = true;
  deck = [];
  hidden = document.getElementById('hidden').src = './cards/BACK.png';

  while (document.getElementById('dealer-cards').lastChild.id !== 'hidden') {
    document
      .getElementById('dealer-cards')
      .removeChild(document.getElementById('dealer-cards').lastChild);
  }
  while (document.getElementById('your-cards').hasChildNodes()) {
    document
      .getElementById('your-cards')
      .removeChild(document.getElementById('your-cards').firstChild);
  }
  setTimeout(function open(event) {
    document.getElementById('hit').classList.remove('display');
    document.getElementById('stand').classList.remove('display');
    document.getElementById('result-message').classList.add('display');
    document.querySelector('.popup').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.cards-container').style.display = 'flex';
    buildDeck();
    shuffleDeck();
    startGame();
    blackjack();
  });
}

