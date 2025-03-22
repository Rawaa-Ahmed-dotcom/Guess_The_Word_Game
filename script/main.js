//setting game name
let gameName = "Guess The Word Game";
document.querySelector("h1").innerHTML = gameName;
document.title = gameName;
// document.querySelector("footer").innerHTML = `${gameName} Created By ELzero Web School`;

//setting game inputs
let numberOfTrails = 6;
let numberOfLetters = 6;
let currentTrail = 1;
let numberOfHints = 2;
document.querySelector(".hint span").innerHTML = numberOfHints;
// manage Words 
let wordToGuess = "";
let words = [
    "Create", 
    "Update", 
    "Delete", 
    "Master", 
    "Branch", 
    "Mainly",
    "Elzero", 
    "School"
];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");  
console.log(wordToGuess);
function displayInputs() {
    const inputsContainer = document.querySelector(".inputs");
    let temp = ``;
    for(let i = 1; i <= numberOfTrails; i++) {
        temp += `<div class="trail Trail-${i} ${i !== 1 ? "disabled-inputs" : ""}" data-trail = "${i}" >
        <span>Trail ${i}</span>
        ${generateInputs(i)}
        </div>`;
    }
    inputsContainer.innerHTML = temp;

    inputsContainer.children[0].children[1].focus();
}
displayInputs();

function generateInputs(i) {
    let temp = ``;
    for(let j = 1; j <=numberOfLetters; j++) {
        temp += `<input type="text" maxlength="1" class="input-${j}" data-input="${j}" auto-complete="off" id="trail-${i}_input-${j}">`;
    }
    return temp;
}

function disableInputs() {
    const inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
    inputsInDisabledDiv.forEach((input) => input.disabled = true);
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input,index) => {
        input.addEventListener("input" , (e) => {
            if(e.data !== null) {
                input.value = input.value.toUpperCase();
                let nextInput = inputs[index + 1];
                if(nextInput) {
                    nextInput.focus();
                }
            }
            
        });
        input.addEventListener("keydown" , (e) => {
            const currentIndex = Array.from(inputs).indexOf(e.target); 
            nextInput = inputs[index + 1];
            previousInput = inputs[index - 1];
            if(e.key == "ArrowLeft" ) {
                const prevInput = currentIndex - 1;
                if(prevInput >= 0) { 
                    inputs[prevInput].focus();
                }
            }
            else if(e.key === "ArrowRight") {
                const nextInput = currentIndex + 1;
                if(nextInput < inputs.length) { 
                    inputs[nextInput].focus();
                }
            }
        })
        
    })
}

const checkButton = document.querySelector(".check");
checkButton.addEventListener("click" , handleGuess);
function handleGuess() {
    let successGuess = true;
    for (let i = 1; i <= numberOfLetters; i++) {
    const inputField = document.querySelector(`#trail-${currentTrail}_input-${i}`);
    const letter = inputField.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];

    // Game Logic
    if (letter === actualLetter) {
      // Letter Is Correct And In Place
        inputField.classList.add("in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      // Letter Is Correct And Not In Place
        inputField.classList.add("not-in-place");
        successGuess = false;
    } else {
        inputField.classList.add("no");
        successGuess = false;
    }
}
// check if user win or lose 
if(successGuess) {
    messageArea.innerHTML = `You Win The Word is After <span>${currentTrail} Trails</span>`;
    let allTrials = document.querySelectorAll(".inputs > div");
    allTrials.forEach((trial) => trial.classList.add("disabled-inputs"));
    checkButton.disabled = true;
}
else {
    let allTrials = document.querySelectorAll(".inputs > div");
    allTrials.forEach((trial) => trial.classList.add("disabled-inputs"));
    currentTrail++;
    if(currentTrail - 1 < numberOfTrails) {
        allTrials[currentTrail - 1].classList.remove("disabled-inputs");
        document.querySelectorAll(`.Trail-${currentTrail} input`).forEach((input) => input.disabled = false);
        allTrials[currentTrail - 1].children[1].focus();
    }
    if(currentTrail - 1 === numberOfTrails) {
        messageArea.innerHTML = `You Lose The Word is <span>${wordToGuess}</span>`;
        checkButton.disabled = true;
    }
}
}
// manage Hints
const hintButton = document.querySelector(".hint");
hintButton.addEventListener("click" , manageHints);

function manageHints() {
    if(numberOfHints > 0) {
        --numberOfHints;
        document.querySelector(".hint span").innerHTML = numberOfHints;
    }
    if(numberOfHints === 0) {
        hintButton.disabled = true;
    }
    const enabledInputs = document.querySelectorAll(".inputs > div:not(.disabled-inputs) input");
    const enabledEmptyInputs = Array.from(enabledInputs).filter((input) => input.value === "");
    if(enabledEmptyInputs.length > 0) {
        const randomEmptyInput = enabledEmptyInputs[Math.floor(Math.random() * enabledEmptyInputs.length)];
        const indexToFill = Array.from(enabledInputs).indexOf(randomEmptyInput);
        randomEmptyInput.value = wordToGuess[indexToFill].toUpperCase();
        randomEmptyInput.classList.add("in-place");
    }
}

function handleBackSapce(event){
    if(event.key === "Backspace") {
        let inputs = Array.from(document.querySelectorAll("input:not([disabled])"));
        let currentIndex  = inputs.indexOf(document.activeElement);
        if(currentIndex  > 0) {
            let currentInput = inputs[currentIndex];
            let prevInput = inputs[currentIndex - 1];
            currentInput.value = "";
            prevInput.focus();
        }
    }
}

document.addEventListener("keydown",handleBackSapce);
disableInputs();
