const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir("C:/Users/gaura/Downloads/capstone/capstone/frontend/src/app", (filePath) => {
  if (filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace form-box h4
    content = content.replace(/\.form-box h4 \{.*?\}/g, 
      ".form-box h4 {\n  font-size: 20px;\n  font-weight: 800;\n  color: white;\n  margin-bottom: 24px;\n  text-align: center;\n  background: linear-gradient(135deg, #1B4332, #2D6A4F);\n  padding: 16px;\n  border-radius: 8px;\n  box-shadow: 0 4px 6px rgba(27,67,50,0.2);\n  text-transform: uppercase;\n  letter-spacing: 1px;\n}");
      
    // There might also be .modal-overlay .form-card h4 in some places, like admin-batches manual enrolment
    content = content.replace(/\.form-card h4 \{.*?\}/g, 
      ".form-card h4 {\n  font-size: 20px;\n  font-weight: 800;\n  color: white;\n  margin-bottom: 24px;\n  text-align: center;\n  background: linear-gradient(135deg, #1B4332, #2D6A4F);\n  padding: 16px;\n  border-radius: 8px;\n  box-shadow: 0 4px 6px rgba(27,67,50,0.2);\n  text-transform: uppercase;\n  letter-spacing: 1px;\n}");

    fs.writeFileSync(filePath, content);
  }
});
console.log('done formatting panel title');
