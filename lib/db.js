import mongoose from "mongoose";

const CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

const connect = async () => {
  const connectionState = mongoose.connection.readyState;
  if (connectionState === 1) {
    console.log("Already Connected");
    return;
  }
  if (connectionState === 2) {
    console.log("Connecting....");
    return;
  }
  try {
    mongoose.connect(CONNECTION_STRING, {
      dbName: "next14restapi",
      bufferCommands: true,
    });
    console.log("Connected");
  } catch (error) {
    console.log("Error: ", error);
    throw new Error("Error: ", error);
  }
};

export default connect;
