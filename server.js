require('dotenv').config();
const cors = require('cors');
const express = require('express');
const adsRoutes = require("./routes/ads");
const sequelize = require('./config/db');
const farm = require("./routes/farm");
const hall = require("./routes/hall");
const adress = require("./routes/adress");
const anothe = require("./routes/anothe");
const tourism = require("./routes/tourism");
const user = require("./routes/user");
const pending= require("./routes/pending_all");

const app = express();
app.use("/uploads", express.static("./" + "uploads"));
app.use(express.json());

app.use(cors({origin: '*', }));

sequelize.sync({ force: false })
    .then(() => console.log("✅ Database synchronized successfully!"))
    .catch(err => console.error("❌ Error synchronizing database:", err.message));


app.use("/", adsRoutes);
app.use("/", farm);
app.use("/", hall);
app.use("/", adress);
app.use("/", anothe);
app.use("/", tourism);
app.use("/", user);
app.use("/", pending);

app.listen(1700 , () => {
    console.log(`🚀 Server running on http://localhost:1700`);
});
