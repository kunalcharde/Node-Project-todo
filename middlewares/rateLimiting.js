const accessModel = require("../Models/accessModel");

const Ratelimiting = async (req, res, next) => {
  const sessionId = req.session.id;
  console.log(sessionId);
  //rate limiting logic

  //check if the person is making the request for the first time
  const accessDb = await accessModel.findOne({ sessionId: sessionId });
  console.log(accessDb);
  if (!accessDb) {
    //create a new entry in access collection
    const accessObj = new accessModel({
      sessionId: sessionId,
      time: Date.now(),
    });
    await accessObj.save();
    next();
    return;
  }

  //if accessDb was there, then compare the time
  //   console.log(accessDb.time);
  //   console.log(Date.now());
  
  const diff = (Date.now() - accessDb.time) / 1000;
  console.log(diff);

  if (diff < 1) {
    return res.send({
      status: 400,
      message: "Too many request, please wait for some time",
    });
  }

  try {
    await accessModel.findOneAndUpdate({ sessionId }, { time: Date.now() });
    next();
  } catch (error) {
    return res.send({
      status: 500,
      message: "database error",
    });
  }
};

module.exports = Ratelimiting;
