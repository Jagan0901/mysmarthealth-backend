import { client } from "./index.js";
import bcrypt from "bcrypt";

export async function getUserByUsername(username) {
  return await client
    .db("mysmarthealth")
    .collection("users")
    .findOne({ username: username });
}

export async function genPassword(password) {
  const salt = await bcrypt.genSalt(10);
  //   console.log(salt);
  const hashedPassword = await bcrypt.hash(password, salt);
  //   console.log(hashedPassword);
  return hashedPassword;
}

export async function createUser(username, hashedPassword) {
  return await client
    .db("mysmarthealth")
    .collection("users")
    .insertOne({ username: username, password: hashedPassword });
}
