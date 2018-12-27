const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    // send index.html (created by 'ng build') to start client side
    res.sendFile("index.html", { root: path.join(__dirname, '../../public') });
});

module.exports = router;