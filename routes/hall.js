const express = require("express");
const BookingHall = require("../models/hall");
const upload = require("../middlewares/uploads");
const router = express.Router();


router.post("/hall",upload.array("images",5) , async (req, res) => {
    try {
        const { title, price, desc, province, phone, status } = req.body;

        if (!title || !price || !desc || !province || !phone) {
            return res.status(400).json({ error: "جميع الحقول مطلوبة" });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "جميع الحقول مطلوبة" });
        }

        const allowedStatuses = ["pending", "accepted", "rejected"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "قيمة الحالة غير صحيحة" });
        }

        const images = req.files.map(file => file.filename);
        const bookingHall = await BookingHall.create({
            title,
            images,
            price,
            desc,
            province,
            phone,
            status,
        });

        res.status(201).json(bookingHall);
    } catch (error) {
        console.error("Error creating BookingHall:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.patch("/hall/:id", upload.none(),async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const allowedStatuses = ["pending", "accepted", "rejected"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: "الحالة غير صحيحة" });
      }
  
      const BookingHall = await BookingHall.findByPk(id);
      if (!BookingHall) {
        return res.status(404).json({ error: "لم يتم العثور على الحقل" });
      }
  
      BookingHall.status = status;
      await BookingHall.save();
  
      res.status(200).json({ message: "تم تحديث الحالة بنجاح", BookingHall });
    } catch (error) {
      console.error("Error updating farm status:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });
  
router.get("/hall", async (req, res) => {
    try {
        const { province } = req.query;
        const whereClause = {
             status: "accepted"
        };

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