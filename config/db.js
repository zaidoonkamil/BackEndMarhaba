const { Sequelize } = require("sequelize");
const dotenv = require('dotenv');
dotenv.config();
console.log({env: process.env})

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
});

sequelize.authenticate()
    .then(() => console.log("✅ Connected to MySQL successfully!"))
    .catch(err => console.error("❌ Unable to connect to MySQL:", err));
    

module.exports = sequelize;
