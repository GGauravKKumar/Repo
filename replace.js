const fs = require('fs');
const files = [
  "C:/Users/gaura/Downloads/capstone/capstone/frontend/src/app/admin/admin-batches/admin-batches.css",
  "C:/Users/gaura/Downloads/capstone/capstone/frontend/src/app/admin/admin-courses/admin-courses.css",
  "C:/Users/gaura/Downloads/capstone/capstone/frontend/src/app/admin/admin-dashboard/admin-dashboard.css",
  "C:/Users/gaura/Downloads/capstone/capstone/frontend/src/app/admin/admin-reports/admin-reports.css",
  "C:/Users/gaura/Downloads/capstone/capstone/frontend/src/app/admin/admin-users/admin-users.css",
  "C:/Users/gaura/Downloads/capstone/capstone/frontend/src/app/employee/employee-dashboard/employee-dashboard.css",
  "C:/Users/gaura/Downloads/capstone/capstone/frontend/src/app/manager/manager-dashboard/manager-dashboard.css"
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/nav ul li \{\s*padding: 13px 24px;\s*font-size: 14px;\s*cursor: pointer;\s*opacity: 0\.7;/g, 
      "nav ul li {\n  padding: 13px 24px;\n  font-size: 16px;\n  cursor: pointer;\n  opacity: 1;\n  color: #ffffff;");
    
    content = content.replace(/\.logout \{\s*padding: 16px 24px;\s*font-size: 14px;\s*cursor: pointer;\s*opacity: 0\.7;/g, 
      ".logout {\n  padding: 16px 24px;\n  font-size: 16px;\n  cursor: pointer;\n  opacity: 1;\n  color: #ffffff;");
      
    fs.writeFileSync(file, content);
  }
});
console.log('done');
