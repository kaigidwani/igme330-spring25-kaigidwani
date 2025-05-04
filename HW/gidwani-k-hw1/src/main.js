// === Fields ===

// Save the output paragraph
let outputP = document.querySelector("#output");

// Save the buttons
let firstButton = document.querySelector("#firstButton");
let hiddenButton = document.querySelector("#hiddenButton");

let words1 = [];
let words2 = [];
let words3 = [];


// === Functions ===

// Generates technobabble on the screen
let generateTechnobabble = (num) => {
    let technobabble = "";

    for(let i = 0; i < num; i++) {
        technobabble += `${words1[Math.floor(Math.random() * words1.length)]} 
        ${words2[Math.floor(Math.random() * words2.length)]} 
        ${words3[Math.floor(Math.random() * words3.length)]}<br>`;
    }
    outputP.innerHTML = technobabble;
}

let loadBabble = () => {
    fetch("data/babble-data.json")
        .then(response => {
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Loaded data:", data);
            // Use the data!
            words1 = data[0].words1;
            words2 = data[0].words2;
            words3 = data[0].words3;

            // When the button is clicked, generate technobabble
            firstButton.addEventListener("click", () => {
                generateTechnobabble(1);
            });
            hiddenButton.addEventListener("click", () => {
                generateTechnobabble(5);
            });

            // Generate the technobabble for the first time when the page loads
            generateTechnobabble(1);
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

// Load babble data
loadBabble();