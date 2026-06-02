import Club from "../models/Club.js";

export const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find();
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createClub = async (req, res) => {
  try {
    const { clubName, description, category } = req.body;

    const club = await Club.create({
      clubName,
      description,
      category,
    });

    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};