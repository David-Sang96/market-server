const { Router } = require("express");
const router = Router();
const authMiddleware = require("../middlewares/auth");
const notificationController = require("../controllers/notification.controller");

// push notification
// POST /notify
router.post("/notify", authMiddleware, notificationController.pushNotification);

// get notifications
// GET /notifications
router.get(
  "/notifications",
  authMiddleware,
  notificationController.getAllNotifications
);

// update isRead true
// POST /notifications-read/:id
router.post(
  "/notifications-read/:id",
  authMiddleware,
  notificationController.markAsRead
);

// update isRead false
// DELETE /notifications-unread/:id
router.post(
  "/notifications-unread/:id",
  authMiddleware,
  notificationController.markAsUnRead
);

// update isRead false
// DELETE/ notifications-delete/:id
router.delete(
  "/notifications-delete/:id",
  authMiddleware,
  notificationController.deleteSingleNotification
);

// update isRead false
// POST /notifications-delete-all/:id
router.delete(
  "/notifications-delete-all",
  authMiddleware,
  notificationController.deleteAllNotification
);

module.exports = router;
