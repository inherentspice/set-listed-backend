const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).json({
    User: 'Ben'
  })
})

module.exports = router;
