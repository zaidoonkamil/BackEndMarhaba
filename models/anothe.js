const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BookingAnothe = sequelize.define("bookingAnothe", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    images: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    desc: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    province: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = BookingAnothe;