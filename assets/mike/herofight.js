hero attack game

let hero = {
    name: "", /* name chosen at same stage as difficulty or before game starts? If not generic hero? */
    setName(playerName) {
        this.name = playerName;
    };
    health: "", /* health based on difficulty. to be displayed as health bar*/
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
    };
    isAlive: true,
    attacks: [], /* attack name to be linked to quiz */
    setAttackName(quizCorrectAnswer) {
        correct.attackName = quizCorrectAnswer;
    };

    attack() {
        let damage = Math.floor(Math.random() * 10) + 1;
        return [correct.attackName, damage];
    };
};

let villain = {
    name: "", /* name chosen randomly by API? */
    setName(villainName) {
        this.name = villainName;
    };
    /* health based on difficulty */
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
    };
    isAlive: true,
    attacks: [], /* attack name needs linking to quiz wrong answer */
    setAttackName(quizWrongAnswer) {
        wrong.attackName = quizWrongAnswer;
    };

    attack() {
        let damage = Math.floor(Math.random() * 10) + 1;
        return [wrong.attackName, damage];
    };
};

function heroFight {
    while (hero.isAlive && villain.isAlive) {
        let heroAttack = hero.attack();
        document.getElementById('viewscreen').innerHTML += `${hero.name} attacked with ${heroAttack[0]} for ${heroAttack[1]} damage!<br>`;
        villain.health -= heroAttack[1];

        if (villain.health <= 0) {
            villain.isAlive = false;
            console.log(`${villain.name} has been defeated!`);
        };
    };
};

function villainFight {
    while (hero.isAlive && villain.isAlive) {

        let villainAttack = villain.attack();
        document.getElementById('viewscreen').innerHTML += `${villain.name} attacked with ${villainAttack[0]} for ${villainAttack[1]} damage!<br>`;
        hero.health -= villainAttack[1];

        if (hero.health <= 0) {
            hero.isAlive = false;
            console.log(`${hero.name} has been defeated!`);
        };
    };
};

fight(hero, villain);