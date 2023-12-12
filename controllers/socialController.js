const SocialPost = require('../models/socialModels/SocialPost')


async function createSocialPost(req, res){
    const {title, content} = req.body;
    const user = req.user;
    const publisherId=user.id;
    const imageURL = "none deneme"
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
module.exports = {createSocialPost,getSocialPosts}