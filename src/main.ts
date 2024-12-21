import dotenv from "dotenv";
import serverPromise from "./server";

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".test.env" });
} else {
  dotenv.config();
}

const PORT = process.env.PORT;

serverPromise.then((app) => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
