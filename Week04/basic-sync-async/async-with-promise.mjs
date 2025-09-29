import { longOperation, processResult, processResultError, longOperationAsyncWithPromise, VAL } from "./longOperation.mjs";
console.log("BEGIN");

console.log("Asynchronous function with promise");

// Async model with Promise
// longOperationAsyncWithPromise(VAL)   // Promise<Number>
//     .then(processResult);            // Promise<String>

// The same as above, but each call is separated.
// let p = longOperationAsyncWithPromise(VAL);
// p.then(processResult);

// With catch (with error)
// longOperationAsyncWithPromise("abc")
//    .then(processResult)
//    .catch(processResultError);

// With catch
longOperationAsyncWithPromise(VAL)
   .then(processResult)
   .catch(processResultError);

// The same as above, but each call is separated.
//let p1 = longOperationAsyncWithPromise(VAL);
//let p2 = p1.then(processResult);
//p2.catch(processResultError);

// Adding "concurrence":
//let res = longOperation(VAL);
//processResult(VAL);

console.log("END");