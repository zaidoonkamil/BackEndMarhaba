const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");


const Booking = sequelize.define("Booking", {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    ownerId: { type: DataTypes.INTEGER, allowNull: false },

    productId: { type: DataTypes.INTEGER, allowNull: false },

    productType: {
        type: DataTypes.ENUM("farm", "adress", "hall", "anothe", "tourism"),
        allowNull: false
    }
}, {
    timestamps: true,
});

Booking.belongsTo(User, { foreignKey: "userId", as: "user" });
Booking.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

module.exports = Booking;
