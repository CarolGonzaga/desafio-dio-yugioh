const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points'),
    },
    
    cardSprites: {
        avatar: document.getElementById('card-img'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },

    fieldCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },

    playerSide: {
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards"),
    },

    actions: {
        button: document.getElementById("next-duel"),
    },
};

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Dragão Branco de Olhos Azuis",
        type: "Papel",
        img: `${pathImages}dragon.png`,
        winOf: [1],
        loseOf: [2],
    },
    {
        id: 1,
        name: "Mago Negro",
        type: "Pedra",
        img: `${pathImages}magician.png`,
        winOf: [2],
        loseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Tesoura",
        img: `${pathImages}exodia.png`,
        winOf: [0],
        loseOf: [1],
    },
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement('img');
    cardImage.classList.add("card");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);

    if (fieldSide === state.playerSide.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(idCard);
        });
        
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    return cardImage;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let index = 0; index < cardNumbers; index++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        
        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = `Atributo: ${cardData[index].type}`;
}

async function removeAllCardsImage() {
    let {computerBox, player1Box} = state.playerSide;
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1Box.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "empate";
    let playerCard= cardData[playerCardId];

    if (playerCard.winOf.includes(computerCardId)) {
        duelResults = "ganhou";
        state.score.playerScore++;
    }

    if (playerCard.loseOf.includes(computerCardId)) {
        duelResults = "perdeu";
        state.score.computerScore++;
    }

    await playAdio(duelResults);

    return duelResults;
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win : ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function showHiddenCardFieldsImage(value) {
    if (value) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    } else {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function drawCardsInField(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function setCardsField(cardId) {
    await removeAllCardsImage();
    await hiddenCardDetails();
    
    let computerCardId = await getRandomCardId();
    
    await showHiddenCardFieldsImage(true);
    await drawCardsInField(cardId, computerCardId);

    let duelResults  = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function resetDuel() {
    state.cardSprites.name.innerText = "Escolha uma nova Carta";
    state.actions.button.style.display = "none";

    await showHiddenCardFieldsImage(false);

    init();
}

async function playAdio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init() {
    drawCards(5, state.playerSide.player1);
    drawCards(5, state.playerSide.computer);

    const bgm = document.getElementById("bgm");
    bgm.volume = 0.2;
    bgm.play();
}

init();