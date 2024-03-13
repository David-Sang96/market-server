const Notification = require("../models/Notification");

exports.pushNotification = async (req, res) => {
  try {
    const { title, message, owner_id, product_id, phone_number } = req.body;
    await Notification.create({
      title,
      message,
      product_id,
      owner_id,
      phone_number,
    });
    return res.status(201).json({
      isSuccess: true,
      message: "Notification is pushed.",
    });
  } catch (error) {
    return (
      res.status(500),
      json({
        isSuccess: false,
        message: error.message,
      })
    );
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const notificationDocs = await Notification.find({
      owner_id: req.userId,
    }).sort({ createdAt: -1 });

    if (!notificationDocs || notificationDocs.length === 0) {
      throw new Error("No notifications yet.");
    }

    return res.status(200).json({
      isSuccess: true,
      notificationDocs,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notiDoc = await Notification.findById(id);

    if (req.userId.toString() !== notiDoc.owner_id.toString()) {
      throw new Error("Authorization Failed.");
    }

    if (!notiDoc) throw new Error("notification not found.");
    notiDoc.isRead = true;
    notiDoc.save();

    return res.status(200).json({
      isSuccess: true,
      message: "marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.markAsUnRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notiDoc = await Notification.findById(id);

    if (req.userId.toString() !== notiDoc.owner_id.toString()) {
      throw new Error("Authorization Failed.");
    }

    if (!notiDoc) throw new Error("notification not found.");
    notiDoc.isRead = false;
    notiDoc.save();

    return res.status(200).json({
      isSuccess: true,
      message: "marked as unread",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.deleteSingleNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notiDoc = await Notification.findById(id);

    if (req.userId.toString() !== notiDoc.owner_id.toString()) {
      throw new Error("Authorization Failed.");
    }

    await Notification.findByIdAndDelete(id);
    return res.status(200).json({
      isSuccess: true,
      message: " Deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.deleteAllNotification = async (req, res) => {
  try {
    await Notification.deleteMany({ owner_id: req.userId });
    return res.status(200).json({
      isSuccess: true,
      message: " Deleted all successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
