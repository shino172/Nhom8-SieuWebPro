function add() {
  document
    .getElementById("devicesform")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      var formData = new FormData(); // Create FormData object to handle file upload
      formData.append("name", document.getElementById("name").value);
      formData.append(
        "description",
        document.getElementById("description").value
      );
      formData.append("price", document.getElementById("price").value);
      formData.append("software", document.getElementById("software").value);
      formData.append("image", document.getElementById("image").files[0]); // Get the selected image file

      fetch("http://localhost:3000/api/addDevices", {
        method: "POST",
        body: formData, // Use FormData instead of JSON.stringify(data)
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          alert(data.message);
        })
        .catch((error) => {
          console.error("There was an error!", error);
          alert("An error occurred while adding the device");
        });
    });
}
function addMany() {
  document
    .getElementById("importJson")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Ngăn chặn hành động mặc định của form

      // Lấy đối tượng file từ input
      var fileInput = document.getElementById("jsonFile");
      var file = fileInput.files[0];

      // Kiểm tra xem người dùng đã chọn file chưa
      if (!file) {
        alert("Vui lòng chọn file JSON để import.");
        return;
      }

      // Tạo đối tượng FormData để gửi dữ liệu form và file lên server
      var formData = new FormData();
      formData.append("jsonFile", file);

      // Gửi yêu cầu import JSON đến máy chủ
      fetch("/api/importJson", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            return response.json(); // Trả về dữ liệu JSON từ phản hồi
          } else {
            throw new Error("Failed to import JSON.");
          }
        })
        .then((data) => {
          // Hiển thị thông báo thành công
          alert(data.message);
        })
        .catch((error) => {
          // Hiển thị thông báo lỗi
          console.error("Failed to import JSON:", error);
          alert("Import JSON thất bại.");
        });
    });
}
