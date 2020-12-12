import parse from "csv-parse/lib/sync";
import { differenceInBusinessDays } from "date-fns";

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
const parseRecords = async (fileContent, value) => {
  let res = [];
  try {
    const records = await parse(fileContent, { columns: true, trim: true });

    res = calculateTransactionNumber(records, value);
  } catch (e) {
    console.log("Invalid CSV: ", e);
    return new Error("Invalid CSV:", e);
  }
  return res;
};

export function calculateTransactionNumber(csvData: DataType, value: number) {
  let counter = value ? value : 1;
  let openTransactions = {};

  csvData.forEach((row, index) => {
    Object.assign(row, {
      transaction: Object.assign({}, row.transaction, {
        transactionNumber: 1,
        isOpen: true,
      }),
    });

    Object.assign(row, { DESCRIPTION: checkElement(row.DESCRIPTION) });

    let currentSymbol = row.SYMBOL;
    let sumBougth = 0;
    // sumSold = 0;

    // no open transactions
    if (!openTransactions.hasOwnProperty(currentSymbol)) {
      openTransactions[currentSymbol] = {
        BOUGHT: 0,
        SOLD: 0,
        innerCounter: counter,
        firstDay: row.DATE,
        days: 0,
      };
      // BUYING...
      if (row.DESCRIPTION.includes("BOUGHT")) {
        let sumBougth =
          openTransactions[currentSymbol]["BOUGHT"] + parseInt(row.QUANTITY);
        Object.assign(openTransactions, {
          [currentSymbol]: Object.assign({}, openTransactions[currentSymbol], {
            BOUGHT: sumBougth,
          }),
        });

        Object.assign(row, {
          transaction: Object.assign({}, row.transaction, {
            transactionNumber: openTransactions[currentSymbol].innerCounter,
            // date: true,
          }),
        });
      }

      // SELLING...
      if (row.DESCRIPTION.includes("SOLD")) {
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
      if (row.DESCRIPTION.includes("SOLD")) {
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
      if (row.DESCRIPTION.includes("BOUGHT")) {
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
        const start = openTransactions[currentSymbol]["firstDay"];
        const last = row.DATE;

        Object.assign(row, {
          transaction: Object.assign({}, row.transaction, {
            transactionNumber: currentCounter,
            isOpen: false,
            days: differenceInBusinessDays(new Date(last), new Date(start)) + 1,
          }),
        });
        delete openTransactions[currentSymbol];
      }
    }
  });

  return csvData;
}

export default async (file, value) => {
  const fileContent = await readFileAsText(file);

  return parseRecords(fileContent, value);
};
