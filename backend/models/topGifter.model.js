const mongoose = require("mongoose");

const TopGifterSchema = new mongoose.Schema(
  {
    liveHistoryId: { type: mongoose.Schema.Types.ObjectId, ref: "LiveStreamerHistory", default: null },
    gifters: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        totalCoins: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("TopGifter", TopGifterSchema);
