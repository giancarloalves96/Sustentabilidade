const restify = require("restify");
const mongoose = require("mongoose");
const config = require("./config");

const server = restify.createServer();

// Middleware
server.use(restify.plugins.bodyParser());

server.listen(config.PORT, () => {
  mongoose.connect(
    config.MONGODB_URI,
    { useNewUrlParser: true }
  );
});

// CORS
server.use(function crossOrigin(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  return next();
});

const db = mongoose.connection;

db.on("error", err => console.log(err));

db.once("open", () => {
  require("./routes/areas")(server);
  require("./routes/machines")(server);
  console.log(`Server started on port ${config.PORT}`);
});
