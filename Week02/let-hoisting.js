// TDZ starts at beginning of scope
const func = () => console.log(letVar); // OK

// Within the TDZ letVar access throws `ReferenceError`
// console.log(letVar); // ReferenceError
// func(); // ReferenceError

let letVar = 3; // End of TDZ (for letVar)
func(); // Ok, letVar is called outside TDZ.