const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

function updateDevicesHTML() {
  try {
    const htmlPath = path.join(__dirname, "update.html");

    // Đọc nội dung của tệp HTML
    const html = fs.readFileSync(htmlPath, "utf8");

    return html;
  } catch (err) {
    console.error("Failed to read HTML file:", err);
    return "<p>Failed to load HTML content</p>";
  }
}
function viewHTML(devices) {
  try {
    const htmlPath = path.join(__dirname, "listProduct.html");

    // Đọc nội dung của tệp HTML
    const html = fs.readFileSync(htmlPath, "utf8");

    // Compile template HTML thành một hàm
    const template = Handlebars.compile(html);

    // Render dữ liệu JSON vào template HTML
    const renderedHtml = template({ devices: devices });

    return renderedHtml;
  } catch (err) {
    console.error("Failed to read HTML file:", err);
    return "<p>Failed to load HTML content</p>";
  }
}

module.exports = {
  addDevicesHTML,
  updateDevicesHTML,
  viewHTML,
};
