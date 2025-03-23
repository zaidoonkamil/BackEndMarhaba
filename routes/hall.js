const express = require("express");
const BookingHall = require("../models/hall");
const upload = require("../middlewares/uploads");

const router = express.Router();

router.post("/hall",upload.array("images",5) , async (req, res) => {
    try {
        const { title, price, desc, province, phone } = req.body;

        if (!title || !price || !desc || !province || !phone) {
            return res.status(400).json({ error: "جميع الحقول مطلوبة" });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "جميع الحقول مطلوبة" });
        }
        const images = req.files.map(file => file.filename);
        const bookingHall = await BookingHall.create({
            title,
            images,
            price,
            desc,
            province,
            phone,
        });

        res.status(201).json(bookingHall);
    } catch (error) {
        console.error("Error creating BookingHall:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.get("/hall", async (req, res) => {
    try {
        const { province } = req.query;
        const whereClause = {};

        if (province) whereClause.province = province;

        const bookingHalls = await BookingHall.findAll({ where: whereClause });
        res.status(200).json(bookingHalls);
    } catch (error) {
        console.error("Error getting bookingHalls:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});


router.delete("/hall/:id", async (req, res) => {  
    try {
        const { id } = req.params;
        const bookingHall = await BookingHall.findByPk(id);
        if (!bookingHall) {
            return res.status(404).json({ error: "لم يتم العثور على هذا الحقل" });
        }
        await bookingHall.destroy();
        res.status(204).end();
    } catch (error) {
        console.error("Error deleting BookingHall:", error);
        res.status(500).json({ error: "Internal server error." });
    }

 });

module.exports = router;