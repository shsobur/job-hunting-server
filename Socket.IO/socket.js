import { Server } from "socket.io";

// Store temporary online users__
const onlineUsers = new Map();

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://job-hunting-d689c.web.app",
        "https://job-hunting-d689c.firebaseapp.com",
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔗 New connection:", socket.id);

    // Join user__
    socket.on("user-join", (userData) => {
      console.log(`👤 ${userData.role} joined: ${userData.username}`);

      // Stor user in memory__
      onlineUsers.set(userData.email, {
        ...userData,
        role: userData.role.toLowerCase(),
        socketId: socket.id,
        joinedAt: new Date(),
      });

      // If admin send use list__
      if (userData.role === "admin") {
        const userList = Array.from(onlineUsers.values()).filter(
          (u) => u.role !== "admin"
        );
        socket.emit("online-users", userList);
      }
    });

    // Private message__
    socket.on("private-message", async (data) => {
      const { toEmail, message, senderData } = data;

      // Find receiver__
      const receiver = onlineUsers.get(toEmail);

      if (!receiver) {
        socket.emit("error", { message: "User is offline", toEmail });
        return;
      }

      const messageObj = {
        from: senderData,
        to: receiver,
        message: message,
        timestamp: new Date().toISOString(),
      };

      // Send message__
      socket.to(receiver.socketId).emit("new-message", messageObj);

      // Send confirmation__
      socket.emit("message-sent", messageObj);

      console.log(`💬 ${senderData.email} → ${receiver.email}: ${message}`);
    });

    // Disconnect__
    socket.on("disconnect", () => {
      for (const [email, user] of onlineUsers.entries()) {
        if (user.socketId === socket.id) {
          console.log(`❌ ${user.email} disconnected`);
          onlineUsers.delete(email);
          break;
        }
      }
    });
  });

  console.log("✅ Socket.IO server initialized");
  return io;
};

export default initializeSocket;
