import express from "express";
import bcrypt from "bcrypt";
// import { auth } from "../middleware/auth.js";
import { getUserByUsername, genPassword, createUser } from "../helper.js";

const router = express.Router();

//SignUp
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  //To set Email Pattern
//   if (
//     !/^[\w]{1,}[\w.+-]{0,}@[\w-]{2,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/g.test(
//       email
//     )
//   ) {
//     res.status(400).send({ error: "Invalid Email Pattern" });
//     return;
//   }
  const isUserExists = await getUserByUsername(username);
  if (isUserExists) {
    res.status(400).send({ error: "Username already exists" });
    return;
  }

  //To set Password pattern
  if (
    !/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/g.test(
      password
    )
  ) {
    res.status(400).send({ error: "Invalid Password Pattern" });
    return;
  }
  const hashedPassword = await genPassword(password);
  const create = await createUser(username, hashedPassword);
  res.send({ message: "Created Successfully" });
});

//Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const userFromDB = await getUserByUsername(username);
  if (!userFromDB) {
    res.status(400).send({ error: "Invalid Username or Password" });
    return;
  }

  const storedDBPassword = userFromDB.password;
  //To compare entered password and DB password are same
  const isPasswordMatch = await bcrypt.compare(password, storedDBPassword);
  if (!isPasswordMatch) {
    res.status(400).send({ error: "Invalid Username or Password" });
    return;
  }
  res.send({ message: "Login Successfully" });
});

export const usersRouter = router;
