const crypto = require("../utils/crypto");
const Item = require("../models/item");
const { handleError } = require("../utils/error");

module.exports.post = async (req, res, next) => {
  const { id, encryption_key, value } = req.body;
  if (!(id && encryption_key && value)) {
    return handleError(
      "required parameters are not set (id, encryption_key, value)",
      400,
      next
    );
  }

  const hash = crypto.hash(encryption_key);
  const item = new Item({
    _id: id,
    encryption_key: hash,
    value: crypto.encrypt(hash, String(value))
  });

  try {
    await item.save();
  } catch (e) {
    if (e.code === 11000) {
      return handleError("item with this ID is already saved", 409, next, e);
    }
    return handleError("unable to save item", 500, next, e);
  }

  res.status(200);
  res.json({
    _id: item._id
  });
  return next();
};

module.exports.get = async (req, res, next) => {
  if (!req.query.key) {
    return handleError("decryption key is not set", 400, next);
  }

  const items = await Item.find({
    _id: { $regex: req.id, $options: "i" },
    encryption_key: crypto.hash(req.query.key)
  });

  res.status(200);
  res.json({
    items: items.map(item => ({
      _id: item._id,
      value: crypto.decrypt(item.encryption_key, item.value)
    }))
  });
  return next();
};
