//The deck
let deck = [];
//Dictionary for the values of the cards
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

//Actions to make on first load
window.onload = function () {
    
};
//Player class stores the name, hand, and handPower
class Player{
    constructor(name) {
        this.currHand = [];
        this.hands = [];
        this.name = name;
        
    }
    getName() {
        return this.name;
    }
    clearCurrHand() {
        this.currHand = [];
    }
    //returns the worth of the currHand
    getHandPower() {
        let totalPoints = 0;
        this.currHand.forEach(card => {
            const cardValue = card.charAt(0);
            totalPoints += cardPoints[cardValue];
        });
        return totalPoints;
    }
    addCard(card) {
        this.currHand.push(card);
    }
    displayHand() {
        console.log("Player's Hand:");
        this.currHand.forEach(card => console.log(card));
    }
    addHandPower() {
        this.hands.push(this.getHandPower());
        this.clearCurrHand();
    }
    //Caculates mean getting the avg of the past hand values
    calculateMean(array) {
        let totalPoints = 0;
        for (let i = 0; i < array.length; i++) {
            totalPoints += array[i];
        }
        return totalPoints / array.length;
    }
    calculateStandardDeviation() {
        const mean = this.calculateMean(this.hands);
        const squaredDifferences = this.hands.map(number => Math.pow(number - mean, 2));
        const meanOfSquaredDifferences = this.calculateMean(squaredDifferences);

        const standardDeviation = Math.sqrt(meanOfSquaredDifferences);
        return standardDeviation;
    }
    displayStats() {
    let playerName = document.createElement("h1");
        playerName.textContent = this.name + " Statistics: "

    let meanElement = document.createElement("p");
        meanElement.textContent = "Mean: " + this.calculateMean(this.hands);

    let minElement = document.createElement("p");
        minElement.textContent = "Minimum: " + Math.min(...this.hands);

    let maxElement = document.createElement("p");
        maxElement.textContent = "Maximum: " + Math.max(...this.hands);

    let sdElement = document.createElement("p");
        sdElement.textContent = "Standard Deviation: " + this.calculateStandardDeviation();

        // Append the elements to the statsContainer
    statsContainer.appendChild(playerName)
    statsContainer.appendChild(meanElement);
    statsContainer.appendChild(minElement);
    statsContainer.appendChild(maxElement);
    statsContainer.appendChild(sdElement);
    }

}
//Creates the players for the game
function startGame() {
    populateDeck();
    playerPool = [];
    numPlayers = localStorage.getItem("numPlayers");
    for (let i = 1; i <= numPlayers; i++) {
        const player = new Player("Player " + i);
        playerPool.push(player);
    }
    let container = document.getElementById("singleDealContainer");
    container.innerHTML = "";
}

//On Settings page
//Applys changes to numPlayers
//which is then saved in the local storage for later use
function applyChanges() {
    numPlayers = document.getElementById("numPlayers").value;
    localStorage.setItem("numPlayers", numPlayers);
}
//Deals the cards out to each player
function dealCards() {
    let index = 0;
    while (deck.length > 0) {
        playerPool[index].addCard(deck.pop());
        index = (index + 1) % playerPool.length;
    }
}
//Plays one game and prints the power of the hands into the console
function singleDeal() {
    startGame();
    shuffleDeck();
    dealCards();

    for (let i = 0; i < playerPool.length; i++) {
        console.log("Name: " + playerPool[i].getName() + " Power: " + playerPool[i].getHandPower());
        displayPlayerCards(playerPool[i])
    }
}
function displayPlayerCards(player) {

    let container = document.getElementById("singleDealContainer");

    // Display player's name
    let playerName = document.createElement("p");
    playerName.textContent = player.getName() + "'s Hand:";
    container.appendChild(playerName);

    // Display player's hand
    player.currHand.forEach(function (imageUrl) {
        let img = document.createElement("img");
        img.src = "blackjack_images/" + imageUrl;
        container.appendChild(img);
    });

    // Add a line break after each player's hand
    container.appendChild(document.createElement("br"));
}
function multiDeal() {
    //clear old game
    let statsContainer = document.getElementById("statsContainer");
    statsContainer.innerHTML = "";

    let numDeals = parseInt(document.getElementById("numDeals").value);
    startGame();

    for (let deal = 0; deal < numDeals; deal++) {
        populateDeck();
        dealCards();

        // Calculate hand powers for each player and add them to their respective Player instances
        for (let i = 0; i < playerPool.length; i++) {
            let player = playerPool[i];
            let handPower = player.getHandPower(); // Calculate hand power for the current player
            player.addHandPower(handPower); // Add hand power to the player's statistics
        }
       
    }
    
    for (let i = 0; i < playerPool.length; i++) {
        let player = playerPool[i];
        player.displayStats();
    }
}



