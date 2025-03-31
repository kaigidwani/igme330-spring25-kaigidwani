// // function Person(name, age) {
// //     this.name = name;
// //     this.age = age;
// // }

// // Person.prototype.quack = function () {
// //     console.log('quack');
// // }

// // class Person {
// //     #ssn;

// //     static planet = `earth`;

// //     constructor(name, age, ssn) {
// //         this.name = name;
// //         this.age = age;
// //         this.#ssn = ssn
// //     }

// //     static makeYoungPerson() {
// //         const age = Math.floor(Math.random() * 18);
// //         return new Person(null, age);
// //     }

// //     quack() {
// //         console.log(`quack`, this.#ssn);
// //     }
// // }

// // const me = new Person('travis', 22, `11111111`);

// // console.log(me.#ssn);

// // me.quack();

// // // sometimes people make classes that are just collections of methods and other useful things
// // class Util {
// //     static add(a, b) {
// //         return a + b;
// //     }
// // }

// const flyer = {
//     fly() {
//         console.log(`because im freeeeeee freeee faallllliinnnnggg`);
//     }
// }

// const quacker = {
//     quack() {
//         console.log(`QUACK ${this.voice} QUACK`);
//     }
// }

// class Animal {
//     constructor(name, voice) {
//         this.name = name;
//         this.voice = voice;
//     }
// }

// class Duck extends Animal {
//     constructor(name, inheritance){
//         super(name, 'quack');
//         this.moneys = inheritance;
//     }
// }

// // Inject the fly and quack methods into the Duck class.
// // This is called Mix-in or class composition
// Object.assign(Duck.prototype, flyer, quacker);

// // Money is always represented in cents. this is $318,500,000,001.00 <- INCLUDES CENTS
// const quackers = new Duck('Quackers', 32850000000100);

// quackers.fly();
// quackers.quack();

const Duck = (name, inheritance) => {
    return {
        name: name,
        inheritance: inheritance,
        voice: 'quack',
        quack() {
            console.log(this.voice);
        },
        fly() {
            console.log(`because im freeeeeee freeee faallllliinnnnggg`);
        }
    }
}

const quackers = Duck('quackers', 99900);
quackers.quack();