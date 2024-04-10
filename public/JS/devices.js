// devices.js

// Hàm renderProducts để hiển thị danh sách sản phẩm
function renderProducts(devicesArray) {
  var container = document.getElementById("product-container");
  container.innerHTML = ""; // Xóa nội dung trước đó

  devicesArray.forEach(function (device) {
    var card = document.createElement("div");
    card.className = "product-card";
    var img = document.createElement("img");
    img.src = "/public/images/" + device.image;
    img.alt = device.name;
    var content = document.createElement("div");
    content.className = "product-content";
    var name = document.createElement("h3");
    name.className = "product-name";
    name.textContent = device.name;
    var price = document.createElement("p");
    price.className = "product-price";
    price.textContent = device.price;

    content.appendChild(name);
    content.appendChild(price);
    card.appendChild(img);
    card.appendChild(content);
    container.appendChild(card);
  });
}

// Hàm fetch API để lấy danh sách sản phẩm và gọi hàm renderProducts
function fetchProducts() {
  fetch("/api/getAll")
    .then((response) => response.json())
    .then((data) => {
      renderProducts(data);
    })
    .catch((error) => console.error("Failed to fetch products:", error));
}

// Khi trang được tải, gọi hàm fetchProducts để hiển thị danh sách sản phẩm
window.onload = function () {
  fetchProducts();
};
