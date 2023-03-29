const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const secret_key = "hppavilionx360";

const router = express.Router();

// ROUTE: 1, create a new user in the  database.

router.post(
  "/create",
  [
    // body("userId", "userId must be atleast of 6 characters.").isLength({
    //   min: 6,
    // }),
    body("name", "name must be at least 5 characters.").isLength({ min: 5 }),
    body("email", "Please provide a valid email.").isEmail(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      // check weather email exists or not in the database

      let user = await User.findOne({ email: req.body.email });

      if (user) {
        // if found, save user in database.

        return res
          .status(400)
          .json({ success, error: "Please provide valid information." });
      } else {
        // if not found send bad request error.
        const userData = {
          userId: req?.body?.userId,
          name: req?.body?.name,
          email: req?.body?.email,
        };
        user = await User.create(userData);

        const data = {
          user: {
            id: user?._id,
          },
        };

        let token = jwt.sign(data, secret_key);

        success = true;

        res
          .status(200)
          .json({ success, message: "User saved successfully.", token });
      }
    } catch (error) {
      return res.status(500).json({ success, error: "Internal server error." });
    }
  }
);

module.exports = router;
