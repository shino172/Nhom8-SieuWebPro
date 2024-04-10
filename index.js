const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.use(
  "/public",
  express.static(__dirname + "/public", {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

port = 3000;
const {
  connectToMongoDB,
  closeMongoDBConnection,
  findDevicesByName,
  findDevicesByNameLimit,
  deleteByID,
  getAllDevices,
  updateByID,
  updateMulti,
  addDevices,
} = require("./mongob");

mongodbModule = {
  connectToMongoDB,
  closeMongoDBConnection,
  findDevicesByName,
  findDevicesByNameLimit,
  deleteByID,
  getAllDevices,
  updateByID,
  updateMulti,
  addDevices,
};

const server = app.listen(port, () =>
  console.log(`Server is running at http://localhost:${port}/`)
);

mongodbModule
  .connectToMongoDB()
  .then(() => {
    console.log("Connect to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB: ", err);
    server.close();
  });

process.on("SIGINT", () => {
  mongodbModule.closeMongoDBConnection();
});



app.get("/", async (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/pages/devices.html"));
});

app.get("/api/getAll", async (req, res) => {
  try {
    const data = await getAllDevices();
    res.status(200).json(data);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/addDevices", async (req, res) => {
  const html = devicesModule.addDevicesHTML();
  res.send(html);
});
app.get("/update", async (req, res) => {
  const html = devicesModule.updateDevicesHTML();
  res.send(html);
});
app.get("/view", async (req, res) => {
  const devices = await getAllDevices();
  const html = devicesModule.viewHTML(devices);
  res.send(html);
});

app.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const data = {
      name: "DV Smarthphone",
      description: "A mobile phone come from ... ",
      image: "/images/1.jpg",
      price: 599.99,
      software: "iOS, Android",
    };
    const devices = await updateByID(id, data);
    res.send("update succes");
  } catch (err) {
    console.error("Failed to update devices", err);
    res.status(500).send("Error");
  }
});
app.put("/updateMutil/:name", async (req, res) => {
  try {
    const name = req.params.name;
    // console.log(req.params.name);
    const data = {
      name: "DV Smarthphone",
      description: "A mobile phone come from ... ",
      image: "/images/1.jpg",
      price: 599.99,
      software: "iOS, Android",
    };
    const devices = await updateMulti(name, data);
    res.send("update mutil succes");
  } catch (err) {
    console.error("Failed to update devices", err);
    res.status(500).send("Error");
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const devices = await deleteByID(id);
    res.send("delete success");
  } catch (err) {
    console.error("Failed to delete devices", err);
    res.status(500).send("Error");
  }
});

app.post("/api/addDevices", upload.single("image"), async (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const image = req.file.filename;
  const price = req.body.price;
  const software = req.body.software;

  try {
    const devices = await addDevices(name, description, image, price, software);
    console.log("Devices:", devices);
    res
      .status(200)
      .json({ message: "Device added successfully", result: devices });
  } catch (error) {
    console.error("Failed to add device:", error);

    res
      .status(500)
      .json({ message: "An error occurred while adding the device" });
  }
});
app.get("/api/search/:search", async (req, res) => {
  // const { string, minPrice, maxPrice } = req.params;
  const { string } = req.params;
  try {
    console.log(req.params);
    const devices = await search(string);
    res.status(200).json({ message: "Device added search", result: devices });
  } catch (error) {
    console.error("Failed to add device:", error);

    res
      .status(500)
      .json({ message: "An error occurred while adding the device" });
  }
});
