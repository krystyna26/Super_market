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
  } catch (e) {
    console.log("HERE e: ", e);
    return new Error("Invalid CSV:", e);
  }
  return res;
};

export function calculateTransactionNumber(csvData: DataType) {
  let counter = 1;
  let openTransactions = {};

  csvData.forEach((row, index) => {
    Object.assign(row, {
      transaction: Object.assign({}, row.transaction, {
        transactionNumber: 1,
        isOpen: true,
      }),
    });

    Object.assign(row, { description: checkElement(row.description) });

    let currentSymbol = row.SYMBOL;
    let sumBougth = 0;
    // sumSold = 0;

    // no open transactions
    if (!openTransactions.hasOwnProperty(currentSymbol)) {
      openTransactions[currentSymbol] = {
        BOUGHT: 0,
        SOLD: 0,
        innerCounter: counter,
      };

      // BUYING...
      if (row.description.includes("BOUGHT")) {
        let sumBougth =
          openTransactions[currentSymbol]["BOUGHT"] + parseInt(row.QUANTITY);
        Object.assign(openTransactions, {
          [currentSymbol]: Object.assign({}, openTransactions[currentSymbol], {
            BOUGHT: sumBougth,
          }),
        });
      }

      // SELLING...
      if (row.description.includes("SOLD")) {
        let sumSold =
          openTransactions[currentSymbol]["SOLD"] + parseInt(row.QUANTITY);
        Object.assign(openTransactions, {
          [currentSymbol]: Object.assign({}, openTransactions[currentSymbol], {
            SOLD: sumSold,
            BOUGHT: sumBougth,
          }),
        });
        // new
        Object.assign(row, {
          transaction: Object.assign({}, row.transaction, {
            transactionNumber: openTransactions[currentSymbol].innerCounter,
            isOpen: true,
          }),
        });
        counter++;
      }

      // SHOULD CLOSE TRANSACTION ?
      if (
        openTransactions[currentSymbol]["BOUGHT"] >
        openTransactions[currentSymbol]["SOLD"]
      ) {
        Object.assign(row, {
          transaction: Object.assign({}, row.transaction, {
            transactionNumber: openTransactions[currentSymbol].innerCounter,
            isOpen: true,
          }),
        });
        counter++;
      }
    } else {
      // SELLING...
      if (row.description.includes("SOLD")) {
        let sum =
          openTransactions[currentSymbol]["SOLD"] + parseInt(row.QUANTITY);
        Object.assign(openTransactions, {
          [currentSymbol]: Object.assign({}, openTransactions[currentSymbol], {
            SOLD: sum,
            //BOUGHT: sumBougth
          }),
        });
        Object.assign(row, {
          transaction: Object.assign({}, row.transaction, {
            transactionNumber: openTransactions[currentSymbol].innerCounter,
            isOpen: true,
          }),
        });
      }

      // BUYING...
      if (row.description.includes("BOUGHT")) {
        let sumBougth =
          openTransactions[currentSymbol]["BOUGHT"] + parseInt(row.QUANTITY);
        Object.assign(openTransactions, {
          [currentSymbol]: Object.assign({}, openTransactions[currentSymbol], {
            BOUGHT: sumBougth,
            //SOLD: sumSold
          }),
        });
        Object.assign(row, {
          transaction: Object.assign({}, row.transaction, {
            transactionNumber: openTransactions[currentSymbol].innerCounter,
            isOpen: true,
          }),
        });
      }

      // SHOULD CLOSE TRANSACTION ?
      if (
        openTransactions[currentSymbol]["BOUGHT"] ===
        openTransactions[currentSymbol]["SOLD"]
      ) {
        const currentCounter = row.transaction.transactionNumber;
        Object.assign(row, {
          transaction: Object.assign({}, row.transaction, {
            transactionNumber: currentCounter,
            isOpen: false,
          }),
        });
        delete openTransactions[currentSymbol];
      }
      if (
        openTransactions.hasOwnProperty(currentSymbol) &&
        openTransactions[currentSymbol]["BOUGHT"] >
          openTransactions[currentSymbol]["SOLD"]
      ) {
      }
    }
  });

  return csvData;
}

export default async (file) => {
  const fileContent = await readFileAsText(file);

  return parseRecords(fileContent);
};
