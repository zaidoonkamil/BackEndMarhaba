const express = require("express");
const Adress = require("../models/adress");
const Another = require("../models/anothe");
const Hall = require("../models/hall");
const Farm = require("../models/farm");
const router = express.Router();


router.get("/pending-all",async (req, res) => {
    try {
      const [pendingAdresses, pendingAnothers, pendingHalls, pendingFarms] = await Promise.all([
        Adress.findAll({ where: { status: 'pending' } }),
        Another.findAll({ where: { status: 'pending' } }),
        Hall.findAll({ where: { status: 'pending' } }),
        Farm.findAll({ where: { status: 'pending' } }),
      ]);
  
      // دمجهم في Array وحدة
      const pendingItems = [
        ...pendingAdresses.map(item => ({ ...item.dataValues, type: 'adress' })),
        ...pendingAnothers.map(item => ({ ...item.dataValues, type: 'another' })),
        ...pendingHalls.map(item => ({ ...item.dataValues, type: 'hall' })),
        ...pendingFarms.map(item => ({ ...item.dataValues, type: 'farm' }))
      ];
  
      res.status(200).json(pendingItems);
  
    } catch (error) {
      console.error("Error fetching pending records:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });
  

module.exports = router;