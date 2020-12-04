// export function calculateTransactionNumber(existingData: DataType) {
//   const records = [];
//
//   // conver 'description' to easier one
//   existingData.forEach((el) => ({
//     ...el,
//     transaction: "test",
//     description: checkElement(el.description),
//   }));
//
//   let quantityObj = { BOUGHT: 0, SOLD: 0 };
//   let symbolArr = [];
//   let testArr = [];
//   let obj = {};
//   let x = [];
//   let counter = 1;
//
//   existingData.forEach((row, i) => {
//     console.log("HERE row number ~~~~~~~~~~~~~~~~~~~~~~~~~~: ", i);
//     let currentSymbol = row.SYMBOL; // RAD
//     let currentTransaction = testArr.find((el) => el[currentSymbol]);
//     // start new transaction
//     // if (symbolArr.length === 0) {
//     if (!currentTransaction) {
//       symbolArr.push(currentSymbol); // [ 'RAD' ]
//       // console.log("HERE symbolArr: ", symbolArr);
//       console.log(
//         "HERE currentSymbol, quantityObj: ",
//         currentSymbol,
//         quantityObj
//       );
//       x.push([currentSymbol, 0, 0]);
//       // console.log("HERE x: ", x);
//       testArr.push({ [currentSymbol]: quantityObj }); // [  {'RAD': {BOUGHT: 0, SOLD: 0}} ]
//       // console.log("HERE currentTransaction: ", currentTransaction);
//       console.log("HERE testArr: ", testArr, testArr[0], testArr[1]);
//
//       if (row.description.includes("Bought")) {
//         let sameCompany = testArr.find((el) => el[currentSymbol]);
//         sameCompany[currentSymbol]["BOUGHT"] =
//           sameCompany[currentSymbol]["BOUGHT"] + parseInt(row.QUANTITY);
//         console.log("HERE sumB: ", sameCompany);
//         // Object.assign(quantityObj, {
//         //   BOUGHT: sum,
//         // });
//
//         // let testSum = parseInt(testArr[])
//       }
//       // if (row.description.includes("Sold")) {
//       //   let sum = parseInt(quantityObj.SOLD) + parseInt(row.QUANTITY);
//       //   Object.assign(quantityObj, { SOLD: sum });
//       // }
//       //
//       // console.log(
//       //   "HERE should close transaction 1 ?: ",
//       //   quantityObj.BOUGHT === quantityObj.SOLD,
//       //   quantityObj.BOUGHT,
//       //   quantityObj.SOLD
//       // );
//       // // close transaction
//       // if (quantityObj.BOUGHT > quantityObj.SOLD) {
//       //   Object.assign(row, { transaction: counter });
//       //   // console.log("HERE break => go to another row: ", row.transaction);
//       // }
//       // if (quantityObj.BOUGHT === quantityObj.SOLD) {
//       //   counter++;
//       //   // clean symbolArr and quantityObj
//       //   // console.log("HERE ~~~~~~~~~ close and clean 1: ~~~~~~~~~~~");
//       //   const removeKey = row.SYMBOL;
//       //   delete testArr[removeKey];
//       //   // console.log("HERE testArr 1: ", removeKey, testArr);
//       //   symbolArr.shift();
//       //
//       //   // console.log("HERE shift from symbolArr: ", symbolArr);
//       //   Object.assign(quantityObj, { BOUGHT: 0, SOLD: 0 });
//       // }
//       // console.log("HERE quantityObj: ", quantityObj);
//       // new transaction => previous was closed
//     }
//
//     // another transaction
//     // else {
//     //   // console.log("HERE check symbol ****: ", symbolArr[0], row.SYMBOL); // [AAPL] RAD
//     //   var key = row.SYMBOL;
//     //   var keepSymbol = testArr.find((el) => el[key]);
//     //
//     //   if (symbolArr[0] === row.SYMBOL) {
//     //     // if(keepSymbol){
//     //
//     //     if (row.description.includes("Bought")) {
//     //       let sum = parseInt(quantityObj.BOUGHT) + parseInt(row.QUANTITY);
//     //       Object.assign(quantityObj, {
//     //         BOUGHT: sum,
//     //       });
//     //     }
//     //     if (row.description.includes("Sold")) {
//     //       let sum = parseInt(quantityObj.SOLD) + parseInt(row.QUANTITY);
//     //       Object.assign(quantityObj, { SOLD: sum });
//     //     }
//     //     // console.log(
//     //     //   "HERE should close transaction 2: ",
//     //     //   quantityObj.BOUGHT,
//     //     //   quantityObj.SOLD
//     //     // );
//     //     // close transaction
//     //     if (quantityObj.BOUGHT > quantityObj.SOLD) {
//     //       Object.assign(row, { transaction: counter });
//     //     }
//     //     if (quantityObj.BOUGHT === quantityObj.SOLD) {
//     //       Object.assign(row, { transaction: counter });
//     //       counter++;
//     //       // console.log("HERE increment counter : ", counter);
//     //       // clean symbolArr and quantityObj
//     //       // console.log("HERE ~~~~~~~~~ close and clean 2: ~~~~~~~~~~~");
//     //       const removeKey = row.SYMBOL;
//     //       delete testArr[removeKey];
//     //       symbolArr.shift();
//     //       // console.log("HERE shift from symbolArr: ", symbolArr);
//     //       Object.assign(quantityObj, { BOUGHT: 0, SOLD: 0 });
//     //     }
//     //   }
//     //   // symbols are different => [AAPL] RAD
//     //   else {
//     //     // console.log(
//     //     //   "HERE symbols are different *: ",
//     //     //   quantityObj,
//     //     //   symbolArr,
//     //     //   counter
//     //     // );
//     //     symbolArr.push(row.SYMBOL); // ['AAPL', 'RAD']
//     //     testArr.push({ [key]: quantityObj }); // [  {'RAD': {BOUGHT: 0, SOLD: 0}},  {'AAPL': {BOUGHT: 0, SOLD: 0}} ]
//     //     // console.log("HERE testArr 2: ", testArr, testArr.length);
//     //
//     //     if (row.description.includes("Bought")) {
//     //       let sum = parseInt(quantityObj.BOUGHT) + parseInt(row.QUANTITY);
//     //       Object.assign(quantityObj, {
//     //         BOUGHT: sum,
//     //       });
//     //
//     //       // let testSum = parseInt(testArr[])
//     //     }
//     //     if (row.description.includes("Sold")) {
//     //       let sum = parseInt(quantityObj.SOLD) + parseInt(row.QUANTITY);
//     //       Object.assign(quantityObj, { SOLD: sum });
//     //     }
//     //     //   }
//     //   }
//     // }
//     // console.log("HERE symbolArr: ", symbolArr);
//
//     // records.push({
//     //   ...row,
//     //   transaction: "test",
//     //   description: checkElement(row.description),
//     // });
//
//     // {
//     // AMUNT: "-16380",
//     // COMMISSION: "0",
//     // DATE: "01/02/2020",
//     // PRICE: "16.38",
//     // QUANTITY: "1000",
//     // SYMBOL: "RAD",
//     // TRANSACTION_ID: "24371127086",
//     // description: "Bought 1000 RAD @ 16.38",
//     // transaction: 1,
//     // }
//
//     //
//     //   const newSymbol = row.symbol;
//     //   const checkFromCompany = existingData.filter((tr) => tr.symbol === newSymbol);
//     //   const isSold = row.description.startsWith('Sold');
//   });
//   // console.log("HERE firstRow: ", firstRow);
//   console.log("HERE records: ", records);
//   return existingData;
// }
