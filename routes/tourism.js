const express = require("express");
const BookingTourism = require("../models/tourism");
const upload = require("../middlewares/uploads");
const router = express.Router();

router.post("/tourism",upload.array("images",5) , async (req, res) => {
    try {
        const { title, price, desc, province, phone , status  } = req.body;

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

        const bookingTourism = await BookingTourism.create({
            title,
            images,
            price,
            desc,
            province,
            phone,
            status      
        });

        res.status(201).json(bookingTourism);
    } catch (error) {
        console.error("Error creating BookingTourism:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.patch("/tourism/:id", upload.none(), async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const allowedStatuses = ["pending", "accepted", "rejected"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: "الحالة غير صحيحة" });
      }
  
      const bookingTourism = await BookingTourism.findByPk(id);
      if (!bookingTourism) {
        return res.status(404).json({ error: "لم يتم العثور على الحقل" });
      }
  
      bookingTourism.status = status;
      await bookingTourism.save();
  
      res.status(200).json({ message: "تم تحديث الحالة بنجاح", bookingTourism });
    } catch (error) {
      console.error("Error updating Tourism status:", error);
      res.status(500).json({ error: "Internal server error." });
    }
});
  
router.get("/tourism", async (req, res) => {
    try {
        const { province } = req.query;
        const whereClause = {
            status: "accepted"
        };

        if (province) whereClause.province = province;

        const bookingTourism = await BookingTourism.findAll({ where: whereClause });
        res.status(200).json(bookingTourism);
    } catch (error) {
        console.error("Error getting BookingTourism:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.delete("/tourism/:id", async (req, res) => {  
    try {
        const { id } = req.params;
        const bookingTourism = await BookingTourism.findByPk(id);
        if (!bookingTourism) {
            return res.status(404).json({ error: "لم يتم العثور على هذا الحقل" });
        }
        await bookingTourism.destroy();
        res.status(204).end();
    } catch (error) {
        console.error("Error deleting BookingTourism:", error);
        res.status(500).json({ error: "Internal server error." });
    }

 });

module.exports = router;