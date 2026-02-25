"use strict";

const express = require("express");
const router = new express.Router();

const Job = require("../models/job");

// GET /jobs?title=...&minSalary=...&hasEquity=...
// For now: just list all jobs (and optionally allow title search)
router.get("/", async function (req, res, next) {
  try {
    // simplest version: just return all jobs
    const jobs = await Job.findAll(req.query);
    return res.json({ jobs });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;