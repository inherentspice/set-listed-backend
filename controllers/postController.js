const Post = require("../models/post");

exports.getFeed = (req, res) => {
  console.log("here");
}

exports.createPost = (req, res) => {
  if (!req.body) {
    return res.status(400).json({error: "Invalid request body"});
  }

  const newPostInfo = req.body;

  if (!newPostInfo.user) {
    return res.status(400).json({error: "User field is required"});
  }

  if (!newPostInfo.content) {
    return res.status(400).json({error: "Content field is required"});
  }

  const post = new Post({
    user: newPostInfo.user,
    content: newPostInfo.content
  });

  post.save((err) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.status(200).json({post: post});
  })
}

exports.modifyPost = (req, res) => {
  return
}

exports.deletePost = (req, res) => {
  return
}
