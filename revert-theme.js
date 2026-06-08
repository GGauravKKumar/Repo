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
    
    // Page background
    content = content.replace(/background: #121212;/g, "background: #F8F9FA;");
    
    // Cards backgrounds and borders
    content = content.replace(/\.stat-card \{\s*background: #1e1e1e;/g, ".stat-card {\n  background: white;");
    content = content.replace(/border: 1px solid #333;/g, "border: 1px solid #E2E8F0;");
    
    content = content.replace(/\.stat-info p \{ font-size: 15px; color: #A0AEC0; margin-bottom: (\d+)px; font-weight: 500; \}/g, 
      ".stat-info p { font-size: 15px; color: #1B4332; margin-bottom: $1px; font-weight: 700; }");
      
    content = content.replace(/\.stat-info h2 \{ font-size: (\d+)px; font-weight: 700; color: #ffffff; \}/g, 
      ".stat-info h2 { font-size: $1px; font-weight: 800; color: #1B4332; }");
      
    // Other dark backgrounds back to white
    content = content.replace(/\.section-card \{\s*background: #1e1e1e;/g, ".section-card {\n  background: white;");
    content = content.replace(/\.table-box \{\s*background: #1e1e1e;/g, ".table-box {\n  background: white;");
    content = content.replace(/\.calendar-section \{\s*background: #1e1e1e;/g, ".calendar-section {\n  background: white;");
    content = content.replace(/\.form-box \{\s*background: #1e1e1e;/g, ".form-box {\n  background: white;");
    
    // Table styling
    content = content.replace(/td \{ font-size: 14px; color: #E2E8F0;/g, "td { font-size: 14px; color: #1B4332; font-weight: 600;");
    content = content.replace(/th \{\s*font-size: 13px;\s*color: #A0AEC0;/g, "th {\n  font-size: 13px;\n  color: #1B4332;\n  font-weight: 700;");
    
    // Other titles
    content = content.replace(/\.card-title h4 \{ font-size: 17px; font-weight: 700; color: #ffffff; \}/g, 
      ".card-title h4 { font-size: 17px; font-weight: 800; color: #1B4332; }");
      
    // Calendar day text
    content = content.replace(/\.cal-day \{\s*text-align: left;\s*padding: 6px;\s*min-height: 80px;\s*font-size: 14px;\s*color: #E2E8F0;/g, 
      ".cal-day {\n  text-align: left;\n  padding: 6px;\n  min-height: 80px;\n  font-size: 14px;\n  color: #1B4332;\n  font-weight: 600;");
      
    // Form box text color
    content = content.replace(/\.form-box h4 \{ font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 20px; \}/g, 
      ".form-box h4 { font-size: 18px; font-weight: 800; color: #1B4332; margin-bottom: 20px; }");

    content = content.replace(/\.field label \{\s*font-size: 14px;\s*font-weight: 600;\s*color: #A0AEC0;/g, 
      ".field label {\n  font-size: 14px;\n  font-weight: 700;\n  color: #1B4332;");
      
    content = content.replace(/\.field input, \.field textarea, \.field select \{\s*padding: 11px 14px;\s*border: 1\.5px solid #333;\s*border-radius: 8px;\s*font-size: 15px;\s*outline: none;\s*transition: all 0\.3s;\s*background: #2a2a2a;\s*color: #ffffff;\s*\}/g, 
      ".field input, .field textarea, .field select {\n  padding: 11px 14px;\n  border: 1.5px solid #CBD5E1;\n  border-radius: 8px;\n  font-size: 15px;\n  font-weight: 600;\n  outline: none;\n  transition: all 0.3s;\n  background: white;\n  color: #1B4332;\n}");

    fs.writeFileSync(filePath, content);
  }
});
console.log('done reverting theme');
