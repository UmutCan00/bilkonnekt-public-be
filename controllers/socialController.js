const SocialPost = require('../models/socialModels/SocialPost')
const Comment = require('../models/socialModels/Comment')


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
module.exports = {createSocialPost,getSocialPosts,getSingleSocialPost,createComment,
  getPostComments, updateComment
}