const fetchUser = (req, res, next) => {
  try {
    let userId = req.headers.userid;

    if (!userId) {
      res.status(401).json({
        error:
          "Please authenticate yourself before performimg any CRUD operatioons.  ",
      });
    }

    req.user = userId;
    // console.log(`userId: ${userId}`); // Log userId value
    next();
  } catch (error) {
    return res.status(500).json({ success, error: "Internal server error." });
  }
};

module.exports = fetchUser;
