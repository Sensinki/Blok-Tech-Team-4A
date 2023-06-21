/* eslint-disable indent */
require("dotenv").config();
const app = require("./routes/routes");

const http = require("http").createServer(app);

const connectDatabase = require("./models/database");
connectDatabase();

const PORT = process.env.PORT || 3000;



http.listen(PORT, () => {
  console.log(`Server gestart op poort ${PORT}`);
});



async function run() {
  try {
    await connectDatabase();
  } catch (err) {
    console.log(err);
  } finally {
    // await client.close();
  }
}
