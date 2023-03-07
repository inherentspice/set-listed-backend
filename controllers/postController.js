const Post = require("../models/post");
const Comment = require("../models/comment");
const ProfileCard = require("../models/profile-card");
const Connection = require("../models/connection");

exports.getFeed = async (req, res) => {
  try {
    const userId = req.params.id;
    const userConnections = await Connection.findOne({ user: userId });

    if (userConnections.friends.length) {
      const friends = userConnections.friends;
      let postFeed = await Post.find({ user: { $in: friends } }).sort({createdAt: -1});
      if (!postFeed.length) {
        postFeed = await Post.find().sort({createdAt: -1});
        return res.status(200).json({posts: postFeed})
      }
      return res.status(200).json({posts: postFeed});
    } else {
      const postFeed = await Post.find().sort({createdAt: -1});
      return res.status(200).json({posts: postFeed})
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const postComments = await Comment
      .find({ post: postId })
      .populate({
        path: 'user',
        select: '-password -email',
        populate: { path: 'profileCard', select: 'image tagline' }
      })
      .exec();
    return res.status(200).json({comments: postComments});
  } catch (err) {
    console.log(err);
    next(err);
  }
};

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

exports.createComment = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({error: "Invalid request body"});
  }

  const newCommentInfo = req.body;

  if (!newCommentInfo.user) {
    return res.status(400).json({error: "User field is required"});
  }

  if (!newCommentInfo.content) {
    return res.status(400).json({error: "Content field is required"});
  }

  if (!newCommentInfo.post) {
    return res.status(400).json({error: "Post id is required"});
  }

  const comment = new Comment({
    user: newCommentInfo.user,
    content: newCommentInfo.content,
    post: newCommentInfo.post,
    likes: []
  });

  try {
    const newComment = await comment.save();
    const populatedComment = await Comment
    .findById(newComment.id)
    .populate('user', '-password -email')
    .populate('user.profileCard', 'image tagline');
    res.status(200).json({ comment: populatedComment });
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

exports.modifyComment = async (req, res) => {
  const commentId = req.params.id;
  try{
    const comment = await Comment.findByIdAndUpdate(commentId, { content: req.body.content }, { new: true });
    res.status(200).json({ comment: comment });
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
      await ProfileCard.findOneAndUpdate({user: post.user}, {$inc: {userPostImpressions: 1}});
      await post.save();
    } else {
      post.likes = likeSearch;
      await ProfileCard.findOneAndUpdate({user: post.user}, {$inc: {userPostImpressions: -1}});
      await post.save();
    }
    res.status(200).json({post: "post likes changes successfully"});
  } catch (err) {
    console.log(err);
    next(err);
  }
}

exports.modifyCommentLikes = async (req, res) => {
  const commentId = req.params.id;
  const likeUser = req.body.user;
  try {
    const comment = await Comment.findById(commentId);
    const likeSearch = comment.likes.filter((user) => user.valueOf() !== likeUser);
    if (likeSearch.length === comment.likes.length) {
      comment.likes.push(likeUser);
      await ProfileCard.findOneAndUpdate({user: comment.user}, {$inc: {userPostImpressions: 1}});
      await comment.save();
    } else {
      comment.likes = likeSearch;
      await ProfileCard.findOneAndUpdate({user: comment.user}, {$inc: {userPostImpressions: -1}});
      await comment.save();
    }
    res.status(200).json({comment: "comment likes changed successfully"});
  } catch (err) {
    console.log(err);
    next(err);
  }
}

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await Post.findByIdAndDelete(postId);
    return res.status(200).json({message: "successfully deleted!"});
  } catch (err) {
    console.log(err);
    next(err);
  }
}

exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json({message: "successfully deleted!"});
  } catch (err) {
    console.log(err);
    next(err);
  }
}
