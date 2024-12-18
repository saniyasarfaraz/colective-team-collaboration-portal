const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Create User without Course (First Page)
router.post("/signup-step1", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create user without course
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update User Course (Second Page)
router.put("/signup-step2", async (req, res) => {
  const { email, course, branch, year } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.course = course;
    user.branch = branch;
    user.year = year;
    await user.save();

    res.status(200).json({ message: "Details updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/signup-step3", async (req, res) => {
  const { email, skills } = req.body; // Include email and skills in the request body

  try {
    // Validate request
    if (!email || !skills || !Array.isArray(skills)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update skills
    user.skills = skills;
    await user.save();

    res
      .status(200)
      .json({ message: "Skills updated successfully", skills: user.skills });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
