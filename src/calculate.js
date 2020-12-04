import parse from "csv-parse/lib/sync";

type DataType = [
  {
    date: Date,
    quantity: number,
    symbol: string,
    price: number,
    amount: number,
    transaction: number,
    description: string,
  }
];

export const fakeData = [
  {
    date: "01/02/2020",
    quantity: 1000,
    symbol: "FIRST",
    price: 16.285,
    amount: 16.285,
    description: "Bought 1000 RAD @ 16.38",
    transaction: 0,
  },
  {
    date: "01/02/2020",
    quantity: 2000,
    symbol: "SECOND",
    price: 12.125,
    amount: 12.125,
    description: "Sold 1000 RAD @ 16.23",
    transaction: 0,
  },
];

const checkElement = (el) => {
  return typeof el === "string"
    ? el.startsWith("Sold")
      ? "SOLD"
      : el.startsWith("Bought")
      ? "BOUGHT"
      : el
    : el;
};

// 1
export function readFileAsText(inputFile: File) {
  let reader = new FileReader();

  // let file = inputFile.files;
  // console.log("HERE file: ", file);

  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject(new DOMException("Problem parsing input file"));
    };
    reader.onload = () => {
      resolve(reader.result);
    };

    reader.readAsText(inputFile);
  });
}

// 2
const parseRecords = async (fileContent) => {
  let res = [];
  try {
    const records = await parse(fileContent, { columns: true, trim: true });

    res = calculateTransactionNumber(records);
    // const headers = Object.keys(records[0]);
  } catch (e) {
    console.log("HERE e: ", e);
    return new Error("Invalid CSV:", e);
  }
  return res;
};

export function calculateTransactionNumber(csvData: DataType) {
  csvData.forEach((el, i) => ({
    ...el,
    transaction: "test",
    description: checkElement(el.description),
  }));

  let counter = 1;
  let openTransactions = {};

  csvData.forEach((row, index) => {
    let currentSymbol = row.SYMBOL;
    console.log(
      "HERE current row: ",
      index,
      "current symbol: ",
      currentSymbol,
      "existing open transaction",
      openTransactions
    );
    let sumBougth, sumSold;

    // no open transactions
    console.log(
      "HERE no open transactions : ",
      !openTransactions.hasOwnProperty(currentSymbol)
    );
    if (!openTransactions.hasOwnProperty(currentSymbol)) {
      // Object.keys(openTransactions).length === 0 ||
      openTransactions[currentSymbol] = { BOUGHT: 0, SOLD: 0 };
      console.log(
        "HERE checking open transactions before: ",
        openTransactions,
        Object.keys(openTransactions)
      );
      // BUYING...
      if (row.description.includes("Bought")) {
        let sumBougth =
          openTransactions[currentSymbol]["BOUGHT"] + parseInt(row.QUANTITY);
        Object.assign(openTransactions, {
          [currentSymbol]: Object.assign({}, openTransactions[currentSymbol], {
            BOUGHT: sumBougth,
          }),
        });
        console.log("HERE buying new : ", row.QUANTITY);
      }

      // SELLING...
      // console.log("HERE row: ", row);
      if (row.description.includes("Sold")) {
        let sumSold =
          openTransactions[currentSymbol]["SOLD"] + parseInt(row.QUANTITY);
        Object.assign(openTransactions, {
          [currentSymbol]: Object.assign({}, openTransactions[currentSymbol], {
            SOLD: sumSold,
            BOUGHT: sumBougth,
          }),
        });
        console.log("HERE seling new: ", row.QUANTITY);
      }

      // SHOULD CLOSE TRANSACTION ?
      // if (
      //   openTransactions[currentSymbol]["BOUGHT"] ===
      //   openTransactions[currentSymbol]["SOLD"]
      // ) {
      //   counter++;
      //   console.log("HERE closing now... ");
      //   delete openTransactions[currentSymbol];
      // }
      if (
        openTransactions[currentSymbol]["BOUGHT"] >
        openTransactions[currentSymbol]["SOLD"]
      ) {
        Object.assign(row, { transaction: counter });
      }
      console.log("HERE openTransactions ~: ", openTransactions);
    } else {
      console.log("HERE else: ", openTransactions);
      // console.log("HERE another transaction: ", openTransactions);
      // console.log("HERE d: ", row.description);
      // SELLING...
      if (row.description.includes("Sold")) {
        console.log(
          "HERE SELLING...: ",
          currentSymbol,
          openTransactions[currentSymbol]["SOLD"]
          // openTransactions[currentSymbol]["SOLD"]
        );
        let sum =
          openTransactions[currentSymbol]["SOLD"] + parseInt(row.QUANTITY);
        Object.assign(openTransactions, {
          [currentSymbol]: Object.assign({}, openTransactions[currentSymbol], {
            SOLD: sum,
          }),
        });
        console.log("HERE seling quantity: ", sum);
      }

      // SHOULD CLOSE TRANSACTION ?
      if (
        openTransactions[currentSymbol]["BOUGHT"] ===
        openTransactions[currentSymbol]["SOLD"]
      ) {
        row.transaction = counter;
        console.log("HERE CLOSING WITH counter: ", counter);
        counter++;
        console.log("HERE closing now... new counter", counter);
        delete openTransactions[currentSymbol];
      }
      // if (
      //   openTransactions[currentSymbol]["BOUGHT"] >
      //   openTransactions[currentSymbol]["SOLD"]
      // ) {
      //   Object.assign(row, { transaction: counter });
      // }

      console.log(
        "HERE openTransactions ~ ~: ",
        openTransactions[currentSymbol]
      );
    }
  });

  return csvData;
}

export default async (file) => {
  // console.log("HERE calculate: ", file);
  const fileContent = await readFileAsText(file);
  // console.log("HERE parse: ", await parseRecords(fileContent));
  return parseRecords(fileContent);
};
