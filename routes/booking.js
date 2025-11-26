const express = require("express");
const Booking = require("../models/booking");
const upload = require("multer")();
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

        const farm = await BookingFarm.findAll({
            where: { userId },
            limit: 30
        });

        const adress = await BookingAdress.findAll({
            where: { userId },
            limit: 30
        });
        
        let all = [...farm, ...adress];

        all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const result = all.slice(0, 30);

        res.status(200).json(result);

    } catch (error) {
        console.error("Error getting user bookings:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});


module.exports = router;