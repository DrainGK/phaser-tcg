
const apiKey = "2742c28f-09da-49a1-b66b-f24a0ebd7b4e";

const apiUrl = 'https://api.pokemontcg.io/v2/cards';
const stored = [];

async function fetchPokemonCards() {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-Api-Key': apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        stored.push(...data.data);
        console.log(stored);
        generateCard();

    } catch (error) {
        console.error('Error fetching Pokémon cards:', error);
    }
}

function generateCard(){
    const cardsContainer = document.querySelector(".cards-container")
    stored.forEach((card) => {
        const cardContainer = document.createElement("img");
        cardContainer.src = card.images.small;
        cardsContainer.appendChild(cardContainer);
    });

}


fetchPokemonCards();