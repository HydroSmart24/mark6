import axios from 'axios';

const API_KEY = 'AIzaSyCUD61HFdql2gT54TwTL9BPrnCmRQAR6uw'; // API key
const spreadsheetId = '1pqMpBAfQf_QYYg0Ag_fKX5cvMt1-4YVlcx-rk5XeP7c'; // sheet ID
const sheetName = 'Sheet1'; //sheet name

export const getSheetData = async () => {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${API_KEY}`;
      console.log('Requesting data from:', url); // Log the request URL
      const response = await axios.get(url);
  
      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        console.log('No data found in the Google Sheet.');
        return [];
      }
  
      const headers = rows[0];
      const data = rows.slice(1).map((row) => {
        const record = {};
        headers.forEach((header, index) => {
          record[header] = row[index] ? parseFloat(row[index]) : 0;
        });
        return record;
      });
  
      return data;
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error.response?.data || error.message);
      throw error;
    }
  };
  
