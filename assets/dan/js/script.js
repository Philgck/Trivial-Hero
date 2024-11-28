document.addEventListener('DOMContentLoaded', function() {
    // Elements
    let question = document.getElementById('question-text');
    let answer1 = document.getElementById('answer1');
    let answer2 = document.getElementById('answer2');
    let answer3 = document.getElementById('answer3');
    let answer4 = document.getElementById('answer4');
    let category = document.getElementById('question-category');
    let difficulty = document.getElementById('question-difficulty');
    let questionCategory = document.getElementById('category-selector');
    let difficultySelector = document.getElementById('difficulty-selector');

    // Variables
    let incorrectAnswers = [];
    let correctAnswer = '';

    let questions = [];
    let currentQuestionIndex = 0;

    // Event listeners
    answer1.addEventListener('click', checkAnswer);
    answer2.addEventListener('click', checkAnswer);
    answer3.addEventListener('click', checkAnswer);
    answer4.addEventListener('click', checkAnswer);

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

        // Check if the questions array is empty or if we have reached the end of the array
        if (questions.length === 0 || currentQuestionIndex >= questions.length) {
            await fetchQuestions();
            currentQuestionIndex = 0;
        }

        // Get the next question from the array
        const questionData = questions[currentQuestionIndex];
        currentQuestionIndex++;

        // Update the DOM with the new question and answers
        disableAnswers();
        try {
            question.innerHTML = questionData.question;
            incorrectAnswers = [
                questionData.incorrect_answers[0],
                questionData.incorrect_answers[1],
                questionData.incorrect_answers[2]
            ];
            correctAnswer = questionData.correct_answer;
            // Shuffle the incorrect answers array
            incorrectAnswers = incorrectAnswers.sort(() => Math.random() - 0.5);
            // Insert the correct answer at a random position
            let answers = [...incorrectAnswers];
            answers.splice(Math.floor(Math.random() * 4), 0, correctAnswer);
            answer1.innerHTML = answers[0];
            answer2.innerHTML = answers[1];
            answer3.innerHTML = answers[2];
            answer4.innerHTML = answers[3];
            category.innerHTML = questionData.category;
            difficulty.innerHTML = questionData.difficulty;
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
    function checkAnswer(e) {
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
        switch (difficulty.innerHTML) {
            case 'easy':
                heroDamage = 20;
                villainDamage = 10;
                break;
            case 'medium':
                heroDamage = 20;
                villainDamage = 20;
                break;
            case 'hard':
                heroDamage = 20;
                villainDamage = 40;
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
});