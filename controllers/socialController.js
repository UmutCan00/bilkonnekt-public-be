const SocialPost = require('../models/socialModels/SocialPost')
const Comment = require('../models/socialModels/Comment')
const Like = require('../models/socialModels/Like')
const ClubPost = require('../models/socialModels/ClubPost')


async function createSocialPost(req, res){
    const {title, content, imageURL} = req.body;
    console.log("imageURL: ", imageURL)
    const user = req.user;
    const publisherId=user.id;
    if( !title || !content || !imageURL || !publisherId) {
        return res.status(422).json({'message': 'Invalid fields'})
    }

    try {
        await SocialPost.create({title, content, imageURL, publisherId})
        return res.status(201).json({message: "Succesfully created new social post, basarili"})
      } catch (error) {
        return res.status(400).json({message: "Could not create new social post, basarisiz"})
      }
}

async function getSocialPosts(req, res){
    try {
      results= await SocialPost.find().sort({ date: -1 });
      console.log(results);
      return res.status(201).json(results)
    } catch (error) {
      console.log("basarisiz");
      return res.status(400).json({message: "Could not get product items"})
    }
}

async function getSingleSocialPost(req, res){
  const {postID} = req.body;
  //const user = req.user;
  //const publisherId=user.id;
  if( !postID ) {
      return res.status(422).json({'message': 'Invalid fields'})
  }
  try {
    results= await SocialPost.findOne({_id:postID});
    console.log(results);
    return res.status(201).json(results)
  } catch (error) {
    return res.status(400).json({message: "Could not create new social post, basarisiz"})
  }
}

async function createComment(req, res){
  const {postId, description} = req.body;
  const user = req.user;
  const commenterId=user.id;
  const commenterName = user.username;
  if( !postId || !description || !commenterId || !commenterName) {
      return res.status(422).json({'message': 'Invalid fields'})
  }

  try {
    await Comment.create({postId, commenterId, commenterName, description})
    return res.status(201).json({message: "Succesfully created new social comment, basarili"})
  } catch (error) {
    return res.status(400).json({message: "Could not create new social comment, basarisiz"})
  }
}

async function getPostComments(req, res){
  const {postId} = req.body;
  if( !postId ) {
      return res.status(422).json({'message': 'Invalid fields'})
  }
  try {
    results= await Comment.find({postId:postId}).sort({ date: -1 });
    console.log(results);
    return res.status(201).json(results)
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: "Could not create new social comment, basarisiz"})
  }
}

async function updateComment(req, res){
  const {commentId, description} = req.body;
  const userId = req.user.id;
  if( !commentId || !description || !userId) {
      return res.status(422).json({'message': 'Invalid fields'})
  }
  try {
    results= await Comment.findOne({_id:commentId});
    if(results.commenterId != userId){
      return res.status(423).json({'message': 'Not comment owner fields'})
    }
    await Comment.findOneAndUpdate(
      { _id: commentId},
      { $set: { description: description } }
    );
    return res.status(201).json({message: "Update comment basarili"})
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: "Could not create new social comment, basarisiz"})
  }
}

async function likePost(req,res){
  const {postId} = req.body;
  const userId = req.user.id;
  if( !postId || !userId) {
      return res.status(422).json({'message': 'Invalid fields'})
  }
  try {
    const currentPost= await SocialPost.findOne({_id:postId});
    if(!currentPost){
      return res.status(404).json({'message': 'Post not found'})
    }
    const isCreated= await Like.findOne({postId:postId, userId:userId});
    if(!isCreated){
      await Like.create({postId, userId});
      
      currentPost.likeCount = currentPost.likeCount + 1;
      await currentPost.save();
      return res.status(200).json({message: "Like created"})
    }else{
      if(isCreated.isActive){
        await Like.findOneAndUpdate(
          { _id: isCreated.id},
          { $set: { isActive: false } }
        );
        currentPost.likeCount = currentPost.likeCount - 1;
        await currentPost.save();
        return res.status(200).json({message: "Like deactivated"})
      }else{
        await Like.findOneAndUpdate(
          { _id: isCreated.id},
          { $set: { isActive: true } }
        );
        currentPost.likeCount = currentPost.likeCount + 1;
        await currentPost.save();
        return res.status(200).json({message: "Like activated"})
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: "Could not like the post, basarisiz"})
  }
}

async function createClubPost(req, res){
  const {title, content, imageURL, clubId} = req.body;
  console.log("imageURL: ", imageURL)
  const user = req.user;
  const publisherId=user.id;
  if( !title || !content || !imageURL || !publisherId || !clubId) {
      return res.status(422).json({'message': 'Invalid fields'})
  }

  try {
      await ClubPost.create({title, content, imageURL, publisherId, clubId})
      return res.status(201).json({message: "Succesfully created new club post, basarili"})
    } catch (error) {
      return res.status(400).json({message: "Could not create new club post, basarisiz"})
    }
}

module.exports = {createSocialPost,getSocialPosts,getSingleSocialPost,createComment,
  getPostComments, updateComment, likePost, createClubPost
}