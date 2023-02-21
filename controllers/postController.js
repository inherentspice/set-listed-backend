const Post = require("../models/post");

exports.getFeed = async (req, res) => {
  try {
    const postFeed = await Post.find().sort({createdAt: -1});
    res.status(200).json({posts: postFeed});
  } catch (err) {
    console.log(err);
    next(err);
  }
}

exports.createPost = async (req, res) => {
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
    content: newPostInfo.content,
    likes: []
  });

  try {
    const newPost = await post.save();
    res.status(200).json({post: newPost});
  } catch (err) {
    console.log(err);
    next(err);
  }
}

exports.modifyPost = async (req, res) => {
  const postId = req.params.id;
  try{
    const post = await Post.findByIdAndUpdate(postId, { content: req.body.content }, { new: true });
    res.status(200).json({ post: post });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

exports.modifyPostLikes = async (req, res) => {
  const postId = req.params.id;
  const likeUser = req.body.user;
  try {
    const post = await Post.findById(postId);
    const likeSearch = post.likes.filter((user) => user.valueOf() !== likeUser);
    if (likeSearch.length === post.likes.length) {
      post.likes.push(likeUser);
      await post.save();
    } else {
      post.likes = likeSearch;
      await post.save();
    }
    res.status(200).json({post: post});
  } catch (err) {
    console.log(err);
    next(err);
  }
}

exports.deletePost = async (req, res) => {
  const postId = req.params.id;
  try {
    const PostId = req.params.id;
    await Post.findByIdAndDelete(PostId);
    return res.status(200).json({message: "successfully deleted!"});
  } catch (err) {
    console.log(err);
    next(err);
  }
}
