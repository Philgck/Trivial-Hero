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
    let heroTitle = document.getElementById('hero-name');
    let villainTitle = document.getElementById('villain-name');
    /* Mike retry button test */
    let retryButton = document.getElementById('retry-button');

    // Variables
    let incorrectAnswers = [];
    let correctAnswer = '';

    let questions = [];
    let currentQuestionIndex = 0;

    let currentCategory = "";
    let currentDifficulty = "";

    let gameState = false;

    let hero = {
        nameHero: heroName.value || "Trivial Hero",
        setName(heroName) {
            this.nameHero = heroName;
            heroTitle.innerHTML = this.nameHero;

        },
        health: 100,
        isAlive: true,
        attacks: [
            ["Trivia Tornado"],
            ["Brain Breaker"],
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
            ["Logic Lash"],
            ["Reasoning Riot"],
            ["Intellect Blast"],
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
            ["Quiz Breaker"],
            ["Trivia Trip"],
            ["Puzzle Punch"],
            ["Conundrum Crunch"],
            ["Riddle Strike"],
            ["Enigma Explosion"],
            ["Mystery Melter"],
            ["Pondering Punch"],
            ["Brain Blender"],
            ["Knowledge Knockout"],
            ["Whirling Wisdon"],
            ["Insight Impact"],
            ["Logic Lunge"],
            ["Reasoning Rumble"],
            ["Intellect Inferno"],
            ["Cognition Clash"],
            ["Meltdown Mayhem"]
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
    let fullScreenArea = document.getElementById("fullscreen-area");
    let fsbtn = document.getElementById("fsbtn");


    // Event listeners
    answer1.addEventListener('click', (e) => checkAnswer(e, currentDifficulty));
    answer2.addEventListener('click', (e) => checkAnswer(e, currentDifficulty));
    answer3.addEventListener('click', (e) => checkAnswer(e, currentDifficulty));
    answer4.addEventListener('click', (e) => checkAnswer(e, currentDifficulty));
    questionCategory.addEventListener('change', fetchQuestions);
    difficultySelector.addEventListener('change', fetchQuestions);
    heroName.addEventListener('change', () => hero.setName(heroName.value));
    document.getElementById('startGame').addEventListener('click', startGame);
    document.getElementById('startAgain').addEventListener('click', resetGame);
    document.getElementById('menu').addEventListener('click', function () {
        document.getElementById('fullscreen-overlay').style.visibility = 'visible';
    });

    function startGame() {
        // Hide the start screen and show the game screen
        document.getElementById('fullscreen-overlay').style.visibility = 'hidden';
        gameState = true;
        resetGame();
    }

    function resetGame() {
        // Show the start screen and hide the game screen
        document.getElementById('fullscreen-overlay').style.visibility = 'visible';

        // Reset hero and villain health and status

        hero.health = 100;
        hero.isAlive = true;
        villain.health = 100;
        vaillain.isAlive = true;

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

    /**
     * Fetches 50 questions from the Open Trivia Database API and stores them.
     * 
     * @async
     * @function fetchQuestions
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
            if (currentQuestionIndex === 1) {
                // Generate a random prefix and suffix for the villain's name
                const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
                const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
                const categoryWords = currentCategory.split(" ");
                const lastWord = categoryWords[categoryWords.length - 1];
                // Combine the random prefix, last word of the category, and random suffix to create the villain's name
                villain.nameVillain = `${randomPrefix} "${lastWord}" ${randomSuffix}`;
                villainTitle.innerHTML = villain.nameVillain;
            }

            // Set the hero's name dynamically based on the user input
            if (!hero.nameHero) {
                hero.nameHero = "Trivial Hero";
            }
            heroTitle.innerHTML = hero.nameHero;

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
        disableAnswers(); // Disable the answers when one is selected

        if (e.target.innerHTML === correctAnswer) {
            e.target.style.backgroundColor = 'green'; // Highlight the correct answer in green
            e.target.style.color = 'white'; // Change the text color to white
            e.target.style.fontWeight = 'bold'; // Add bold text style
        } else {
            e.target.style.backgroundColor = 'red'; // Highlight the incorrect answer in red
            e.target.style.color = 'white'; // Change the text color to white
            e.target.style.fontWeight = 'bold'; // Add bold text style
            // Highlight the correct answer in light green with white text when an incorrect answer is selected
            if (answer1.innerHTML === correctAnswer) {
                answer1.style.backgroundColor = 'green';
                answer1.style.color = 'white';
                answer1.style.fontWeight = 'bold';
            }
            if (answer2.innerHTML === correctAnswer) {
                answer2.style.backgroundColor = 'green';
                answer2.style.color = 'white';
                answer2.style.fontWeight = 'bold';
            }
            if (answer3.innerHTML === correctAnswer) {
                answer3.style.backgroundColor = 'green';
                answer3.style.color = 'white';
                answer3.style.fontWeight = 'bold';
            }
            if (answer4.innerHTML === correctAnswer) {
                answer4.style.backgroundColor = 'green';
                answer4.style.color = 'white';
                answer4.style.fontWeight = 'bold';
            }
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

    /* reset game function */
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

        // Reset questions and answers and hero and villain images
        currentQuestionIndex = 0;
        questions = [];
        fetchQuestions();
        heroHealthImage();
        villainHealthImage();

        // Reset answer button styles
        resetAnswerStyles();
    }

    // Fullscreen button and function
    fsbtn.addEventListener("click", () => {
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
    });

    //* Hero and villain images change dynamically based on health *//
    function heroHealthImage() {
        if (hero.health >= 50) {
            document.getElementById('hero-image').src = 'assets/images/hero1.gif';
        } else if (hero.health < 50) {
            document.getElementById('hero-image').src = 'assets/images/hero2.gif';
        }
    }

    function villainHealthImage() {
        if (villain.health >= 50) {
            document.getElementById('villain-image').src = 'assets/images/villain1.gif';
        } else if (villain.health < 50) {
            document.getElementById('villain-image').src = 'assets/images/villain2.gif';
        }
    }

    /**
     * Handles the hero's attack on the villain.
     * 
     * @function heroFight
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
            villainHealthImage();

            // Update the hero's health display
            document.getElementById('hero-health').innerText = `${hero.health}`;
            const heroHealthBar = document.getElementById('hero-health-bar');
            heroHealthBar.style.width = `${hero.health}%`;

            if (villain.health <= 0) {
                villain.health = 0;
                villain.isAlive = false;
                document.getElementById('villain-outcome').innerHTML = `${villain.nameVillain} has been defeated!`;
            } else {
                // Trigger a random event if the villain is still alive. Only triggers on hero attacks (right answers).
                randomEvent();
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
            heroHealthImage();

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

    // Random events

    /**
     * Triggers a random event with various possible outcomes for the hero and villain.
     * 
     * The function generates a random number to determine the event that occurs:
     * - 10% chance for a critical hit, dealing extra damage to the villain.
     * - 10% chance to heal the hero by 10 health points.
     * - 10% chance to heal the villain by 10 health points.
     * - 10% chance for the hero's attack to miss, negating the damage.
     * - 10% chance to change the question category.
     * - 10% chance to change the question difficulty.
     * 
     * The outcomes are displayed in the 'hero-outcome' element and the health values are capped at 100.
     * 
     * @function randomEvent
     */
    function randomEvent() {
        const randomEventChance = Math.random();
        if (randomEventChance < 0.1) { // 10% chance for a critical hit
            let randomEvent = "Critical Hit!";
            document.getElementById('hero-outcome').innerHTML += ` ${randomEvent}`;
            villain.health -= heroDamage * 0.5; // Extra 50% damage
        } else if (randomEventChance < 0.2) { // 10% chance to heal hero
            let randomEvent = `${hero.nameHero} feels invigorated and heals for 10hp!`;
            document.getElementById('hero-outcome').innerHTML += ` ${randomEvent}`;
            hero.health += 10;
            if (hero.health > 100) hero.health = 100; // Cap health at 100
        } else if (randomEventChance < 0.3) { // 10% chance to heal villain
            let randomEvent = `${hero.nameHero} felt guilty and healed ${villain.nameVillain} for 10hp!`;
            document.getElementById('hero-outcome').innerHTML += ` ${randomEvent}`;
            villain.health += 10;
            if (villain.health > 100) villain.health = 100; // Cap health at 100
        } else if (randomEventChance < 0.4) { // 10% chance to miss attack
            let randomEvent = "Attack missed!";
            document.getElementById('hero-outcome').innerHTML += ` ${randomEvent}`;
            villain.health += heroDamage; // Negate the damage
        } else if (randomEventChance < 0.5) { // 10% chance to change question category
            let categories = ["9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32"];
            let randomCategory = categories[Math.floor(Math.random() * categories.length)];
            questionCategory.value = randomCategory;
            fetchQuestions();
            let randomEvent = `In an attempt to confuse our hero the villain sets the question category to ${questionCategory.options[questionCategory.selectedIndex].text}!`;
            document.getElementById('hero-outcome').innerHTML += ` ${randomEvent}`;
            fetchQuestions();
        } else if (randomEventChance < 0.6) { // 10% chance to change question difficulty
            let difficulties = ["easy", "medium", "hard"];
            let randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
            difficultySelector.value = randomDifficulty;
            let randomEvent = `In an attempt to confuse our hero the villain sets the question difficulty to ${difficultySelector.value}!`;
            document.getElementById('hero-outcome').innerHTML += ` ${randomEvent}`;
            fetchQuestions();
        }
    }

});