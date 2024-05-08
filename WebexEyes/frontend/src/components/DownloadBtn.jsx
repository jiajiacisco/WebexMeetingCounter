import { DownloadIcon } from "./Icons/Icons";
import * as XLSX from "xlsx/xlsx.mjs";

const DownloadBtn = ({ data = [], fileName }) => {
  return (
    <button 
      className="download-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-0.1 px-1 rounded"
      
      onClick={() => {
        const datas = data?.length ? data : [];
        const worksheet = XLSX.utils.json_to_sheet(datas);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, fileName ? `${fileName}.xlsx` : "data.xlsx");
      }}
    >
      <DownloadIcon />
      Download
    </button>
  );
};

export default DownloadBtn;