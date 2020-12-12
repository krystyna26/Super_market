import React, { useState } from "react";
import calculate from "./calculate";
import Dropzone from "react-dropzone";
import styled from "styled-components";
// import CSVReader from "react-csv-reader";

const Cell = styled.td`
  padding: 5px;
`;

const Header = styled.th`
  padding: 5px;
`;

const StyledSection = styled.section`
  width: 100px;
  margin: auto;
`;

const StyledP = styled.p`
  border: 0.8px dashed black;
  border-radius: 7px;
  padding: 10px;
  width: 100px;
`;

const StyledButton = styled.button`
  border-radius: 10px;
  margin-bottom: 30px;
  padding: 7px;
`;

const StyledDiv = styled.div`
  margin-bottom: 30px;
`;

const Head = styled.thead`
  margin: 10px;
  background-color: antiquewhite;
`;

const Body = styled.tbody`
  tr:nth-child(even) {
    background-color: oldlace;
  }
`;

const Input = styled.input`
  border-radius: 9px;
  border: 2px solid;
  padding: 5px;
  max-width: 60px;
`;

export default function Horea() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);

  const handleCSVSubmit = async (e) => {
    const value = document.getElementById("startNumber").value;

    e.preventDefault();
    if (file) {
      try {
        const d = await calculate(file, value);
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
            <Input type="number" id="startNumber" />
          </StyledDiv>
          <StyledButton className="adduserbutton">
            Calculate transaction number
          </StyledButton>
        </form>
      </div>

      <div className="">
        <table style={{ minWidth: "90%" }}>
          <Head>
            <tr>
              {[
                "Date",
                "ID",
                "Description",
                "Quantity",
                "Symbol",
                "Price",
                "Commission",
                "Amount",
                "Transaction",
                "Days",
              ].map((cell) => (
                <Header>{cell}</Header>
              ))}
            </tr>
          </Head>
          <Body>
            {data.map((transaction, i) => (
              <TableRow row={transaction} />
            ))}
          </Body>
        </table>
      </div>
    </div>
  );
}

const TableRow = ({ row }) => {
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
      <Cell>{DATE}</Cell>
      <Cell>{TRANSACTION_ID}</Cell>
      <Cell>{DESCRIPTION}</Cell>
      <Cell>{QUANTITY}</Cell>
      <Cell>{SYMBOL}</Cell>
      <Cell>{PRICE}</Cell>
      <Cell>{COMMISSION}</Cell>
      <Cell>{AMOUNT}</Cell>
      <Cell>{transactionNumber}</Cell>
      <Cell>{days}</Cell>
    </tr>
  );
};
