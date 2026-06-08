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
    content = content.replace(/background: #F8F9FA;/g, "background: #121212;");
    
    // Cards backgrounds and borders
    content = content.replace(/\.stat-card \{\s*background: white;/g, ".stat-card {\n  background: #1e1e1e;");
    content = content.replace(/border: 1px solid #E2E8F0;/g, "border: 1px solid #333;");
    
    content = content.replace(/\.stat-info p \{ font-size: 13px; color: #64748B; margin-bottom: (\d+)px; font-weight: 500; \}/g, 
      ".stat-info p { font-size: 15px; color: #A0AEC0; margin-bottom: $1px; font-weight: 500; }");
      
    content = content.replace(/\.stat-info h2 \{ font-size: (\d+)px; font-weight: 700; color: #1B4332; \}/g, 
      (match, p1) => {
        let size = parseInt(p1);
        if (size === 36) size = 42;
        if (size === 24) size = 28;
        return `.stat-info h2 { font-size: ${size}px; font-weight: 700; color: #ffffff; }`;
      });
      
    // Header left text size
    content = content.replace(/\.header-left h3 \{ font-size: 22px; font-weight: 700; \}/g, 
      ".header-left h3 { font-size: 26px; font-weight: 700; }");
      
    content = content.replace(/\.header-left p \{ font-size: 13px; opacity: 0\.7; margin-top: 4px; \}/g, 
      ".header-left p { font-size: 15px; opacity: 0.7; margin-top: 4px; }");

    // Other dark backgrounds
    content = content.replace(/\.section-card \{\s*background: white;/g, ".section-card {\n  background: #1e1e1e;");
    content = content.replace(/\.table-box \{\s*background: white;/g, ".table-box {\n  background: #1e1e1e;");
    content = content.replace(/\.calendar-section \{\s*background: white;/g, ".calendar-section {\n  background: #1e1e1e;");
    content = content.replace(/\.form-box \{\s*background: white;/g, ".form-box {\n  background: #1e1e1e;");
    
    // Table styling
    content = content.replace(/td \{ font-size: 13px; color: #334155;/g, "td { font-size: 14px; color: #E2E8F0;");
    content = content.replace(/th \{\s*font-size: 11px;\s*color: #64748B;/g, "th {\n  font-size: 13px;\n  color: #A0AEC0;");
    content = content.replace(/border-bottom: 1px solid #F8F9FA;/g, "border-bottom: 1px solid #333;");
    
    // Other titles
    content = content.replace(/\.card-title h4 \{ font-size: 15px; font-weight: 700; color: #1B4332; \}/g, 
      ".card-title h4 { font-size: 17px; font-weight: 700; color: #ffffff; }");
      
    // Calendar day text
    content = content.replace(/\.cal-day \{\s*text-align: left;\s*padding: 6px;\s*min-height: 80px;\s*font-size: 13px;\s*color: #334155;/g, 
      ".cal-day {\n  text-align: left;\n  padding: 6px;\n  min-height: 80px;\n  font-size: 14px;\n  color: #E2E8F0;");
      
    // Form box text color
    content = content.replace(/\.form-box h4 \{ font-size: 16px; font-weight: 700; color: #1B4332; margin-bottom: 20px; \}/g, 
      ".form-box h4 { font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 20px; }");

    content = content.replace(/\.field label \{\s*font-size: 12px;\s*font-weight: 600;\s*color: #334155;/g, 
      ".field label {\n  font-size: 14px;\n  font-weight: 600;\n  color: #A0AEC0;");
      
    content = content.replace(/\.field input, \.field textarea, \.field select \{\s*padding: 11px 14px;\s*border: 1\.5px solid #CBD5E1;\s*border-radius: 8px;\s*font-size: 14px;\s*outline: none;\s*transition: all 0\.3s;\s*background: white;\s*\}/g, 
      ".field input, .field textarea, .field select {\n  padding: 11px 14px;\n  border: 1.5px solid #333;\n  border-radius: 8px;\n  font-size: 15px;\n  outline: none;\n  transition: all 0.3s;\n  background: #2a2a2a;\n  color: #ffffff;\n}");

    fs.writeFileSync(filePath, content);
  }
});
console.log('done all css');
