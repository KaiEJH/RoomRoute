const express = require('express');
const runPathfinding = require('../utils/snakeRunner');

const router = express.Router();

router.post('/path', async (req, res) => { //ROUTE FOR SNAKE (RUNS SNAKERUNNER SCRIPT)
    try {
      const { start, end } = req.body;
  
      console.log('Backend received:', start, end);

      if (!start || !end) {
        return res.status(400).json({ error: "Start and end coordinates required" });
      }
  
      const route = runPathfinding(start, end);
      res.json({ route });
    } catch (err) {
      console.error("Pathfinding error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

module.exports = router;