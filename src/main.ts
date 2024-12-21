import dotenv from "dotenv";
import serverPromise from "./server";

dotenv.config();

const PORT = process.env.PORT;

serverPromise.then((app) => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
