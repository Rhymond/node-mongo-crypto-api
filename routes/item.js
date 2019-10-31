const { handleError } = require("../utils/error");
const router = require("express").Router();
const itemHandler = require("./../handlers/item");

router.param("item", (req, res, next, id) => {
  req.id = id;
  return next();
});

router.post("/", async (req, res, next) => {
  try {
    return await itemHandler.post(req, res, next);
  } catch (e) {
    return handleError("error saving item", 500, next, e);
  }
});

router.get("/:item", (req, res, next) => {
  try {
    return itemHandler.get(req, res, next);
  } catch (e) {
    return handleError("error getting item", 500, next, e);
  }
});

module.exports = router;
