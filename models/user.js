const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  nickname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  bookmarks: {
    reading: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    end_read: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    will_read: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
