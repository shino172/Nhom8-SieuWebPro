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
