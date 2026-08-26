const express = require("express");

const router = express.Router();

const {
  getCallScripts,
  getCallScript,
  createCallScript,
  updateCallScript,
  deleteCallScript,
  toggleCallScript,
} = require("../controllers/callScriptController");

router.get("/", getCallScripts);

router.get("/:id", getCallScript);

router.post("/", createCallScript);

router.put("/:id", updateCallScript);

router.delete("/:id", deleteCallScript);

router.patch("/:id/toggle", toggleCallScript);

module.exports = router;
