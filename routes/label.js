const express = require("express");
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middlewares/fetchUser");
const Label = require("../models/Label");

const router = express.Router();

// ROUTE: 1, fetch all the labels from database by userId.

router.get("/all", fetchUser, async (req, res) => {
  try {
    const userId = req.user;

    if (!userId) {
      res.status(401).json({
        error:
          "Please authenticate yourself before performimg any CRUD operatioons.  ",
      });
    }

    const labels = await Label.find({ userId });

    res.status(200).json({ labels });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

// ROUTE: 2, create a label in the database.

router.post(
  "/add",
  [
    body("name", "label name must be at least of 3 characters.").isLength({
      min: 3,
    }),
  ],
  fetchUser,
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      let labelData = {
        name: req.body.name,
        userId: req.user,
      };

      const newlabel = await Label.create(labelData);
      success = true;

      res
        .status(200)
        .json({ success, message: "label saved successfully.", newlabel });
    } catch (error) {
      res.status(500).json({ success, error: "Internal server error." });
    }
  }
);

// ROUTE: 3, update a  label in database.

router.put(
  "/update/:id",
  [
    body("name", "label name must be at least of 3 characters.").isLength({
      min: 3,
    }),
  ],
  fetchUser,
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      const { name } = req.body;
      const userId = req.user;

      if (!userId) {
        res.status(401).json({
          success,
          error:
            "Please authenticate yourself before performimg any CRUD operations.  ",
        });
      }

      const labelId = req.params.id;

      let label = await Label.findById(labelId);

      if (!label) {
        res.status(404).json({
          error: "label not found ",
          success,
        });
      }

      if (userId !== label?.userId) {
        res.status(401).json({
          success,
          error: "You don not have the access to update it. ",
        });
      } else {
        const labelData = {
          name,
        };

        label = await Label.findByIdAndUpdate(
          labelId,
          { $set: labelData },
          { new: true }
        );

        success = true;

        res
          .status(200)
          .json({ success, message: "Label updated successfully." });
      }
    } catch (error) {
      res.status(500).json({ success, error: "Internal server error." });
    }
  }
);

// ROUTE: 4, delete a  label from database.

router.delete("/delete/:id", fetchUser, async (req, res) => {
  let success = false;

  try {
    const userId = req.user;
    const labelId = req.params.id;

    if (!userId) {
      res.status(401).json({
        success,
        error:
          "Please authenticate yourself before performimg any CRUD operations.  ",
      });
    }

    let label = await Label.findById(labelId);

    if (!label) {
      res.status(404).json({
        error: "label not found ",
        success,
      });
    }

    if (label?.userId !== userId) {
      res.status(401).json({
        success,
        error: "You don not have the access to update it. ",
      });
    } else {
      await Label.findByIdAndDelete(labelId);
      success = true;
    }

    res.status(200).json({ success, message: " Deleted successfully." });
  } catch (error) {
    res.status(500).json({ success, error: "Internal server error." });
  }
});

module.exports = router;
