import React, { useState } from 'react';
import {parse} from 'csv-parse';
import axios from 'axios';

function UploadCSV() {
  const [file, setFile] = useState(null);

  const handleFileUpload = async (event) => {
    const csvFile = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.readAsText(csvFile, 'UTF-8');
    fileReader.onload = () => {
      const csvData = fileReader.result;
      parse(csvData, { columns: true }, async (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const jsonData = JSON.stringify(data);
          try {
            const response = await axios.post('/upload', { data: jsonData });
            console.log(response.data);
          } catch (error) {
            console.error(error);
          }
        }
      });
    };
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
}

export default UploadCSV;
