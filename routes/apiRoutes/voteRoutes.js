const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

router.get('/votes', (req, res) => {
    const sql = `SELECT * FROM votes GROUP BY candidate_id`;
    const params = [];
  
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: rows
      });
    });
  });


router.post('/votes', ({body}, res) => {
    // Data validation 
    const errors = inputCheck(body, 'voter_id', 'candidate_id');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
  
    // Prepare statement
    const sql = `INSERT INTO votes (voter_id, candidate_id) VALUES (?, ?)`;
    const params = [body.voter_id, body.candidate_id];
  
    // Execute
    db.run(sql, params, function(err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: body,
        id: this.lastID
      });
    });
  });

  module.exports = router;
