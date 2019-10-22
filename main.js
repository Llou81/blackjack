const dealButton = document.getElementById("deal_button");
const hitButton = document.getElementById("hit_button");
const stayButton = document.getElementById("stay_button");
const game = document.getElementById("game");
const history = document.getElementById("history");
const dealDiv = document.getElementById("deal_div");
const result = document.getElementById("result");
const playerCard = document.getElementsByClassName("player_card");
const dealerCard = document.getElementsByClassName("dealer_card");
const hiddenCard = document.getElementsByClassName("hidden_card");
const cardValue = document.getElementsByClassName("card_value");

function Card(name, suit, value) {
    this.name = name;
    this.suit = suit;
    this.value = value;
}

const deck = () => {
    const suits = ["Hearts", "Diamonds", "Spades", "Clubs"];
    const names = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
    let cards = [];
    let value;
    for (name of names) {
        if (!isNaN(name)) {
            value = Number(name);
        } else if (name === "A") {
            value = 11;
        } else {
            value = 10;
        }

        for (suit of suits) {
            cards.push(new Card(name, suit, value))
        }
    }
    return cards;
}

const shuffleDeck = () => {
    let shuffled = deck();
    let currentPass = shuffled.length;
    let index, temp;

    while (currentPass > 0) {
        index = Math.floor(Math.random() * currentPass);
        currentPass--;

        temp = shuffled[currentPass];
        shuffled[currentPass] = shuffled[index];
        shuffled[index] = temp;
    }
    return shuffled;
}

const dealCardsCss = () => {
    dealDiv.style.display = "none";
    result.style.visibility = "hidden";
    result.classList.remove('bounceIn', 'delay-1hs', 'slow');
    cardValue[0].classList.remove('animated', 'fadeIn');
    cardValue[0].style.visibility = "hidden"
    hitButton.style.display = "inline-block";
    stayButton.style.display = "inline-block";
    history.style.display = "none";
    game.style.display = "grid";
    for (card of hiddenCard) {
        card.style.display = "none";
    }
}

const endGameCss = () => {
    dealDiv.style.display = "block";
    hitButton.style.display = "none";
    stayButton.style.display = "none";
    playerCard[0].classList.remove('animated', 'fadeInDown', 'delay-hs');
    dealerCard[0].classList.remove('animated', 'fadeInUp', 'delay-1s');
    playerCard[1].classList.remove('animated', 'fadeInDown', 'delay-1hs');
    dealerCard[1].classList.remove('animated', 'fadeInUp', 'delay-2s');
    cardValue[1].classList.remove('animated', 'fadeIn');
}

const dealCards = () => {

    dealCardsCss();
    shuffledDeck = shuffleDeck();

    playerCards = [shuffledDeck.shift(), shuffledDeck.shift()];
    dealerCards = [shuffledDeck.shift(), shuffledDeck.shift()];

    makeVisible(playerCard[0]);
    playerCard[0].setAttribute("src", `./pictures/${playerCards[0].name}${playerCards[0].suit}.png`);
    playerCard[0].classList.add('animated', 'fadeInDown', 'delay-hs');
    makeVisible(dealerCard[0]);
    dealerCard[0].setAttribute("src", `./pictures/${dealerCards[0].name}${dealerCards[0].suit}.png`);
    dealerCard[0].classList.add('animated', 'fadeInUp', 'delay-1s');
    makeVisible(playerCard[1]);
    playerCard[1].setAttribute("src", `./pictures/${playerCards[1].name}${playerCards[1].suit}.png`);
    playerCard[1].classList.add('animated', 'fadeInDown', 'delay-1hs');
    makeVisible(dealerCard[1]);
    dealerCard[1].setAttribute("src", `./pictures/red_back.png`);
    dealerCard[1].classList.add('animated', 'fadeInUp', 'delay-2s');

    sumPlayer = calculateSum(playerCards);
    sumDealer = calculateSum(dealerCards);
    cardValue[1].innerHTML = `${sumPlayer}`;
    cardValue[1].classList.add('animated', 'fadeIn', 'delay-2s');
    makeVisible(cardValue[1]);


    if (checkBlackJack(sumPlayer) || checkBlackJack(sumDealer)) {
        endGame(dealerCards);
        gameResult(dealerCards, playerCards);
    }
}

hitButton.addEventListener("click", function() {
    hitCard(shuffledDeck, playerCards);
    sumPlayer = valueSum(playerCards);
    cardValue[1].innerHTML = `${sumPlayer}`;
    let i = playerCards.length - 1;
    playerCard[i].setAttribute("src", `./pictures/${playerCards[i].name}${playerCards[i].suit}.png`);
    playerCard[i].style.display = "inline-block";

    if (sumPlayer > 20) {
        dealerAI(shuffledDeck, dealerCards);
        endGame(dealerCards);
        gameResult(dealerCards, playerCards);
    }
});

stayButton.addEventListener("click", function() {
    dealerAI(shuffledDeck, dealerCards);
    endGame(dealerCards);
    gameResult(dealerCards, playerCards);
});


dealButton.addEventListener("click", dealCards);

const hitCard = (array1, array2) => {
    let temp = array1.shift();
    array2.push(temp);
    valueSum(array2);
}

const makeVisible = (element) => {
    element.style.visibility = "visible";
    element.style.display = "inline-block";
}

const showResult = (element) => {
    result.style.visibility = "visible";
    result.classList.add('animated', 'bounceIn', 'delay-2s', 'slow');
}

const calculateSum = (array) => {
    let sum = 0;
    for (item of array) {
        sum += item.value;
    }
    return sum;
}

const valueSum = (array) => {
    let sum = calculateSum(array);

    for (item of array) {
        if (item.value === 11 && checkBust(sum)) {
            item.value = 1;
            sum = calculateSum(array);
        }
    }

    return sum;
}

const checkBust = (sum) => {
    if (sum < 22) return false;
    return true;
}

const checkBlackJack = (sum) => {
    if (sum === 21) return true;
    return false;
}

const endGame = (array) => {

    for (item of array) {
        let i = array.indexOf(item);
        dealerCard[i].setAttribute("src", `./pictures/${array[i].name}${array[i].suit}.png`);
        dealerCard[i].style.display = "inline-block";
    }

    sumDealer = valueSum(array);
    cardValue[0].innerHTML = `${sumDealer}`;

    gameResult(dealerCards, playerCards);

    endGameCss();
}

const dealerAI = (array1, array2) => {
    while (valueSum(array2) < 17) {
        hitCard(array1, array2);
    }
}

const playerWins = () => {
    showResult(result);
    result.innerHTML = "Player wins";
}

const dealerWins = () => {
    showResult(result);
    result.innerHTML = "Dealer wins";
}

const push = () => {
    showResult(result);
    result.innerHTML = "Push";
}

const gameResult = (array1, array2) => {
    cardValue[0].classList.add('animated', 'fadeIn', 'delay-1hs');
    makeVisible(cardValue[0]);
    if (valueSum(array1) > 21 && valueSum(array2) > 21) {
        push();
    } else {
        if (valueSum(array2) > valueSum(array1) && valueSum(array2) < 22) {
            playerWins();
        } else if (valueSum(array2) < valueSum(array1) && valueSum(array1) < 22) {
            dealerWins();
        } else if (valueSum(array2) > 21 && valueSum(array1) < 22) {
            dealerWins();
        } else if (valueSum(array2) < 22 && valueSum(array1) > 21) {
            playerWins();
        } else {
            push();
        }
    }
}