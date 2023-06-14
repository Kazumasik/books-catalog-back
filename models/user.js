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
  level: {
    type: Number,
    default: 1,
  },
  experience: {
    type: Number,
    default: 0,
  },
  nextLevelExperience: {
    type: Number,
    default: 100, 
  },
});

userSchema.methods.updateExperience = async function (experiencePoints) {
  this.experience += experiencePoints;
  await this.save();
};

userSchema.methods.updateLevel = async function () {
  const maxLevel = 3; // Максимальное количество уровней
  const experiencePerLevel = 100; // Количество опыта для первого уровня
  const levelMultiplier = 1.25; // Множитель для следующего уровня

  let requiredExperience = experiencePerLevel;
  for (let i = 2; i <= this.level && i <= maxLevel; i++) {
    requiredExperience *= levelMultiplier;
  }

  if (this.experience >= requiredExperience && this.level < maxLevel) {
    this.level += 1;
    this.nextLevelExperience = requiredExperience * levelMultiplier;
    await this.save();
  }
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
