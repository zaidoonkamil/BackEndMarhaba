const express = require("express");
const Booking = require("../models/booking");
const upload = require("multer")();
const BookingFarm = require("../models/farm");
const BookingAdress = require("../models/adress");
const BookingHall = require("../models/hall");
const BookingAnothe = require("../models/anothe");
const BookingTourism = require("../models/tourism");
const router = express.Router();

router.post("/booking", upload.none(), async (req, res) => {
    try {
        const { userId, ownerId, productId, productType } = req.body;

        if (!userId || !ownerId || !productId || !productType) {
            return res.status(400).json({ error: "جميع الحقول مطلوبة" });
        }

        const allowedTypes = ["farm", "adress", "hall", "anothe", "other1", "other2"];
        if (!allowedTypes.includes(productType)) {
            return res.status(400).json({ error: "productType غير صالح" });
        }

        const booking = await Booking.create({
            userId,
            ownerId,
            productId,
            productType
        });

        res.status(201).json({
            message: "تم إنشاء الحجز بنجاح",
            booking
        });

    } catch (err) {
        console.error("❌ Error creating booking:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/user-bookings/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const bookings = await Booking.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]],
            limit: 30
        });

        let results = [];

        for (const b of bookings) {
            let product = null;

            switch (b.productType) {
                case "farm":
                    product = await BookingFarm.findByPk(b.productId);
                    break;

                case "adress":
                    product = await BookingAdress.findByPk(b.productId);
                    break;

                case "hall":
                    product = await BookingHall.findByPk(b.productId);
                    break;

                case "anothe":
                    product = await BookingAnothe.findByPk(b.productId);
                    break;

                case "tourism":
                    product = await BookingTourism.findByPk(b.productId);
                    break;

            }

            results.push({
                bookingId: b.id,
                userId: b.userId,
                ownerId: b.ownerId,
                productType: b.productType,
                createdAt: b.createdAt,
                product: product 
            });
        }

        res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error get user bookings:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = router;