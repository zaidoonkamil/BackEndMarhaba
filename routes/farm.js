const express = require("express");
const BookingFarm = require("../models/farm");
const upload = require("../middlewares/uploads");

const router = express.Router();

router.post("/farm",upload.array("images",5) , async (req, res) => {
    try {
        const { title, price, desc, province, phone } = req.body;

        if (!title || !price || !desc || !province || !phone) {
            return res.status(400).json({ error: "جميع الحقول مطلوبة" });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "جميع الحقول مطلوبة" });
        }
        const images = req.files.map(file => file.filename);
        const bookingFarm = await BookingFarm.create({
            title,
            images,
            price,
            desc,
            province,
            phone,
        });

        res.status(201).json(bookingFarm);
    } catch (error) {
        console.error("Error creating BookingFarm:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.get("/farm", async (req, res) => {
    try {
        const { province } = req.query;
        const whereClause = {};

        if (province) whereClause.province = province;

        // جلب السجلات بناءً على whereClause
        const bookingFarm = await BookingFarm.findAll({ where: whereClause });
        res.status(200).json(bookingFarm);
    } catch (error) {
        console.error("Error getting BookingFarm:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});


router.delete("/farm/:id", async (req, res) => {  
    try {
        const { id } = req.params;
        const bookingFarm = await BookingFarm.findByPk(id);
        if (!bookingFarm) {
            return res.status(404).json({ error: "لم يتم العثور على هذا الحقل" });
        }
        await bookingFarm.destroy();
        res.status(204).end();
    } catch (error) {
        console.error("Error deleting BookingFarm:", error);
        res.status(500).json({ error: "Internal server error." });
    }

 });

module.exports = router;