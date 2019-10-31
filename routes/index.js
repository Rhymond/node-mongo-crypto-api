const router = require("express").Router();

router.use("/item", require("./item"));

module.exports = router;
