// Closure example: "private" variable c is in the function scope
function setCounter() {
    let c = 0; // "private" variable of the closure
    return function () {
        c++; 
        return(c);
    }
}

const counter = setCounter();
console.log(typeof counter);
console.log("Ex1 closure counter:", counter());
console.log("Ex2 closure counter:", counter());
console.log("Ex3 closure counter:", counter());

// Closure example: "private" variable c is in the block scope
let counter2;
{
    let c = 0; // "private" variable of the closure
    counter2 = function (){
        c += 2;
        return(c);
    }
}

console.log("Ex4 closure counter2:", counter2());
console.log("Ex5 closure counter2:", counter2());
console.log("Ex6 closure counter2:", counter2());

// Closure example: "private" variable x is in the function scope
function makeAdder(x) {
    return function (y) {
        return(x + y);
    }
}

const adder7 = makeAdder(7);
console.log("Ex7 closure adder7:", adder7(1));
console.log("Ex8 closure adder7:", adder7(10));
console.log("Ex9 closure adder3:", makeAdder(3)(10));