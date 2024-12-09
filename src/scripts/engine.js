// Define o estado padrão do jogo
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

// Caminho para os arquivos de imagens das cartas
const pathImages = "./src/assets/icons/";

// Tipos de Cartas
const cardTypes = {
    ROCK: "Pedra",
    PAPER: "Papel",
    SCISSORS: "Tesoura",
};

// Dados das Cartas
const cardData = [
    {
        id: 0,
        name: "Cilindro Mágico",
        type: cardTypes.SCISSORS,
        img: `${pathImages}cilindro.png`,
        winOf: cardTypes.PAPER,
        loseOf: cardTypes.ROCK,
    },
    {
        id: 1,
        name: "Dragão Alado de Rá",
        type: cardTypes.SCISSORS,
        img: `${pathImages}dragao-alado.png`,
        winOf: cardTypes.PAPER,
        loseOf: cardTypes.ROCK,
    },
    {
        id: 2,
        name: "Dragão Branco de Olhos Azuis",
        type: cardTypes.ROCK,
        img: `${pathImages}dragao-branco.png`,
        winOf: cardTypes.SCISSORS,
        loseOf: cardTypes.PAPER,
    },
    {
        id: 3,
        name: "Dragão Negro",
        type: cardTypes.ROCK,
        img: `${pathImages}dragao-negro.png`,
        winOf: cardTypes.SCISSORS,
        loseOf: cardTypes.PAPER,
    },
    {
        id: 4,
        name: "Slifer, o Dragão Celeste",
        type: cardTypes.SCISSORS,
        img: `${pathImages}dragao-slifer.png`,
        winOf: cardTypes.PAPER,
        loseOf: cardTypes.ROCK,
    },
    {
        id: 5,
        name: "Espadas da Luz Reveladora",
        type: cardTypes.PAPER,
        img: `${pathImages}espadas.png`,
        winOf: cardTypes.ROCK,
        loseOf: cardTypes.SCISSORS,
    },
    {
        id: 6,
        name: "Exodia",
        type: cardTypes.SCISSORS,
        img: `${pathImages}exodia.png`,
        winOf: cardTypes.PAPER,
        loseOf: cardTypes.ROCK,
    },
    {
        id: 7,
        name: "Mago Do Tempo",
        type: cardTypes.PAPER,
        img: `${pathImages}mago-do-tempo.png`,
        winOf: cardTypes.ROCK,
        loseOf: cardTypes.SCISSORS,
    },
    {
        id: 8,
        name: "Mago Negro",
        type: cardTypes.ROCK,
        img: `${pathImages}mago-negro.png`,
        winOf: cardTypes.SCISSORS,
        loseOf: cardTypes.PAPER,
    },
    {
        id: 9,
        name: "Obelisco, o Atormentador",
        type: cardTypes.PAPER,
        img: `${pathImages}obelisco.png`,
        winOf: cardTypes.ROCK,
        loseOf: cardTypes.SCISSORS,
    },
    {
        id: 10,
        name: "Caveira Invocada",
        type: cardTypes.PAPER,
        img: `${pathImages}caveira.png`,
        winOf: cardTypes.ROCK,
        loseOf: cardTypes.SCISSORS,
    },
    {
        id: 11,
        name: "Monstro Renasce",
        type: cardTypes.ROCK,
        img: `${pathImages}renascer.png`,
        winOf: cardTypes.SCISSORS,
        loseOf: cardTypes.PAPER,
    },
];

// Retorna o ID de uma carta aleatória
async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

// Cria um elemento de imagem para a carta
async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement('img');
    cardImage.classList.add("card");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.jpg");
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

// Distribue as cartas
async function drawCards(cardNumbers, fieldSide) {
    for (let index = 0; index < cardNumbers; index++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

// Exibe detalhes da carta selecionada
async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = `Atributo: ${cardData[index].type}`;
}

// Remove todas as cartas atualmente visíveis
async function removeAllCardsImage() {
    let { computerBox, player1Box } = state.playerSide;
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1Box.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

// Checa o resultado do duelo
async function checkDuelResults(playerCardId, computerCardId) {
    
    let duelResults = "empate";
    const playerCard = cardData[playerCardId];
    const computerCard = cardData[computerCardId];

    // Lógica para determinar o vencedor
    if (
        (playerCard.type === cardTypes.ROCK && computerCard.type === cardTypes.SCISSORS) ||
        (playerCard.type === cardTypes.PAPER && computerCard.type === cardTypes.ROCK) ||
        (playerCard.type === cardTypes.SCISSORS && computerCard.type === cardTypes.PAPER)
    ) {
        duelResults = "ganhou";
        state.score.playerScore++;
    
    } else if (
        (computerCard.type === cardTypes.ROCK && playerCard.type === cardTypes.SCISSORS) ||
        (computerCard.type === cardTypes.PAPER && playerCard.type === cardTypes.ROCK) ||
        (computerCard.type === cardTypes.SCISSORS && playerCard.type === cardTypes.PAPER)
    ) {
        duelResults = "perdeu";
        state.score.computerScore++;
    }

    // Toca o áudio correspondente ao resultado
    await playAdio(duelResults);

    return duelResults;
}

// Atualiza o texto do botão de ação
async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

// Atualiza o placar na interface
async function updateScore() {
    state.score.scoreBox.innerText = `Win : ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

// Oculta os detalhes da carta
async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

// Mostra ou esconde as cartas de cada jogador
async function showHiddenCardFieldsImage(value) {
    if (value) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    } else {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

// Exibe as cartas no campo de duelo
async function drawCardsInField(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

// Configura o campo de duelo e processa o resultado
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

// Reinicia o duelo
async function resetDuel() {
    state.cardSprites.name.innerText = "Escolha uma nova Carta";
    state.actions.button.style.display = "none";

    await showHiddenCardFieldsImage(false);

    init();
}

// Toca o áudio conforme o resultado do duelo
async function playAdio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

// Inicializa o jogo
function init() {
    drawCards(5, state.playerSide.player1);
    drawCards(5, state.playerSide.computer);

    const bgm = document.getElementById("bgm");
    bgm.volume = 0.2;
    bgm.play();
}

init();