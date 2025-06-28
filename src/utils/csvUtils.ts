import Papa from 'papaparse';

export interface CSVParseResult {
  data: any[];
  errors: string[];
}

export const parseCSV = (file: File): Promise<CSVParseResult> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const errors: string[] = [];
        const validData: any[] = [];

        if (results.errors.length > 0) {
          results.errors.forEach(error => {
            errors.push(`Row ${error.row}: ${error.message}`);
          });
        }

        results.data.forEach((row: any, index: number) => {
          const cleanRow: any = {};
          let hasValidData = false;

          Object.keys(row).forEach(key => {
            const cleanKey = key.trim();
            const value = row[key];
            
            if (value !== null && value !== undefined && value !== '') {
              cleanRow[cleanKey] = typeof value === 'string' ? value.trim() : value;
              hasValidData = true;
            }
          });

          if (hasValidData) {
            if (!cleanRow.id) {
              cleanRow.id = Date.now() + index;
            }

            if (cleanRow.age !== undefined && cleanRow.age !== '') {
              const age = parseInt(cleanRow.age);
              if (isNaN(age) || age < 0 || age > 120) {
                errors.push(`Row ${index + 1}: Invalid age value "${cleanRow.age}"`);
              } else {
                cleanRow.age = age;
              }
            }

            if (cleanRow.email && !isValidEmail(cleanRow.email)) {
              errors.push(`Row ${index + 1}: Invalid email format "${cleanRow.email}"`);
            }

            validData.push(cleanRow);
          }
        });

        resolve({
          data: validData,
          errors
        });
      },
      error: (error) => {
        resolve({
          data: [],
          errors: [error.message]
        });
      }
    });
  });
};

export const exportToCSV = (data: any[], columns: string[], filename: string) => {
  const csvContent = Papa.unparse({
    fields: columns,
    data: data.map(row => {
      const exportRow: any = {};
      columns.forEach(col => {
        exportRow[col] = row[col] || '';
      });
      return exportRow;
    })
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};