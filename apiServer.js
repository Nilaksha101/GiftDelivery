const express = require("express");
var cors = require("cors");
const app = express();
const port = 3000;

// These lines will be explained in detail later in the unit
app.use(express.json()); // process json
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// These lines will be explained in detail later in the unit

const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://12217608:12217608@clustergiftdelivery.7swnknl.mongodb.net/?retryWrites=true&w=majority"; //Url of the mongo db connection
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Global for general use
var userCollection;
var orderCollection;

client.connect((err) => {
  userCollection = client.db("GiftDelivery").collection("users");
  orderCollection = client.db("GiftDelivery").collection("orders");

  // perform actions on the collection object
  console.log("Database up!\n");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/getUserDataTest", (req, res) => {
  userCollection
    .find({}, { projection: { _id: 0 } })
    .toArray(function (err, docs) {
      if (err) {
        console.log("Some error.. " + err + "\n");
      } else {
        console.log(JSON.stringify(docs) + " have been retrieved.\n");
        var str = "<h1>" + JSON.stringify(docs) + "</h1>";
        str += "<h1> Error: " + err + "</h1>";
        res.send(str);
      }
    });
});

app.get("/getOrderDataTest", (req, res) => {
  orderCollection
    .find({}, { projection: { _id: 0 } })
    .toArray(function (err, docs) {
      if (err) {
        console.log("Some error.. " + err + "\n");
      } else {
        console.log(JSON.stringify(docs) + " have been retrieved.\n");
        var str = "<h1>" + JSON.stringify(docs) + "</h1>";
        str += "<h1> Error: " + err + "</h1>";
        res.send(str);
      }
    });
});

app.post("/verifyUser", (req, res) => {
  loginData = req.body;

  console.log(loginData);

  userCollection
    .find(
      { email: loginData.email, password: loginData.password },
      { projection: { _id: 0 } }
    )
    .toArray(function (err, docs) {
      if (err) {
        console.log("Some error.. " + err + "\n");
      } else {
        console.log(JSON.stringify(docs) + " have been retrieved.\n");
        res.status(200).send(docs);
      }
    });
});

app.get("/getOrderData", (req, res) => {
  orderCollection
    .find({}, { projection: { _id: 0 } })
    .toArray(function (err, docs) {
      if (err) {
        console.log("Some error.. " + err + "\n");
      } else {
        console.log(JSON.stringify(docs) + " have been retrieved.\n");
        res.json(docs);
      }
    });
});

app.post("/postOrderData", function (req, res) {
  console.log("POST request received : " + JSON.stringify(req.body));

  orderCollection.insertOne(req.body, function (err, result) {
    if (err) {
      console.log("Some error.. " + err + "\n");
    } else {
      console.log(JSON.stringify(req.body) + " have been uploaded\n");
      res.send(JSON.stringify(req.body));
    }
  });
});

app.post("/postSignupData", function (req, res) {
  // Check if the email already exists in the database
  userCollection.findOne(
    { email: req.body.email },
    function (err, existingUser) {
      if (err) {
        console.log("Error checking for existing user:", err);
        res
          .status(500)
          .send({
            success: false,
            message: "Error occurred while checking for existing user.",
          });
      } else if (existingUser) {
        console.log("Email already exists:", req.body.email);
        res
          .status(400)
          .send({ success: false, message: "Email already exists." });
      } else {
        userCollection.insertOne(req.body, function (err, result) {
          if (err) {
            console.log("Error saving user data:", err);
            res
              .status(500)
              .send({
                success: false,
                message: "Error occurred while saving user data.",
              });
          } else {
            console.log("User data saved successfully:", req.body);
            res
              .status(200)
              .send({
                success: true,
                message: "User data saved successfully.",
              });
          }
        });
      }
    }
  );
});

app.delete("/deleteOrders", function (req, res) {
  orderCollection.deleteMany({ email: req.body.id }, function (err, result) {
    if (err) {
      console.error("Error deleting orders:", err);
      res.status(500).send({ error: "Error deleting orders" });
    } else {
      res.send({ count: result.deletedCount });
    }
  });
});

app.get("/pastOrders", async function (req, res) {
  await orderCollection
    .find({ email: req.query.id }, { projection: { _id: 0 } })
    .toArray(function (err, docs) {
      if (err) {
        console.log("Some error.. " + err + "\n");
      } else {
        console.log(JSON.stringify(docs) + " have been retrieved.\n");
        res.json(docs);
      }
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
