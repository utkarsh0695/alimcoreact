import React, { useEffect } from "react";
import { useState } from "react";
import exportFromJSON from "export-from-json";
import CopyToClipboard from "react-copy-to-clipboard";
import { Modal, ModalBody, Button, Tooltip } from "reactstrap";
import * as XLSX from "xlsx";
import { RiFileExcel2Fill } from "react-icons/ri";

export const Export = ({ sheetName, data }) => {
  const [modal, setModal] = useState(false);
  const [toolExcel, setToolExcel] = useState(false);
  const [toolCsv, setToolCsv] = useState(false);
  const [toolClip, setToolClip] = useState(false);
  const toggleExcel = () => {
    setToolExcel(!toolExcel);
  };
  const toggleCsv = () => {
    setToolCsv(!toolCsv);
  };
  const toggleClip = () => {
    setToolClip(!toolClip);
  };

  const newData = data?.map((obj) =>
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key
          .replace(/_/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        value,
      ])
    )
  );

  // useEffect(() => {
  //   if (modal === true) {
  //     setTimeout(() => setModal(false), 2000);
  //   }
  // }, [modal]);

  const fileName = sheetName;
  const truncatedSheetName = sheetName?.substring(0, 31);

  const exportCSV = () => {
    const exportType = exportFromJSON.types.csv;
    // if (Array.isArray(newData) && newData.every(item => typeof item === 'object')) {
    //   const exportType = exportFromJSON.types.csv;
    //   exportFromJSON({ data: newData, fileName, exportType });
    // } else {
    //   console.error("Invalid export data. Please provide an array of objects.");
    // }
    exportFromJSON({ data: newData, fileName, exportType });
  };

  // const exportExcel = () => {
  //   const exportType = exportFromJSON.types.xls;
  //   exportFromJSON({ data, fileName, exportType });
  // };

  const copyToClipboard = () => {
    setModal(true);
  };
  const exportExcel = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert your data to a worksheet
    const ws = XLSX.utils.json_to_sheet(newData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, truncatedSheetName);

    // Generate a binary string from the workbook
    const wbout = XLSX.write(wb, { bookType: "xls", type: "binary" });

    // Convert the binary string to a Blob
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    // Create a download link and trigger the download
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${fileName}.xls`;
    link.click();
  };

  // Function to convert a string to an ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };
  return (
    <React.Fragment>
      <div className="dt-export-buttons d-flex align-center">
        {/* <div className="dt-export-title d-none d-md-inline-block">Export</div> */}
        <div className="dt-buttons btn-group flex-wrap">
          {/* <CopyToClipboard text={JSON.stringify(data)}>
           
              <Button
                style={{ color: "#31ff01" }}
                className="buttons-copy buttons-html5"
                onClick={() => copyToClipboard()}
                id="clip"
              >
                <span>Copy</span>
                <Tooltip placement="bottom" isOpen={toolClip} target="clip" toggle={toggleClip}>
                copy to clipboard
              </Tooltip>
              </Button>
           
          
          </CopyToClipboard> */}
          {/* <button
            style={{ color: "#fba700" }}
            className="btn btn-secondary buttons-csv buttons-html5"
            type="button"
            onClick={() => exportCSV(newData)}
            id="csv"
          >
            <span>CSV</span>
          </button>
          <Tooltip placement="bottom" isOpen={toolCsv} target="csv" toggle={toggleCsv}>
            export to CSV
          </Tooltip> */}
          <Button
            outline
            id="excel"
            color="success"
            className=""
            type="button"
            onClick={() => exportExcel()}
            size="sm"
          >
           <RiFileExcel2Fill style={{height:'1rem', width:'1rem'}} />

          </Button>{" "}
          <Tooltip
            placement="bottom"
            isOpen={toolExcel}
            target="excel"
            toggle={toggleExcel}
          >
            export to excel
          </Tooltip>
        </div>
      </div>
      <Modal
        isOpen={modal}
        className="modal-dialog-centered text-center"
        size="sm"
      >
        <ModalBody className="text-center m-2">
          <h5>Copied to clipboard</h5>
        </ModalBody>
        <div className="p-3 bg-light">
          <div className="text-center">
            Copied {data?.length} rows to clipboard
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};
