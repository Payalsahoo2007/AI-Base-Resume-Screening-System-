/**
 * Export service for CSV, JSON, and PDF report data generation
 */

const exportToCsv = (dataArray) => {
  if (!dataArray || dataArray.length === 0) return '';
  const headers = Object.keys(dataArray[0]);
  const rows = dataArray.map(obj => {
    return headers.map(header => {
      let val = obj[header];
      if (typeof val === 'object') val = JSON.stringify(val);
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};

const exportToJson = (data) => {
  return JSON.stringify(data, null, 2);
};

const generateHtmlReport = (title, data) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>${title}</title>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; background: #0b0f19; color: #e2e8f0; }
      h1 { color: #00f3ff; border-bottom: 2px solid #8a2be2; padding-bottom: 10px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #131b2e; }
      th, td { padding: 12px 15px; text-align: left; border: 1px solid #1e293b; }
      th { background-color: #1e293b; color: #00f3ff; }
      tr:nth-child(even) { background-color: #182238; }
      .badge { padding: 4px 8px; border-radius: 4px; font-weight: bold; background: #00f3ff22; color: #00f3ff; }
    </style>
  </head>
  <body>
    <h1>${title}</h1>
    <p>Generated on: ${new Date().toLocaleString()}</p>
    <pre>${JSON.stringify(data, null, 2)}</pre>
  </body>
  </html>
  `;
};

module.exports = { exportToCsv, exportToJson, generateHtmlReport };
