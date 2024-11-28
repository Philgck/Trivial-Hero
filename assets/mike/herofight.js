hero attack game

let hero = {
    /* name chosen at same stage as difficulty or before game starts? If not generic hero? */
    name: "", 
    setName(playerName) {
        this.name = playerName;
    },
    health: 0, /* health based on difficulty. to be displayed as health bar*/
    setHealth(difficulty) {
        switch (difficulty) {
            case 'easy':
                this.health = 150;
                break;
            case 'medium':
                this.health = 100;
                break;
            case 'hard':
                this.health = 50;
                break;
            default:
                this.health = 100;
        }
    },
    isAlive: true,
    attacks: [], /* attack name to be linked to quiz */
    setAttackName(quizCorrectAnswer) {
        this.correctAttackName = quizCorrectAnswer;
    },

    attack() {
        let damage = Math.floor(Math.random() * 10) + 1;
        return [this.correctAttackName, damage];
    }
};

let villain = {
    name: "", /* name chosen randomly by API? */
    setName(villainName) {
        this.name = villainName;
    },
    health: 0, /* health based on difficulty */
    setHealth(difficulty) {
        switch (difficulty) {
            case 'easy':
                this.health = 150;
                break;
            case 'medium':
                this.health = 100;
                break;
            case 'hard':
                this.health = 50;
                break;
            default:
                this.health = 100;
        };
    },
    isAlive: true,
    attacks: [], /* attack name needs linking to quiz wrong answer */
    setAttackName(quizWrongAnswer) {
        this.wrongAttackName = quizWrongAnswer;
    },

    attack() {
        let damage = Math.floor(Math.random() * 10) + 1;
        return [this.wrongAttackName, damage];
    }
};

function heroFight {
    while (hero.isAlive && villain.isAlive) {
        let heroAttack = hero.attack();
        /* display attack on screen */
        document.getElementById('screen-section').innerHTML += `${hero.name} attacked with ${heroAttack[0]} for ${heroAttack[1]} damage!<br>`;
        villain.health -= heroAttack[1];

        if (villain.health <= 0) {
            villain.isAlive = false;
            /* display vistory on screen */
            document.getElementById('screen-section').innerHTML += `${villain.name} has been defeated!`;
        },
    }
};

function villainFight {
    while (hero.isAlive && villain.isAlive) {

        let villainAttack = villain.attack();
        /* display attack on screen */
        document.getElementById('screen-section').innerHTML += `${villain.name} attacked with ${villainAttack[0]} for ${villainAttack[1]} damage!<br>`;
        hero.health -= villainAttack[1];

        if (hero.health <= 0) {
            hero.isAlive = false;
            /* display defeat on screen */
            document.getElementById('screen-section').innerHTML += `${hero.name} has been defeated!`;
        },
    }
};

