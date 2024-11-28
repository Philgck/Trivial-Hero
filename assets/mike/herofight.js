let hero = {
    /* To Do name chosen at same stage as difficulty or before game starts. If not generic hero? if names empty add default*/
    nameHero: "", 
    setName(playerName) {
        this.nameHero = playerName;
    },
    health: 100, 
    /* health bar link */
    updateHealthBar() {
        const healthPercentage = (this.health / 100) * 100;
        document.getElementById('hero-health').innerText = `${this.health}%`;
        document.getElementById('hero-health-bar').style.width = `${healthPercentage}%`;
    },
    isAlive: true,
    attacks: [
        ["Trivia Tornado", 10],
        ["Brain Buster", 2],
        ["Fact Frenzy", 5],
    ], 

    attack() {
        let rand = Math.floor(Math.random() * this.attacks.length);
        return this.attacks[rand, heroDamage];
    }
};

let villain = {
    nameVillain: "", /* To Do name chosen randomly by API? */
    setName(villainName) {
        this.nameVillain = villainName;
    },
    health: 100, 
    /* health bar link */
    updateHealthBar() {
        const healthPercentage = (this.health / 100) * 100;
        document.getElementById('villain-health').innerText = `${this.health}%`;
        document.getElementById('villain-health-bar').style.width = `${healthPercentage}%`;
    },
    isAlive: true,
    attacks: [
        ["Knowledge Knockout", 10],
        ["Smarty Smash", 2],
        ["Answer Avalanche", 5],
    ],
    
    /* code below for linking main attack to wrong answer in quiz 
    
    setAttackName(quizWrongAnswer) {
        this.wrongAttackName = quizWrongAnswer;
    }, 
    */

    attack() {
        let rand = Math.floor(Math.random() * this.attacks.length);
        return this.attacks[rand, villainDamage];
    }
};

function heroFight {
    while (hero.isAlive && villain.isAlive) {
        let heroAttack = hero.attack(damage);
        /* display attack on screen */
        document.getElementById('screen-section').innerHTML += `${hero.name} attacked with ${heroAttack[0]} for ${heroAttack[1]} damage!<br>`;
        villain.health -= heroAttack[1];
        villain.updateHealthBar();

        if (villain.health <= 0) {
            villain.isAlive = false;
            /* display victory on screen */
            document.getElementById('screen-section').innerHTML += `${villain.name} has been defeated!`;
        },
    }
};

function villainFight {
    while (hero.isAlive && villain.isAlive) {

        let villainAttack = villain.attack(damage);
        /* display attack on screen */
        document.getElementById('screen-section').innerHTML += `${villain.name} attacked with ${villainAttack[0]} for ${villainAttack[1]} damage!<br>`;
        hero.health -= villainAttack[1];
        hero.updateHealthBar();

        if (hero.health <= 0) {
            hero.isAlive = false;
            /* display defeat on screen */
            document.getElementById('screen-section').innerHTML += `${hero.name} has been defeated!`;
        },
    }
};

