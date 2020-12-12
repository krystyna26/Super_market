import React, { useState } from "react";
import calculate from "./calculate";
import Dropzone from "react-dropzone";
import styled from "styled-components";
// import CSVReader from "react-csv-reader";

const StyledSection = styled.section`
  width: 100px;
  margin: auto;
`;

const StyledP = styled.p`
  border: 1px solid black;
  border-radius: 7px;
  padding: 10px;
  width: 100px;
`;

const StyledButton = styled.button`
  margin-bottom: 30px;
  padding: 7px;
`;

const StyledDiv = styled.div`
  margin-bottom: 30px;
`;

const StyledThead = styled.thead`
  margin: 10px;
`;

export default function Horea() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);

  const checkElement = (el) => {
    return typeof el === "string"
      ? el.startsWith("Sold")
        ? "SOLD"
        : el.startsWith("Bought")
        ? "BOUGHT"
        : el
      : el;
  };

  // parse it first from csv to JSON
  // inside JSON go one by one

  const handleCSVSubmit = async (e) => {
    const value = document.getElementById("startNumber").value;

    e.preventDefault();
    if (file) {
      try {
        const d = await calculate(file, value);
        // console.log("HERE d: ", d);
        setData(d);
      } catch (e) {
        console.log("Error in handleCSVSubmit: ", e);
      }
    }
  };

  const onChange = () => {
    setFile(document.querySelector("input").files[0]);
  };

  const onDrop = (acceptedFiles: any[]) => {
    setFile(acceptedFiles);
    console.log("onDrop", acceptedFiles);

    if (onChange) {
      const [file] = acceptedFiles;
      if (file) onChange(file);
    }
  };

  return (
    <div>
      <h1>Calculate transaction number and business days it was active</h1>
      <div className="myform">
        <form id="userform" action="" onSubmit={handleCSVSubmit}>
          <Dropzone accept={["csv"]} onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => (
              <StyledSection>
                <div {...getRootProps()}>
                  <input {...getInputProps()} onChange={onChange} />
                  <StyledP>
                    Drag 'n' drop some files here, or click to select files
                  </StyledP>
                </div>
              </StyledSection>
            )}
          </Dropzone>
          <StyledDiv>
            <p>Start counting transaction from:</p>
            <input type="number" id="startNumber" />
          </StyledDiv>
          <StyledButton className="adduserbutton">
            Calculate transaction number
          </StyledButton>
        </form>
      </div>

      <div className="">
        <table>
          <StyledThead>
            <tr>
              <th>Date</th>
              <th>ID</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Symbol</th>
              <th>Price</th>
              <th>Commission</th>
              <th>Amount</th>
              <th>Transaction</th>
              <th>Days</th>
            </tr>
          </StyledThead>
          <tbody>
            {data.map((transaction, i) => (
              <TableRow row={transaction} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TableRow = ({ row }) => {
  console.log("HERE row IN TableRow: ", row);
  const {
    AMOUNT,
    COMMISSION,
    DATE,
    DESCRIPTION,
    PRICE,
    QUANTITY,
    SYMBOL,
    TRANSACTION_ID,
    transaction,
  } = row;

  const { transactionNumber, days } = transaction;

  return (
    <tr>
      <td>{DATE}</td>
      <td>{TRANSACTION_ID}</td>
      <td>{DESCRIPTION}</td>
      <td>{QUANTITY}</td>
      <td>{SYMBOL}</td>
      <td>{PRICE}</td>
      <td>{COMMISSION}</td>
      <td>{AMOUNT}</td>
      <td>{transactionNumber}</td>
      <td>{days}</td>
    </tr>
  );
};
