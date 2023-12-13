const SocialPost = require('../models/socialModels/SocialPost')


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
  const user = req.user;
  const publisherId=user.id;
  if( !postID || !publisherId) {
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
module.exports = {createSocialPost,getSocialPosts,getSingleSocialPost}