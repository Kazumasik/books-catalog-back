const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    // genres: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Genre",
    //   },
    // ],
    // comments: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Comment",
    //   },
    // ],
  },
);

module.exports = mongoose.model("Book", bookSchema);
