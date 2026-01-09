import mongoose from "mongoose";
import notificationSchema from "../models/notificationSchema";

interface NotificationInput {
  userId: string;
  type: string;
  message: string;
  session?: mongoose.ClientSession;
}

export const createNotification = async ({
  userId,
  type,
  message,
  session
}: NotificationInput) => {
  await notificationSchema.create(
    [
      { userId, type, message }
    ],
    session ? { session } : {}
  );
};