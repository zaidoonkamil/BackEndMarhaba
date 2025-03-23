const express = require("express");
const BookingAdress = require("../models/adress");
const upload = require("../middlewares/uploads");

const router = express.Router();

router.post("/adress",upload.array("images",5) , async (req, res) => {
    try {
        const { title, price, desc, province, phone } = req.body;

        if (!title || !price || !desc || !province || !phone) {
            return res.status(400).json({ error: "جميع الحقول مطلوبة" });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "جميع الحقول مطلوبة" });
        }
        const images = req.files.map(file => file.filename);
        const bookingAdress = await BookingAdress.create({
            title,
            images,
            price,
            desc,
            province,
            phone,
        });

        res.status(201).json(bookingAdress);
    } catch (error) {
        console.error("Error creating BookingAdress:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.get("/adress", async (req, res) => {
    try {
        const { province } = req.query;
        const whereClause = {};

        if (province) whereClause.province = province;

        // جلب السجلات بناءً على whereClause
        const bookingAdress = await BookingAdress.findAll({ where: whereClause });
        res.status(200).json(bookingAdress);
    } catch (error) {
        console.error("Error getting bookingAdress:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.delete("/adress/:id", async (req, res) => {  
    try {
        const { id } = req.params;
        const bookingAdress = await BookingAdress.findByPk(id);
        if (!bookingAdress) {
            return res.status(404).json({ error: "لم يتم العثور على هذا الحقل" });
        }
        await bookingAdress.destroy();
        res.status(204).end();
    } catch (error) {
        console.error("Error deleting BookingAdress:", error);
        res.status(500).json({ error: "Internal server error." });
    }

 });

module.exports = router;