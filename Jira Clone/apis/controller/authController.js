const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const pool = require("../config/db");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Invalid password or email",
      });
    }
    console.log(email, password);
    const result = await pool.query(
      "select id,email,password_hash,full_name from users where email=$1",
      [email],
    );
    console.log(result);
    const decryptPassword = await bcrypt.compare(
      password,
      result.rows[0].password_hash,
    );
    if (
      result.rowCount > 0 &&
      result.rows[0].email === email &&
      decryptPassword
    ) {
      const { id, email: userEmail, full_name } = result.rows[0];
      const token = jwt.sign(
        { userId: id, username: full_name, useremail: userEmail },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN },
      );
      return res.status(200).json({
        success: true,
        token,
        message: "Login Successful",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }
  } catch (error) {
    if (error) {
      res.status(500).json({
        success: false,
        message: "Internal server errorr",
      });
    }
  }
};

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email} = ticket.payload;

    const result = await pool.query(
      "select id, full_name,email from users where email = $1",
      [email],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { id, full_name, email: userEmail } = result.rows[0]; // ✅

    const token = jwt.sign(
      { userId: id, username: full_name, useremail: userEmail },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      token: token,
    });
  } catch (error) {
    res.status(401).json({ message: "Google authentication failed" });
  }
};

module.exports = { login, googleLogin };
