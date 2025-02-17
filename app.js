import { join } from "node:path";
import express from "express";
import session from "express-session";
import cookie from "cookie-parser";

const app = express();
const port = process.env.PORT || 3030;
const init = () => console.log(`ready on http://localhost:${port}`);

app.set("view engine", "ejs");
app.set("views", join(process.cwd(), "views"));

app.use(
  session({
    secret: "contact_proyect",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(cookie());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(process.cwd(), "public")));

import user from "./middlewares/user.js";
app.use(user);

import userRouter from "./routes/users.js";
app.use("/users", userRouter);
import categoryRouter from "./routes/category.js";
app.use("/categories", categoryRouter);

app.get("/", (req, res) => res.render("auth/login"));
app.post("/access", (req, res) =>
  res.status(202).send(JSON.stringify(req.body, null, 2))
);

app.listen(port, init);
