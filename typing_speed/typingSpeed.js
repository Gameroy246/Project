const texts = [
    "Technology is constantly evolving, shaping the way we communicate, work, and live. From the invention of the wheel to the rise of artificial intelligence, human innovation has always pushed the boundaries of what is possible. The internet has revolutionized access to information, allowing people from all around the world to connect instantly. Social media platforms have transformed the way we interact, enabling the sharing of ideas, opinions, and news in real time. As we move forward, the ethical implications of technological advancements remain a crucial topic of discussion.",
    
    "Reading books enhances knowledge, expands vocabulary, and improves cognitive skills. Whether it’s fiction or non-fiction, books allow readers to explore new perspectives and ideas. A well-written novel can transport readers into an entirely different world, making them feel as if they are experiencing the story firsthand. Meanwhile, non-fiction books provide factual information, helping individuals learn about history, science, and philosophy. The habit of reading regularly contributes to mental stimulation and reduces stress, making it an essential activity for personal growth.",
    
    "Physical fitness plays a crucial role in overall health and well-being. Regular exercise strengthens muscles, improves cardiovascular health, and enhances mental clarity. A balanced diet, combined with an active lifestyle, helps prevent chronic diseases such as diabetes and heart disease. Engaging in sports and outdoor activities not only boosts physical fitness but also promotes teamwork and discipline. As people become more aware of the importance of maintaining a healthy lifestyle, fitness programs and wellness initiatives continue to gain popularity worldwide.",
    
    "The universe is vast, mysterious, and full of wonders beyond human comprehension. Scientists estimate that there are billions of galaxies, each containing millions of stars and planets. The search for extraterrestrial life has fascinated astronomers for decades, leading to the development of advanced telescopes and space exploration missions. Black holes, neutron stars, and exoplanets are just a few of the many cosmic phenomena that continue to intrigue researchers. As technology advances, our understanding of the universe is expected to expand, unlocking new possibilities for space travel and discovery."
];

let currentText = "";
let timer = 60; // Default to 1-minute timer
let interval;
let isTyping = false;
let finalWPM = 0;
let finalAccuracy = 100;

const textElement = document.getElementById("text");
const inputElement = document.getElementById("input");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const timeSelection = document.getElementById("timeSelection");

function startTest(selectedTime) {
    timer = selectedTime;
    currentText = texts[Math.floor(Math.random() * texts.length)];
    textElement.innerHTML = currentText.split("").map(letter => `<span>${letter}</span>`).join("");
    inputElement.value = "";
    inputElement.focus();
    isTyping = false;
    clearInterval(interval);
    
    // Reset stats
    timerElement.innerText = timer;
    wpmElement.innerText = finalWPM; // Keep last WPM value
    accuracyElement.innerText = finalAccuracy; // Keep last Accuracy value

    inputElement.disabled = false;
}

function updateTyping() {
    if (!isTyping) {
        isTyping = true;
        interval = setInterval(() => {
            if (timer > 0) {
                timer--;
                timerElement.innerText = timer;
            } else {
                clearInterval(interval);
                inputElement.disabled = true;
                saveFinalStats(); // Save final WPM & Accuracy when timer stops
            }
        }, 1000);
    }

    const inputText = inputElement.value;
    const textSpans = textElement.querySelectorAll("span");
    let correctChars = 0;
    
    textSpans.forEach((span, index) => {
        const typedChar = inputText[index];

        if (typedChar == null) {
            span.classList.remove("correct", "incorrect");
        } else if (typedChar === span.innerText) {
            span.classList.add("correct");
            span.classList.remove("incorrect");
            correctChars++;
        } else {
            span.classList.add("incorrect");
            span.classList.remove("correct");
        }
    });

    const wordsTyped = inputText.trim().split(/\s+/).length;
    const wpm = timer > 0 ? Math.round((wordsTyped / (60 - timer)) * 60) : finalWPM;
    const accuracy = Math.round((correctChars / inputText.length) * 100);

    finalWPM = wpm; // Store final WPM
    finalAccuracy = isNaN(accuracy) ? 100 : accuracy; // Store final Accuracy

    wpmElement.innerText = finalWPM;
    accuracyElement.innerText = finalAccuracy;
}

function saveFinalStats() {
    wpmElement.innerText = finalWPM; // Keep final WPM after timer stops
    accuracyElement.innerText = finalAccuracy; // Keep final Accuracy after timer stops
}

function resetTest(selectedTime) {
    finalWPM = 0; // Reset stored WPM
    finalAccuracy = 100; // Reset stored Accuracy
    startTest(selectedTime);
}

timeSelection.addEventListener("change", function() {
    resetTest(parseInt(this.value));
});

inputElement.addEventListener("input", updateTyping);
startTest(60);
