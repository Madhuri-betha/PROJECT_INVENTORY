import React from 'react';
import * as FileSaver from 'file-saver';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import 'semantic-ui-css/semantic.min.css'

const styles = StyleSheet.create({
  table: {
    display: 'table',
    width: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
    padding: 20,
    TextAlign: 'center',
  },
  Text: {
    padding: 10,
    flex: 1,
    TextAlign: 'center',
  },
});

const jsonToCSV = (json) => {
  const headers = Object.keys(json[0]).join(',');
  const rows = json.map((row) => Object.values(row).join(','));
  return [headers, ...rows].join('\n');
};

const downloadCSV = (csvData, filename) => {
  const blob = new Blob([csvData], { type: 'Text/csv;charset=utf-8' });
  FileSaver.saveAs(blob, filename);
};

let temp;
const Download = (props) => {
  temp = (props.data1)

  const handleDownload = (data) => {
    data.filter(obj=>{
      delete obj["_id"]
      return obj;
    })
    const jsonData = data;
    const csvData = jsonToCSV(jsonData);
    downloadCSV(csvData, 'data.csv');
  };
  const downloadPDF = (pdfData, filename) => {
    FileSaver.saveAs(pdfData, filename);
  };


  const MyDocument = ({ data }) => (
    <Document>
      <Page>
        <View style={styles.table}>
          {/* Render table headers */}

          <View style={styles.tableRow}>

            <Text style={styles.tableHeader}>ID</Text>
            <Text style={styles.tableHeader}>Category</Text>
            <Text style={styles.tableHeader}>userid</Text>
            <Text style={styles.tableHeader} >serial</Text>
            <Text style={styles.tableHeader}>model</Text>
            <Text style={styles.tableHeader}>date</Text>
          </View>

          {/* Render table data */}
          {data.map((row) => (
            <View key={row.id} style={styles.tableRow} >
              <Text style={styles.Text}>{row.id}</Text>
              <Text style={styles.Text}>{row.category}</Text>
              <Text style={styles.Text}>{row.userid}</Text>
              <Text style={styles.Text}>{row.serial}</Text>
              <Text style={styles.Text}>{row.model}</Text>
              <Text style={styles.Text}>{row.date}</Text>
            </View>
          ))}

        </View>
      </Page>
    </Document>
  );

  return (
    <div>
      <button onClick={() => handleDownload(temp)} className="ui button" style={{ margin: "10px", float: "right", marginLeft: "1%" }} ><i className="download icon"></i>csv</button>

      <PDFDownloadLink document={<MyDocument data={temp} />} fileName="table.pdf" className="ui button" style={{ margin: "10px", float: "right", marginLeft: "2%" }}>
      {({ blob, url, loading, error }) => (
    <>
      <i className="download icon"></i>
      {loading ? '..' : "pdf"}
    </>
  )}

      </PDFDownloadLink>
    </div>
  );
};

export default Download;