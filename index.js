let deck = [];

const cardPoints = {
    '1': 20, '13': 16, '12': 14, '11': 12,
    '10': 10, '9': 8, '8': 7, '7': 6,
    '6': 5, '5': 4, '4': 3, '3': 2, '2': 1
};

let numPlayers = 4;
let playerPool = [];
function populateDeck() {
    //Need to add "blackjack_images/" when displaying images
    for (let i = 1; i < 14; i++) {
        deck.push(i + 'h.png'); // Hearts
        deck.push(i + 'd.png'); // Diamonds
        deck.push(i + 's.png'); // Spades
        deck.push(i + 'c.png'); // Clubs
    }
    shuffleDeck();
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}


function displayImages() {
    let container = document.getElementById("imageContainer");
    container.innerHTML = ""; // Clear previous content

    // Check if deck is populated
    if (deck.length === 0) {
        console.error("Deck is empty. Please populate the deck first.");
        return;
    }

    deck.forEach(function (imageUrl) {
        let img = document.createElement("img");
        img.src = "blackjack_images/" + imageUrl;
        container.appendChild(img);
    });
}

// Populate the deck when the page is loaded
window.onload = function () {
    populateDeck();
    shuffleDeck();
    displayImages();
};

class Player{
    constructor(name) {
        this.hand = [];
        this.name = "";
        this.handPower = 0;
    }
    getHandPower() {
        let totalPoints = 0;
        this.hand.forEach(card => {
            const cardValue = card.charAt(0);
            totalPoints += cardPoints[cardValue];
        });
        this.handPower = totalPoints;
        return this.handPower;
    }
    addCard(card) {
        this.hand.push(card);
    }
    displayHand() {
        console.log("Player's Hand:");
        this.hand.forEach(card => console.log(card));
    }
}
function startGame() {
    populateDeck();
    playerPool = [];
    numPlayers = localStorage.getItem("numPlayers");
    for (let i = 1; i <= numPlayers; i++) {
        console.log(numPlayers);
        const player = new Player("Player " + i);
        playerPool.push(player);

    }
}
function applyChanges() {
    numPlayers = document.getElementById("numPlayers").value;
    localStorage.setItem("numPlayers", numPlayers);
    console.log(numPlayers + " Is the number of players");
}
function dealCards() {
    let index = 0;
    while (deck.length > 0) {
        playerPool[index].addCard(deck.pop());
        index = (index + 1) % playerPool.length;
    }
}
function singleDeal() {
    startGame();
    shuffleDeck();
    dealCards();
    for (let i = 0; i < playerPool.length; i++) {
        console.log(playerPool[i].name + " Power: " + playerPool[i].getHandPower());
        console.log(numPlayers);
    }
}
