hero attack game

let hero = {
    /* To Do name chosen at same stage as difficulty or before game starts. If not generic hero? if names empty add default*/
    name: "", 
    setName(playerName) {
        this.name = playerName;
    },
    health: 100, /* To DO displayed as health bar */
    document.getElementById('hero-health').innerText = `Health: ${this.health}`;
    isAlive: true,
    attacks: [
        ["the showdown!", 10],
        ["fact attack", 2],
        ["flying nose cruncher", 5],
    ], 

    attack() {
        let rand = Math.floor(Math.random() * this.attacks.length);
        return this.attacks[rand, damage];
    }
};

let villain = {
    name: "", /* To Do name chosen randomly by API? */
    setName(villainName) {
        this.name = villainName;
    },
    health: 100, /* To Do health based on difficulty */
    document.getElementById('hero-health').innerText = `Health: ${this.health}`;
    isAlive: true,
    attacks: [
        ["web shooter", 10],
        ["punch", 2],
        ["swing kick", 5],
    ], /* attack name needs linking to quiz wrong answer */
    
    /* code below for linking main attack to wrong answer in quiz */
    
    setAttackName(quizWrongAnswer) {
        this.wrongAttackName = quizWrongAnswer;
    }, 
    */

    attack() {
        let rand = Math.floor(Math.random() * this.attacks.length);
        return this.attacks[rand, damage];
    }
};

function heroFight {
    while (hero.isAlive && villain.isAlive) {
        let heroAttack = hero.attack(damage);
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

        let villainAttack = villain.attack(damage);
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

