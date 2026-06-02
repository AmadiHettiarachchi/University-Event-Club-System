import Announcement from "../models/Announcement.js";

export const createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create(req.body);

    res.status(201).json({
      message: "Announcement created successfully",
      announcement,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnnouncementsByClub = async (req, res) => {
  try {
    const { club } = req.params;

    const announcements = await Announcement.find({ club }).sort({
      createdAt: -1,
    });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};