const express = require("express");
const BookingFarm = require("../models/farm");
const upload = require("../middlewares/uploads");
const jwt = require('jsonwebtoken');
const router = express.Router();

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: "Access denied, no token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user;
        next();
    });
};


router.post("/farm",upload.array("images",5) , authenticateToken , async (req, res) => {
    try {
        const { title, price, desc, province, phone } = req.body;

        if (!title || !price || !desc || !province || !phone) {
            return res.status(400).json({ error: "جميع الحقول مطلوبة" });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "جميع الحقول مطلوبة" });
        }
        
        const images = req.files.map(file => file.filename);
        const status = req.user.role === "admin" ? "accepted" : "pending";

        const bookingFarm = await BookingFarm.create({
            title,
            images,
            price,
            desc,
            province,
            phone,
            status      
        });

        res.status(201).json(bookingFarm);
    } catch (error) {
        console.error("Error creating BookingFarm:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.patch("/farm/:id", upload.none(), authenticateToken, async (req, res) => {
    try {
      // تحقق ان المستخدم ادمن
      if (req.user.role !== "admin") {
        return res.status(403).json({ error: "غير مصرح لك بتعديل الحالة" });
      }
  
      const { id } = req.params;
      const { status } = req.body;
  
      // تحقق من القيم المسموحة
      const allowedStatuses = ["pending", "accepted", "rejected"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: "الحالة غير صحيحة" });
      }
  
      const bookingFarm = await BookingFarm.findByPk(id);
      if (!bookingFarm) {
        return res.status(404).json({ error: "لم يتم العثور على الحقل" });
      }
  
      // تحديث الحالة
      bookingFarm.status = status;
      await bookingFarm.save();
  
      res.status(200).json({ message: "تم تحديث الحالة بنجاح", bookingFarm });
    } catch (error) {
      console.error("Error updating farm status:", error);
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