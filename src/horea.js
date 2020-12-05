import React, { useState } from "react";
import calculate from "./calculate";
import Dropzone from "react-dropzone";
import styled from "styled-components";
// import CSVReader from "react-csv-reader";

const StyledSection = styled.section`
  width: 100px;
  margin: auto;
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
    e.preventDefault();
    if (file) {
      try {
        const d = await calculate(file);
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
      <h1>Add transaction</h1>
      <div className="myform">
        <form id="userform" action="" onSubmit={handleCSVSubmit}>
          <Dropzone accept={["csv"]} onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => (
              <StyledSection>
                <div {...getRootProps()}>
                  <input {...getInputProps()} onChange={onChange} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              </StyledSection>
            )}
          </Dropzone>
          <button className="adduserbutton">
            Calculate transaction number
          </button>
        </form>
      </div>

      <div className="">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>ID</th>
              <th>Description</th>
              <th>QUuantity</th>
              <th>Symbol</th>
              <th>Price</th>
              <th>Commission</th>
              <th>Amount</th>
              <th>Transaction</th>
            </tr>
          </thead>
          <tbody>
            {data.map((transaction, i) => {
              return (
                <tr key={i}>
                  {Object.values(transaction).map((el, i) => {
                    return i === 8 ? (
                      <td
                        key={`${el} ${Math.floor(
                          Math.random() * Math.floor(10)
                        )}`}
                      >{`${el.transactionNumber} ${
                        el.isOpen ? "open" : "close"
                      } `}</td>
                    ) : (
                      <td
                        key={`${el} ${Math.floor(
                          Math.random() * Math.floor(10)
                        )}`}
                      >
                        {checkElement(el)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
