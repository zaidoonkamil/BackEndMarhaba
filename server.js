require('dotenv').config();

const express = require('express');
const adsRoutes = require("./routes/ads");
const sequelize = require('./config/db');
const farm = require("./routes/farm");
const hall = require("./routes/hall");
const adress = require("./routes/adress");
const anothe = require("./routes/anothe");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use("/uploads", express.static("./" + "uploads"));

app.use(cors());

sequelize.sync({ force: false })
    .then(() => console.log("✅ Database synchronized successfully!"))
    .catch(err => console.error("❌ Error synchronizing database:", err.message));


app.use("/", adsRoutes);
app.use("/", farm);
app.use("/", hall);
app.use("/", adress);
app.use("/", anothe);

app.listen(3000 , () => {
    console.log(`🚀 Server running on http://localhost:3000`);
});
