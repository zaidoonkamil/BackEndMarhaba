const express = require("express");
const BookingAnothe = require("../models/anothe");
const upload = require("../middlewares/uploads");

const router = express.Router();

router.post("/anothe",upload.array("images",5) , async (req, res) => {
    try {
        const { title, price, desc, province, phone } = req.body;

        if (!title || !price || !desc || !province || !phone) {
            return res.status(400).json({ error: "جميع الحقول مطلوبة" });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "جميع الحقول مطلوبة" });
        }
        const images = req.files.map(file => file.filename);
        const bookingAnothe = await BookingAnothe.create({
            title,
            images,
            price,
            desc,
            province,
            phone,
        });

        res.status(201).json(bookingAnothe);
    } catch (error) {
        console.error("Error creating BookingAnothe:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.get("/anothe", async (req, res) => {
    try {
        const { province } = req.query;
        const whereClause = {};

        if (province) whereClause.province = province;

        // جلب السجلات بناءً على whereClause
        const bookingAnothe = await BookingAnothe.findAll({ where: whereClause });
        res.status(200).json(bookingAnothe);
    } catch (error) {
        console.error("Error getting bookingAnothe:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});


router.delete("/anothe/:id", async (req, res) => {  
    try {
        const { id } = req.params;
        const bookingAnothe = await BookingAnothe.findByPk(id);
        if (!bookingAnothe) {
            return res.status(404).json({ error: "لم يتم العثور على هذا الحقل" });
        }
        await bookingAnothe.destroy();
        res.status(204).end();
    } catch (error) {
        console.error("Error deleting BookingAdress:", error);
        res.status(500).json({ error: "Internal server error." });
    }

 });

module.exports = router;