import app from "./app";
import config from './utils/env'

app.listen(config.PORT, () => {
  console.log(`Server jalan di ${config.HOST}${config.PORT}` );
  console.log("PW =", process.env.DATABASE_URL);

});