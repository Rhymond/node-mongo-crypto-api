module.exports.handleError = (msg, status, next, e) => {
  if (e) {
    console.log(e.stack);
  }

  const err = new Error(msg);
  err.status = status;
  return next(err);
};
