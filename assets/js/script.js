document.addEventListener('DOMContentLoaded', function () {
    // Elements
    let question = document.getElementById('question-text');
    let answer1 = document.getElementById('answer1');
    let answer2 = document.getElementById('answer2');
    let answer3 = document.getElementById('answer3');
    let answer4 = document.getElementById('answer4');
    let questionCategory = document.getElementById('category-selector');
    let difficultySelector = document.getElementById('difficulty-selector');
    let heroName = document.getElementById('hero-name-input');
    /* Mike retry button test */
    let retryButton = document.getElementById('retry-button');

    // Variables
    let incorrectAnswers = [];
    let correctAnswer = '';

    let questions = [];
    let currentQuestionIndex = 0;

    let currentCategory = "";
    let currentDifficulty = "";

    let gameState = true;

    let hero = {
        /* To Do name chosen at same stage as difficulty or before game starts. If not generic hero? if names empty add default*/
        nameHero: heroName.value || "Trivial Hero",
        setName(heroName) {
            this.nameHero = heroName;
        },
        health: 100, /* To DO displayed as health bar */
        isAlive: true,
        attacks: [
            ["Trivia Tornado"],
            ["Brain Buster"],
            ["Fact Frenzy"],
            ["Quiz Quake"],
            ["Trivia Tsunami"],
            ["Puzzle Pummel"],
            ["Conundrum Crush"],
            ["Riddle Rampage"],
            ["Enigma Eruption"],
            ["Mystery Maelstrom"],
            ["Paradox Punch"],
            ["Brainwave Blitz"],
            ["Knowledge Knockdown"],
            ["Wisdom Whirlwind"],
            ["Insight Impact"],
            ["Logic Lunge"],
            ["Reasoning Rumble"],
            ["Intellect Inferno"],
            ["Cognition Clash"],
            ["Mind Meltdown"]
        ],

        attack() {
            let rand = Math.floor(Math.random() * this.attacks.length);
            return [this.attacks[rand]];
        }
    };

    let villain = {
        nameVillain: "",
        health: 100,
        isAlive: true,
        attacks: [
            ["Knowledge Knockout"],
            ["Smarty Smash"],
            ["Answer Avalanche"],
            ["Quiz Quake"],
            ["Trivia Tsunami"],
            ["Puzzle Pummel"],
            ["Conundrum Crush"],
            ["Riddle Rampage"],
            ["Enigma Eruption"],
            ["Mystery Maelstrom"],
            ["Paradox Punch"],
            ["Brainwave Blitz"],
            ["Knowledge Knockdown"],
            ["Wisdom Whirlwind"],
            ["Insight Impact"],
            ["Logic Lunge"],
            ["Reasoning Rumble"],
            ["Intellect Inferno"],
            ["Cognition Clash"],
            ["Mind Meltdown"]
        ],

        /* code below for linking main attack to wrong answer in quiz 
        
        setAttackName(quizWrongAnswer) {
            this.wrongAttackName = quizWrongAnswer;
        }, 
        */

        attack() {
            let rand = Math.floor(Math.random() * this.attacks.length);
            return [this.attacks[rand]];
        }
    };

    /* Mike Delete? fullscreen button */
    /* let fullScreenArea = document.getElementById("fullscreen-area");
    let fsbtn = document.getElementById("fsbtn"); */


    // Event listeners
    answer1.addEventListener('click', (e) => checkAnswer(e, currentDifficulty));
    answer2.addEventListener('click', (e) => checkAnswer(e, currentDifficulty));
    answer3.addEventListener('click', (e) => checkAnswer(e, currentDifficulty));
    answer4.addEventListener('click', (e) => checkAnswer(e, currentDifficulty));
    questionCategory.addEventListener('change', fetchQuestions);
    difficultySelector.addEventListener('change', fetchQuestions);
    heroName.addEventListener('change', () => hero.setName(heroName.value));
    /* Mike retry button test */
    retryButton.addEventListener('click', () => location.reload());

    fetchQuestions();

    /**
     * Fetches 50 questions from the Open Trivia Database API and stores them.
     * 
     * @async
     * @function fetchQuestions
     * @returns {Promise<void>} A promise that resolves when the questions have been fetched and stored.
     * @throws Will log an error message if the fetch request fails.
     */
    async function fetchQuestions() {
        try {
            const response = await fetch(`https://opentdb.com/api.php?amount=50&type=multiple&category=${questionCategory.value}&difficulty=${difficultySelector.value}`);
            const data = await response.json();
            // Check if the response contains any results, otherwise log an error message with the response code
            if (!data.results || data.results.length === 0) {
                console.error('No results found');
                console.log('Response Code:', data.response_code);
                return;
            }
            // Store the questions in the global variable
            questions = data.results;
        } catch (error) {
            console.error('Error fetching data:', error);
        }

        generateQuestion();

    }


    /**
     * This function checks if the questions array is empty or if the current question index
     * has reached the end of the array. If so, it fetches new questions and resets the index.
     * It then updates the DOM with the new question and its answers, shuffling the incorrect
     * answers and inserting the correct answer at a random position.
     * 
     * @async
     * @function generateQuestion
     * @throws Will log an error to the console if there is an issue fetching data.
     */
    async function generateQuestion() {
        if (questions.length === 0 || currentQuestionIndex >= questions.length) {
            await fetchQuestions();
            currentQuestionIndex = 0;
        }

        const questionData = questions[currentQuestionIndex];
        currentQuestionIndex++;

        disableAnswers();
        try {
            question.innerHTML = questionData.question;
            incorrectAnswers = [
                questionData.incorrect_answers[0],
                questionData.incorrect_answers[1],
                questionData.incorrect_answers[2]
            ];
            correctAnswer = questionData.correct_answer;
            incorrectAnswers = incorrectAnswers.sort(() => Math.random() - 0.5);
            let answers = [...incorrectAnswers];
            answers.splice(Math.floor(Math.random() * 4), 0, correctAnswer);
            answer1.innerHTML = answers[0];
            answer2.innerHTML = answers[1];
            answer3.innerHTML = answers[2];
            answer4.innerHTML = answers[3];
            currentDifficulty = questionData.difficulty; // Store as string
            currentCategory = questionData.category; // Store as string

            // Set the villain's name dynamically based on the current category
            const prefixes = ["Dr.", "Evil", "Master", "Lord", "Professor", "Baron", "Count", "Duke", "Emperor", "General", "King",
                "Prince", "Queen", "Sir", "Warlord", "Wizard", "Overlord", "Commander", "Captain", "Chief"];
            const suffixes = [
                "the Terrible", "the Wicked", "the Cruel", "the Malevolent", "the Vicious", "the Sinister",
                "the Ruthless", "the Merciless", "the Savage", "the Fierce", "the Brutal", "the Grim",
                "the Dreadful", "the Fearsome", "the Horrible", "the Menacing", "the Nefarious",
                "the Villainous", "the Malicious"
            ];
            const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
            const categoryWords = currentCategory.split(" ");
            const lastWord = categoryWords[categoryWords.length - 1];
            villain.nameVillain = `${randomPrefix} "${lastWord}" ${randomSuffix}`;

            enableAnswers();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    /**
     * Checks if the selected answer is correct and updates the UI accordingly.
     * 
     * @function checkAnswer
     * @param {Event} e - The event object representing the click event.
     */
    function checkAnswer(e, currentDifficulty) {
        if (e.target.innerHTML === correctAnswer) {
            e.target.style.backgroundColor = 'green';
        } else {
            e.target.style.backgroundColor = 'red';
            // Highlight the correct answer in light green
            if (answer1.innerHTML === correctAnswer) {
                answer1.style.backgroundColor = '#d4edda';
                answer1.style.color = 'black';
            }
            if (answer2.innerHTML === correctAnswer) {
                answer2.style.backgroundColor = '#d4edda';
                answer2.style.color = 'black';
            }
            if (answer3.innerHTML === correctAnswer) {
                answer3.style.backgroundColor = '#d4edda';
                answer3.style.color = 'black';
            }
            if (answer4.innerHTML === correctAnswer) {
                answer4.style.backgroundColor = '#d4edda';
                answer4.style.color = 'black';
            }
        }

        // Check the difficulty of the question and log the corresponding damage value
        // Damage varies based on the difficulty level
        let heroDamage = 0;
        let villainDamage = 0;
        switch (currentDifficulty) { // Use currentDifficulty as a string
            case "easy":
                heroDamage = 20;
                villainDamage = 10;
                break;
            case "medium":
                heroDamage = 20;
                villainDamage = 20;
                break;
            case "hard":
                heroDamage = 20;
                villainDamage = 30;
                break;
        }
        // Disable the answers and wait 2 seconds before generating a new question
        setTimeout(() => {
            resetAnswerStyles();
            generateQuestion();
        }, 2000);

        // Call the heroFight or villainFight function depending on if the answer was correct
        if (e.target.innerHTML === correctAnswer) {
            heroFight(heroDamage);
        } else {
            villainFight(villainDamage);
        }

    }

    /**
     * Resets the styles of the answer buttons to their default state.
     * 
     * @function resetAnswerStyles
     */
    function resetAnswerStyles() {
        answer1.style.backgroundColor = '';
        answer1.style.color = '';
        answer2.style.backgroundColor = '';
        answer2.style.color = '';
        answer3.style.backgroundColor = '';
        answer3.style.color = '';
        answer4.style.backgroundColor = '';
        answer4.style.color = '';
    }

    /**
     * Disables the answer buttons to prevent further clicks.
     * 
     * @function disableAnswers
     */
    function disableAnswers() {
        answer1.disabled = true;
        answer2.disabled = true;
        answer3.disabled = true;
        answer4.disabled = true;
    }

    /**
     * Enables the answer buttons to allow user interaction.
     * 
     * @function enableAnswers
     */
    function enableAnswers() {
        answer1.disabled = false;
        answer2.disabled = false;
        answer3.disabled = false;
        answer4.disabled = false;
    }

    /* MIKE reset game function */
    function resetGame() {
        // Reset hero and villain health and status
        hero.health = 100;
        hero.isAlive = true;
        villain.health = 100;
        villain.isAlive = true;

        // Update health bars
        document.getElementById('hero-health').innerText = `${hero.health}%`;
        document.getElementById('hero-health-bar').style.width = `${hero.health}%`;
        document.getElementById('villain-health').innerText = `${villain.health}%`;
        document.getElementById('villain-health-bar').style.width = `${villain.health}%`;

        // Clear outcomes
        document.getElementById('hero-outcome').innerHTML = '';
        document.getElementById('villain-outcome').innerHTML = '';

        // Reset questions and answers
        currentQuestionIndex = 0;
        questions = [];
        fetchQuestions();

        // Reset answer button styles
        resetAnswerStyles();
    }

    /* MIKE delete? fullscreen button test */
    /* fsbtn.addEventListener("click", () => {
        if (fsbtn.textContent == "Go Fullscreen") {
            if (fullScreenArea.requestFullscreen) {
                fullScreenArea.requestFullscreen();
            } else if (fullScreenArea.msRequestFullscreen) {
                fullScreenArea.msRequestFullscreen();
            } else if (fullScreenArea.mozRequestFullScreen) {
                fullScreenArea.mozRequestFullScreen();
            } else if (fullScreenArea.webkitRequestFullscreen) {
                fullScreenArea.webkitRequestFullscreen();
            }
    
            fsbtn.textContent = "Exit Fullscreen";

        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
    
            fsbtn.textContent = "Go Fullscreen";

        }
    }); */

    /**
     * Handles the hero's attack on the villain.
     * 
     * @function heroFight
     * @param {number} heroDamage - The amount of damage the hero deals.
     */
    function heroFight(heroDamage) {
        if (hero.nameHero === "") {
            hero.setName("Trivial Hero");
        }
        if (villain.nameVillain === "") {
            villain.setName("Villain");
        }

        if (hero.isAlive && villain.isAlive) {
            let heroAttack = hero.attack();
            document.getElementById('hero-outcome').innerHTML = `${hero.nameHero} attacked with ${heroAttack[0]} for ${heroDamage} damage!`;
            villain.health -= heroDamage;

            if (villain.health <= 0) {
                /* MIKE health doesnt drop below 0 */
                villain.health = 0;

                villain.isAlive = false;
                document.getElementById('villain-outcome').innerHTML = `${villain.nameVillain} has been defeated!`;
            }

            // Update the villain's health display
            document.getElementById('villain-health').innerText = `${villain.health}`;
            const healthBar = document.getElementById('villain-health-bar');
            healthBar.style.width = `${villain.health}%`;
        }
    }

    /**
     * Handles the villain's attack on the hero.
     * 
     * @function villainFight
     * @param {number} villainDamage - The amount of damage the villain deals.
     */
    function villainFight(villainDamage) {
        if (hero.nameHero === "") {
            hero.setName("Trivial Hero");
        }
        if (villain.nameVillain === "") {
            villain.setName("Villain");
        }

        if (hero.isAlive && villain.isAlive) {
            let villainAttack = villain.attack();
            document.getElementById('villain-outcome').innerHTML = `${villain.nameVillain} attacked with ${villainAttack[0]} for ${villainDamage} damage!`;
            hero.health -= villainDamage;

            if (hero.health <= 0) {
                /* MIKE health doesnt drop below 0 */
                hero.health = 0;
                hero.isAlive = false;
                document.getElementById('hero-outcome').innerHTML = `${hero.nameHero} has been defeated!`;
            }
            // Update the villain's health display
            document.getElementById('hero-health').innerText = `${hero.health}`;
            const healthBar = document.getElementById('hero-health-bar');
            healthBar.style.width = `${hero.health}%`;
        }
    }

});