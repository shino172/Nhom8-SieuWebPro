const { MongoClient } = require("mongodb");

let dbCollection;
let client;
const url = "mongodb://0.0.0.0:27017/";
const dbName = "local";
const collectionName = "devices";

async function connectToMongoDB() {
  try {
    client = await MongoClient.connect(url);
    dbCollection = client.db(dbName).collection(collectionName);
  } catch (err) {
    throw err;
  }
}

async function closeMongoDBConnection() {
  if (client) {
    await client
      .close()
      .then(() => {
        console.log("Disconnected from MongoDB");
        process.exit(0);
      })
      .catch((err) => {
        console.error("Failed to disconnect from MongoDB:", err);
        process.exit(1);
      });
  } else {
    process.exit(0);
  }
}

async function addDevices(name, description, image, price, software) {
  try {
    const count = await dbCollection.countDocuments();
    const newId = `DVH${(count + 1).toString().padStart(3, "0")}`;

    let query = {
      id: newId,
      name: name,
      description: description,
      image: image,
      price: price,
      software: software,
    };

    const result = await dbCollection.insertOne(query);
    if (result.insertedCount === 1) {
      console.log("Insertion successful!");
      return true;
    } else {
      console.log("Document not inserted.");
      return false;
    }
  } catch (error) {
    console.error("Error occurred while adding document:", error);
    throw error;
  }
}

async function addMany(devicesDataArray) {
  try {
    const result = await dbCollection.insertMany(devicesDataArray);
    if (result.insertedCount === devicesDataArray.length) {
      console.log("Insertion successful!");
      return true;
    } else {
      console.log("Some documents were not inserted.");
      return false;
    }
  } catch (error) {
    console.error("Error occurred while adding documents:", error);
    throw error;
  }
}

async function getAllDevices() {
  const devices = await dbCollection.find().toArray();
  return devices;
}

async function findDevicesByNameLimit(name, limitPrice) {
  let query = { name: { $regex: name, $options: "i" } };
  query.price = { $gt: limitPrice };

  const devices = await dbCollection.find(query).toArray();
  return devices;
}

async function findDevicesByName(name) {
  let query = { name: { $regex: name, $options: "i" } };

  const devices = await dbCollection.find(query).toArray();
  return devices;
}

async function findDevicesByNameLimit(name, limitPrice) {
  let query = { name: { $regex: name, $options: "i" } };
  query.price = { $gt: limitPrice };

  const devices = await dbCollection.find(query).toArray();
  return devices;
}

async function deleteByID(id) {
  try {
    let query = { id: id };
    console.log("Deleting document with ID:", query);

    const result = await dbCollection.deleteOne(query);
    if (result.deletedCount === 1) {
      console.log("Deletion successful!");
      return true;
    } else {
      console.log("Document not found for deletion.");
      return false;
    }
  } catch (error) {
    console.error("Error occurred while deleting document:", error);
    throw error; // Rethrow the error to handle it outside this function if needed
  }
}

async function updateByID(id, data) {
  try {
    let query = { id: id };
    // let dataQuery = { data: data };
    let updateData = { $set: data };
    const devices = await dbCollection.updateOne(query, updateData);
    return devices;
  } catch (error) {
    console.error("Error occurred while updating document:", error);
  }
}

async function updateMulti(name, data) {
  try {
    let query = { name: { $regex: name, $options: "i" } };
    // let dataQuery = { data: data };
    console.log(name);
    let updateData = { $set: data };
    const devices = await dbCollection.updateMany(query, updateData);
    return devices;
  } catch (error) {
    console.error("Error occurred while updating document:", error);
  }
}

// Sửa tên biến $or và $and thành query và $andQuery
async function search(string, minPrice, maxPrice) {
  try {
    let query = {};
    let $andQuery = [];

    if (string !== "null" && string !== "") {
      // Kiểm tra string không phải là "null" hoặc rỗng
      $andQuery.push({
        $or: [
          { id: { $regex: string, $options: "i" } },
          { name: { $regex: string, $options: "i" } },
        ],
      });
    }

    if (!isNaN(parseFloat(minPrice)) && parseFloat(minPrice) >= 0) {
      // Kiểm tra minPrice là số và không âm
      $andQuery.push({ price: { $gte: parseFloat(minPrice) } });
    }

    if (!isNaN(parseFloat(maxPrice)) && parseFloat(maxPrice) >= 0) {
      // Kiểm tra maxPrice là số và không âm
      $andQuery.push({ price: { $lte: parseFloat(maxPrice) } });
    }

    if ($andQuery.length > 0) {
      query.$and = $andQuery;
    }

    console.log("Query:", query);
    const devices = await dbCollection.find(query).toArray();
    console.log("Devices:", devices);
    return devices;
  } catch (error) {
    console.error("Error occurred while searching for devices:", error);
    throw error;
  }
}

module.exports = {
  connectToMongoDB,
  closeMongoDBConnection,
  findDevicesByName,
  findDevicesByNameLimit,
  deleteByID,
  getAllDevices,
  updateByID,
  updateMulti,
  addDevices,
  search,
  addMany,
};
