const express = require("express");
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middlewares/fetchUser");
const Note = require("../models/Note");

const router = express.Router();

// ROUTE: 1, fetch all notes from database.

router.get("/all", fetchUser, async (req, res) => {
  try {
    const userId = req.user;

    if (!userId) {
      res.status(401).json({
        error:
          "Please authenticate yourself before performimg any CRUD operatioons.  ",
      });
    }

    const notes = await Note.find({ userId: userId });

    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

// ROUTE: 2, create note in database.

router.post(
  "/add",
  [
    body("title", "title must be at least of 5 characters.").isLength({
      min: 5,
    }),
    body("content", "content must be at least of 10 characters.").isLength({
      min: 10,
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
      let noteData = {
        title: req.body.title,
        content: req.body.content,
        userId: req.user,
      };

      const newNote = await Note.create(noteData);
      success = true;

      res.status(200).json({ success, message: "Note saved successfully." });
    } catch (error) {
      res.status(500).json({ success, error: "Internal server error." });
    }
  }
);

// ROUTE: 3, update a  note in database.

router.put(
  "/update/:id",
  [
    body("pinned", "Value must be a boolean.").isBoolean(),
    body("deleted", "Value must be a boolean.").isBoolean(),
    body("archived", "Value must be a boolean.").isBoolean(),
  ],
  fetchUser,
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      const { pinned, deleted, archived } = req.body;
      const userId = req.user;

      if (!userId) {
        res.status(401).json({
          success,
          error:
            "Please authenticate yourself before performimg any CRUD operations.  ",
        });
      }

      const noteId = req.params.id;

      let note = await Note.findById(noteId);

      if (!note) {
        res.status(404).json({
          error: "Note not found ",
          success,
        });
      }

      if (userId !== note?.userId) {
        res.status(401).json({
          success,
          error: "You don not have the access to update it. ",
        });
      } else {
        const noteData = {
          pinned,
          deleted,
          archived,
        };

        note = await Note.findByIdAndUpdate(
          noteId,
          { $set: noteData },
          { new: true }
        );

        success = true;

        res.status(200).json({ success, note });
      }
    } catch (error) {
      res.status(500).json({ success, error: "Internal server error." });
    }

    // check userid
    // check existence of note
    // match the userId of note with  current userId
    // update the note
  }
);

// ROUTE: 4, delete all in the database.

router.delete("/delete", fetchUser, async (req, res) => {
  let success = false;

  try {
    const userId = req.user;

    if (!userId) {
      res.status(401).json({
        success,
        error:
          "Please authenticate yourself before performimg any CRUD operations.  ",
      });
    }

    await Note.deleteMany({ userId, deleted: true });
    success = true;

    res.status(200).json({ success, message: " Deleted successfully." });
  } catch (error) {
    res.status(500).json({ success, error: "Internal server error." });
  }
});

module.exports = router;

// ROUTE: 4, create note in database for a specific label.

router.post(
  "/add/:labelId",
  [
    body("title", "title must be at least of 5 characters.").isLength({
      min: 5,
    }),
    body("content", "content must be at least of 10 characters.").isLength({
      min: 10,
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
      let noteData = {
        title: req.body.title,
        content: req.body.content,
        userId: req.user,
        label: req.params.labelId,
      };

      const newNote = await Note.create(noteData);
      success = true;

      res
        .status(200)
        .json({ success, message: "Note saved successfully.", newNote });
    } catch (error) {
      res.status(500).json({ success, error: "Internal server error." });
    }
  }
);
