const couples = [
    ["Adora", "Catra"],
    ["Glimmer", "Bow"],
    ["Perfuma", "Scorpia"],
    ["Angela", "Micah"],
    ["Entrapta", "Hordak"],
    ["Netossa", "Spinnerella"],
    ["George", "Lance"],
    ["Seahawk", "Mermista"]
];

const cards = {};
const cardsContainer = document.getElementById("cards-container");
const startOverlay = document.getElementById("start-overlay");
const endOverlay = document.getElementById("end-overlay");
let lastClickedCard = "";

function isMatch(card1, card2) {
    for (let couple of couples) {
        if ((card1 === couple[0] && card2 === couple[1]) || (card1 === couple[1] && card2 === couple[0])) {
            return true;
        } 
    }
    return false;
}

function remainingCards() {
    return Object.values(cards).filter(card => card.inPlay).length;
}

function removeCards(char1, char2) {
    return function() {
        cards[char1].style.opacity = 0;
        cards[char2].style.opacity = 0;

        cards[char1].inPlay = false;
        cards[char2].inPlay = false;

        cards[char1].back.removeEventListener('transitionend', cards[char1].waitTransition);
        cards[char2].back.removeEventListener('transitionend', cards[char2].waitTransition);

        if (remainingCards() === 0) {
            // Game has ended, display overlay
            endOverlay.style.display = 'flex';   
        }
    }
}

function unturnCards(char1, char2) {
    return function() {
        cards[char1].front.style.transform = 'rotateY(0deg)';
        cards[char1].back.style.transform = 'rotateY(180deg)';

        cards[char2].front.style.transform = 'rotateY(0deg)';
        cards[char2].back.style.transform = 'rotateY(180deg)';

        cards[char2].back.removeEventListener('transitionend', cards[char2].waitTransition);
        cards[char1].back.removeEventListener('transitionend', cards[char1].waitTransition);

        cards[char1].inPlay = true;
        cards[char2].inPlay = true;
    }
}

function initOnClickCard(char) {
    return function onClickCard() {
        const clickedCard = cards[char];
        if (clickedCard.inPlay) {
            clickedCard.inPlay = false;

            if (lastClickedCard === "") {
                lastClickedCard = char;
                // Highlight the current clicked card
                clickedCard.front.style.transform = 'rotateY(180deg)';
                clickedCard.back.style.transform = 'rotateY(0deg)';
                
            } else {
                clickedCard.front.style.transform = 'rotateY(180deg)';
                clickedCard.back.style.transform = 'rotateY(0deg)';

                // Compare this card with the last clicked one. If they match, 
                // show the user they got a match and remove the cards from the game
                if (isMatch(lastClickedCard, char)) {
                    clickedCard.waitTransition = removeCards(lastClickedCard, char);
                    clickedCard.back.addEventListener('transitionend', clickedCard.waitTransition);                
                } else {
                    clickedCard.waitTransition = unturnCards(lastClickedCard, char);
                    clickedCard.back.addEventListener('transitionend', clickedCard.waitTransition);
                }

                // Clear the last clicked card
                lastClickedCard = "";
            }
        }
    }
}

function makeCardBack(dom, char, cardWidth) {
    const cardBack = document.createElement('div');
    dom.appendChild(cardBack);
    dom.back = cardBack;

    cardBack.classList.add('rounded');
    cardBack.classList.add('border-4');
    cardBack.classList.add('border-gray-50');
    cardBack.classList.add('text-gray-50');

    cardBack.style.width = '100%';
    cardBack.style.height = '100%';
    cardBack.style.backgroundImage = `url(img/${char}.png)`;
    cardBack.style.backgroundSize = cardWidth + 'px';
    cardBack.style.backgroundPosition = 'center';

    cardBack.style.transform = 'rotateY(180deg)';
    cardBack.style.position = 'absolute';
    cardBack.style.display = 'flex';
    cardBack.style.justifyContent = 'center';
    cardBack.style.alignItems = 'flex-end';
    cardBack.style.transition = 'all 1.5s ease-in-out';
    cardBack.style.transformStyle = 'preserve-3d';
    cardBack.style.backfaceVisibility = 'hidden';

    const textBorder = document.createElement('div');
    textBorder.innerText = char;

    textBorder.style.width = '100%';

    textBorder.classList.add('bg-gray-50');
    textBorder.classList.add('text-purple-500');
    textBorder.classList.add('flex');
    textBorder.classList.add('justify-center');
    textBorder.classList.add('items-center');
    textBorder.classList.add('font-medium');

    cardBack.appendChild(textBorder);
}

function makeCardFront(dom) {
    const cardFront = document.createElement('div');
    dom.appendChild(cardFront);
    dom.front = cardFront;

    cardFront.classList.add('rounded');
    cardFront.classList.add('border-4');
    cardFront.classList.add('border-gray-50');
    cardFront.classList.add('text-gray-50');

    cardFront.style.width = '100%';
    cardFront.style.height = '100%';
    cardFront.style.position = 'absolute';
    cardFront.style.transition = 'all 1.5s ease-in-out';
    cardFront.style.transformStyle = 'preserve-3d';
    cardFront.style.backfaceVisibility = 'hidden';

    cardFront.style.backgroundImage = "url(img/Heart.png)";
    cardFront.style.backgroundSize = "250px";
    cardFront.style.backgroundPosition = "center";
}

function makeCard(char) {
    const dom = document.createElement('div');

    const cardWidth = 100;
    dom.style.width = cardWidth;
    dom.style.height = 4/3*cardWidth;
    dom.style.position = 'relative';

    dom.style.transition = 'all 0.5s ease-in-out';
    dom.style.margin = '10px';

    makeCardBack(dom, char, cardWidth);
    makeCardFront(dom);

    dom.addEventListener("click", initOnClickCard(char));

    cards[char] = dom;
    cards[char].inPlay = true;
    cardsContainer.appendChild(dom);
}

function randomReorder(arr) {
    const reorderedArr = [];
    while (arr.length > 0) {
        const removeIdx = Math.floor(Math.random() * arr.length);
        const removeElem = arr.splice(removeIdx, 1);
        reorderedArr.push(...removeElem);
    }
    return reorderedArr;
}

function startGame() {
    //Dumdum way to remove all children
    cardsContainer.innerHTML = '';
    // Create a card for each character
    for (let char of randomReorder(couples.flat())) {
        makeCard(char);
    }
}

startOverlay.addEventListener("click", () => {
    //Remove overlay if visible
    startOverlay.style.display = 'none';
    startGame();
});