//The deck
var deck = [];
//Dictionary for the values of the cards
var cardPoints = {
    '1': 20, 'k': 16, 'q': 14, 'j': 12,
    't': 10, '9': 8, '8': 7, '7': 6,
    '6': 5, '5': 4, '4': 3, '3': 2, '2': 1
};

var newGroups = {};

let numPlayers = 4;
let playerPool = [];

var threePairBonus = 30;
var twoPairBonus = 25;
function populateDeck() {
    //Need to add "blackjack_images/" when displaying images
    for (let i = 1; i < 10; i++) {
        deck.push(i + 'h.png'); // Hearts
        deck.push(i + 'd.png'); // Diamonds
        deck.push(i + 's.png'); // Spades
        deck.push(i + 'c.png'); // Clubs
    }
    deck.push('jc.png');
    deck.push('jh.png');
    deck.push('jd.png');
    deck.push('js.png');

    deck.push('kc.png');
    deck.push('kh.png');
    deck.push('kd.png');
    deck.push('ks.png');

    deck.push('tc.png');
    deck.push('th.png');
    deck.push('td.png');
    deck.push('ts.png');

    deck.push('qc.png');
    deck.push('qh.png');
    deck.push('qd.png');
    deck.push('qs.png');
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
    document.getElementById("cardA").value = cardPoints['1'];
    document.getElementById("cardK").value = cardPoints['k'];
    document.getElementById("cardQ").value = cardPoints['q'];
    document.getElementById("cardJ").value = cardPoints['j'];
    document.getElementById("card10").value = cardPoints['t'];
    document.getElementById("card9").value = cardPoints['9'];
    document.getElementById("card8").value = cardPoints['8'];
    document.getElementById("card7").value = cardPoints['7'];
    document.getElementById("card6").value = cardPoints['6'];
    document.getElementById("card5").value = cardPoints['5'];
    document.getElementById("card4").value = cardPoints['4'];
    document.getElementById("card3").value = cardPoints['3'];
    document.getElementById("card2").value = cardPoints['2'];
    document.getElementById("2Bonus").value = twoPairBonus;
    document.getElementById("3Bonus").value = threePairBonus;
    document.getElementById("numPlayers").value = 4;

    document.getElementById("groupCombination").value = "";
    document.getElementById("powerValue").value = 0;

};
//Player class stores the name, current hand, and handPowers 
class Player{
    constructor(name) {
        this.currHand = [];
        this.hands = [];
        this.name = name;
        
    }
    getName() {
        return this.name;
    }
    getHandPower() {
        let totalPoints = 0;
        let counter = {};


        this.currHand.forEach(card => {
            const cardVal = card.charAt(0);
            if (counter[cardVal]) {
                counter[cardVal] += 1;
            } else {
                counter[cardVal] = 1;
            }
            totalPoints += cardPoints[cardVal];
        });
        

        for (const cardValue in counter) {
            const amount = counter[cardValue]
            
            if (amount === 2) {
                totalPoints += parseInt(twoPairBonus);
            }
            else if (amount === 3) {
                totalPoints += parseInt(threePairBonus);
            }
        }
        //Check in the user created groups
        for (const group in newGroups) {
            let groupcounter = {};
            let groupPower = newGroups[group];
            let groupOccurences = 0;

            
            for (let i = 0; i < group.length; i++) {
                let cardVal = group.charAt(i);
                if (groupcounter[cardVal]) {
                    groupcounter[cardVal] += 1;
                } else {
                    groupcounter[cardVal] = 1;
                }
            }

            let allConditionsMet = true;

            for (const cardValue in groupcounter) {
                if (!(counter[cardValue] >= groupcounter[cardValue])) {
                    allConditionsMet = false;
                    break;
                }
            }
            if (allConditionsMet) {
                totalPoints += groupPower;
            }

        }
        
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
        this.currHand = [];
    }
    
    displayStats() {
    let playerName = document.createElement("h1");
        playerName.textContent = this.name + " Statistics: "

    let meanElement = document.createElement("p");
        meanElement.textContent = "Mean: " + calculateMean(this.hands);

    let minElement = document.createElement("p");
        minElement.textContent = "Minimum: " + Math.min(...this.hands);

    let maxElement = document.createElement("p");
        maxElement.textContent = "Maximum: " + Math.max(...this.hands);

    let sdElement = document.createElement("p");
        sdElement.textContent = "Standard Deviation: " + calculateStandardDeviation(this.hands);

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
    playerPool = [];
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
    threePairBonus = document.getElementById("3Bonus").value;
    twoPairBonus = document.getElementById("2Bonus").value;
    updateCardValues();

    document.getElementById("cardA").value = cardPoints['1'];
    document.getElementById("cardK").value = cardPoints['k'];
    document.getElementById("cardQ").value = cardPoints['q'];
    document.getElementById("cardJ").value = cardPoints['j'];
    document.getElementById("card10").value = cardPoints['t'];
    document.getElementById("card9").value = cardPoints['9'];
    document.getElementById("card8").value = cardPoints['8'];
    document.getElementById("card7").value = cardPoints['7'];
    document.getElementById("card6").value = cardPoints['6'];
    document.getElementById("card5").value = cardPoints['5'];
    document.getElementById("card4").value = cardPoints['4'];
    document.getElementById("card3").value = cardPoints['3'];
    document.getElementById("card2").value = cardPoints['2'];
    document.getElementById("2Bonus").value = twoPairBonus;
    document.getElementById("3Bonus").value = threePairBonus;

    let group = document.getElementById("groupCombination").value;
    let power = parseInt(document.getElementById("powerValue").value);

    newGroups[group] = power;
    


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
    populateDeck();
    dealCards();

    for (let i = 0; i < playerPool.length; i++) {
        console.log("Name: " + playerPool[i].getName() + " Power: " + playerPool[i].getHandPower());
        displayPlayerCards(playerPool[i])

    }
    let statsContainer = document.getElementById("statsContainer");
    statsContainer.innerHTML = "";
}
//Used for the single deal button displays the players cards and their total hand power
function displayPlayerCards(player) {

    let container = document.getElementById("singleDealContainer");

    // Display player's name
    let playerName = document.createElement("p");
    playerName.textContent = player.getName() + "'s Hand With Power of: " + player.getHandPower();
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

            //adds curr hand power into handpower list
            player.addHandPower();
        }
        
       
    }
    
    for (let i = 0; i < playerPool.length; i++) {
        let player = playerPool[i];
        player.displayStats();
    }
}
function updateCardValues() {
    cardPoints['1'] = parseInt(document.getElementById("cardA").value);
    cardPoints['2'] = parseInt(document.getElementById("card2").value);
    cardPoints['3'] = parseInt(document.getElementById("card3").value);
    cardPoints['4'] = parseInt(document.getElementById("card4").value);
    cardPoints['5'] = parseInt(document.getElementById("card5").value);
    cardPoints['6'] = parseInt(document.getElementById("card6").value);
    cardPoints['7'] = parseInt(document.getElementById("card7").value);
    cardPoints['8'] = parseInt(document.getElementById("card8").value);
    cardPoints['9'] = parseInt(document.getElementById("card9").value);
    cardPoints['t'] = parseInt(document.getElementById("card10").value);
    cardPoints['j'] = parseInt(document.getElementById("cardJ").value);
    cardPoints['q'] = parseInt(document.getElementById("cardQ").value);
    cardPoints['k'] = parseInt(document.getElementById("cardK").value);
    

   
}
function calculateMean(array) {
    const sum = array.reduce((acc, currentValue) => acc + currentValue, 0);
    return sum / array.length;
}
function calculateStandardDeviation(array) {
    const mean = calculateMean(array);
    const squaredDifferences = array.map(number => Math.pow(number - mean, 2));
    const meanOfSquaredDifferences = calculateMean(squaredDifferences);

    const standardDeviation = Math.sqrt(meanOfSquaredDifferences);
    return standardDeviation;
}

