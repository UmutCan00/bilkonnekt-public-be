const SocialPost = require('../models/socialModels/SocialPost')
const Comment = require('../models/socialModels/Comment')
const Like = require('../models/socialModels/Like')
const ClubPost = require('../models/socialModels/ClubPost')
const Club = require('../models/socialModels/Club')
const Follower = require('../models/socialModels/Follower')
const nodemailer = require('nodemailer');
const User = require('../models/User');

async function createSocialPost(req, res){
    const {title, content, imageURL, isAnonymous} = req.body;
    console.log("imageURL: ", imageURL)
    console.log("anonymous: ", isAnonymous)
    const user = req.user;
    const publisherId=user.id;
    let publisherName = user.username;
    if(isAnonymous){
      publisherName = "Anonymous";
    }
    if( !title || !content || !imageURL || !publisherId|| !publisherName) {
        return res.status(422).json({'message': 'Invalid fields'})
    }

    try {
        await SocialPost.create({title, content, imageURL, publisherId, publisherName})
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

async function updatePost(req, res){
  const {postId, header, description} = req.body;
  const userId = req.user.id;
  if( !postId || !header || !userId ||!description) {
      return res.status(422).json({'message': 'Invalid fields'})
  }
  try {
    results= await SocialPost.findOne({_id:postId});
    if(results.publisherId != userId){
      return res.status(423).json({'message': 'Not post owner fields'})
    }
    await SocialPost.findOneAndUpdate(
      { _id: postId},
      { $set: { content: description,title: header} }
    );
    return res.status(201).json({message: "Update Post basarili"})
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: "Could not update post, basarisiz"})
  }
}

async function deletePost(req, res){
  const {postId} = req.body;
  const user = req.user;
  const userId = req.user.id;
  if( !postId || !userId ) {
      return res.status(422).json({'message': 'Invalid fields'})
  }
  try {
    results= await SocialPost.findOne({_id:postId});
    if (!results) {
      return res.status(404).json({ 'message': 'Post not found' });
    }
    if((results.publisherId != userId)&&(user.role != "Admin")){
      return res.status(423).json({'message': 'Not post owner fields'})
    }
    await SocialPost.findOneAndRemove({ _id: postId });
    return res.status(201).json({message: "Delete Post basarili"})
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: "Could not delete post, basarisiz"})
  }
}
async function createComment(req, res){
  const {postId, description, isAnonymous} = req.body;
  const user = req.user;
  const commenterId=user.id;
  let commenterName = user.username;
  if(isAnonymous){
    commenterName = "Anonymous";
  }
  console.log("commentAnon: ",commenterName);
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

async function deleteComment(req, res){
  const {commentId} = req.body;
  const userId = req.user.id;
  if( !commentId || !userId) {
      return res.status(422).json({'message': 'Invalid fields'})
  }
  try {
    results= await Comment.findOne({_id:commentId});
    if(!results){
      return res.status(404).json({'message': 'Not comment found'})
    }
    if(results.commenterId != userId){
      return res.status(423).json({'message': 'Not comment owner fields'})
    }
    await Comment.findOneAndRemove({ _id: commentId});
    return res.status(201).json({message: "delete comment basarili"})
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: "Could not delete new social comment, basarisiz"})
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
  const {title, clubId,content, imageURL,location,date,hour,points} = req.body;
  console.log("imageURL: ", imageURL)
  const user = req.user;
  const publisherId=user.id;
  if( !title || !content || !imageURL || !publisherId || !clubId||!location||!date||!hour ||!points ) {
      console.log(title ,",",content,"," ,imageURL,"," ,publisherId,"," ,clubId,",",location,",",date,",",hour,",", points)
      return res.status(422).json({'message': 'Invalid fields'})
  }
  try {
    console.log(title ,",",content,"," ,imageURL,"," ,publisherId,"," ,clubId,",",location,",",date,",",hour,",", points)
      await ClubPost.create({title, content, imageURL, publisherId, clubId,location,eventDate:date,eventhour:hour,points})
      const followers = await Follower.find({clubId: clubId});
      const studentIds = followers.map((follower) => follower.studentId);

      const userEmails = await Promise.all(studentIds.map(async (studentId) => {
        const user = await User.findOne({ _id: studentId });
        return user ? user.email : null;
      }));

      const mailerClub = await Club.findOne({_id:clubId});
      await sendEmails(userEmails, title, mailerClub.name);
      

      console.log("User Emails:", userEmails);

      return res.status(201).json({message: "Succesfully created new club post, basarili"})
    } catch (error) {
      console.log(error)
      return res.status(400).json({message: "Could not create new club post, basarisiz"})
    }
}

async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: 'hotmail', 
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    pool: true,
    maxConnections: 10,
  });

  const mailOptions = {
    from: 'bilkent.forum.project@hotmail.com',
    to,
    subject,
    text,
  };

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await transporter.sendMail(mailOptions);
    console.log('E-posta gönderildi.');
  } catch (error) {
    console.error('E-posta gönderilirken hata oluştu:', error);
  }
}

const MAX_CONCURRENT_EMAILS = 10;

async function sendEmails(emailAddresses, title, clubName) {
  const transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    service: 'hotmail',
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    pool: true,
    maxConnections: MAX_CONCURRENT_EMAILS,
  }); 
  const mailSubject = (clubName+ ' Club Event');
  const mailText = ('You are invited to join ' + title); 
  let mailOptions = { from: 'bilkent.forum.project@hotmail.com', 
    to: emailAddresses, 
    subject: mailSubject, 
    text: mailText};

    transporter.sendMail(mailOptions, function(error, info){ 
    if (error) {
      console.log(error); 
    }else{ 
      console.log('Email sent: ' + info.response); 
    } 
  });

  await Promise.all(emailPromises);
}
async function createClub(req, res){
  let {name, imageURL, executiveId, description} = req.body;
  console.log("imageURL: ", imageURL)
  const user = req.user;
  if(!imageURL || imageURL ==undefined){
    imageURL ="https://firebasestorage.googleapis.com/v0/b/bilkonnekt-ef5da.appspot.com/o/images%2Fpppng.png1c618d29-fbbe-4ace-bfc7-f6b7ad7e0909?alt=media&token=6e649dcb-0451-46d9-96a1-61931df93f94" 
  } 
  if( !name || !imageURL || !executiveId || !description) {
      return res.status(422).json({'message': 'Invalid fields'})
  }

  try {
      const currentClub = await Club.create({name, executiveId, imageURL, description})
      await Follower.create({studentId:executiveId,clubId:currentClub.id, role:"leader"})
      return res.status(201).json({message: "Succesfully created new club, basarili"})
    } catch (error) {
      console.log( "error: ", error)
      return res.status(400).json({message: "Could not create new club, basarisiz"})
    }
}

async function followClub(req,res){
  const {clubId} = req.body;
  const userId = req.user.id;
  
  if( !userId || !clubId) {
      return res.status(422).json({'message': 'Invalid fields'})
  }

  try {
      const isAlreadyFollows = await Follower.findOne({studentId:userId,clubId:clubId})
      if(isAlreadyFollows){
        return res.status(403).json({'message': 'you already follow the club'})
      }
      await Follower.create({studentId:userId,clubId:clubId})
      return res.status(201).json({message: "Succesfully created new club follower, basarili"})
  } catch (error) {
      return res.status(400).json({message: "Could not create new club follower, basarisiz"})
  }
}

async function getClubs(req,res){
  try {
    const allClubs = await Club.find({})
    return res.status(201).json(allClubs)
  } catch (error) {
    return res.status(400).json({message: "Could not fetch all clubs follower, basarisiz"})
  }
}


async function getClub(req,res){
  const {clubId} = req.body;
  const userId = req.user.id;
  if(!clubId){
    return res.status(422).json({'message': 'Invalid fields'})
  }
  try {
    const currentClub = await Club.findOne({_id: clubId})
    console.log(currentClub);
    if(!currentClub){
      return res.status(404).json({'message': 'Club not found'})
    }
    return res.status(201).json(currentClub)
  } catch (error) {
    return res.status(400).json({message: "Could not fetch all clubs follower, basarisiz"})
  }
}

async function getLikedPostsOfUser(req,res){
  const userId = req.user.id;
  if(!userId){
    return res.status(422).json({'message': 'not authorized'})
  }
  try {
    const likesOfUser = await Like.find({userId:userId, isActive:true})
    return res.status(201).json(likesOfUser);
  } catch (error) {
    console.log(error)
    return res.status(400).json({message: "Could not fetch all likes of user, basarisiz"})
  }
}

async function updateClub(req,res){
  const {clubId, description} = req.body;
  if(!clubId||!description){
    return res.status(422).json({'message': 'Invalid fields'})
  }
  try {
    const currentClub = await Club.findOne({_id: clubId})
    console.log(currentClub);
    if(!currentClub){
      return res.status(404).json({'message': 'Club not found'})
    }
    await Club.findOneAndUpdate(
      { _id: clubId},
      { $set: { description: description} }
    );
    return res.status(201).json({message: "update club, basarili"})
  } catch (error) {
    return res.status(400).json({message: "update club, basarisiz"})
  }
}

async function getClubPostByClub(req,res){
  const {clubId} = req.body;
  if(!clubId){
    return res.status(422).json({'message': 'Invalid fields'})
  }
  try {
    const allClubPosts = await ClubPost.find({clubId:clubId})
    return res.status(201).json(allClubPosts)
  } catch (error) {
    return res.status(400).json({message: "Could not fetch all clubs follower, basarisiz"})
  }
}

async function getEventsToday(req,res){
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set time to midnight UTC

    const allClubPostsToday = await ClubPost.find({
      eventDate: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    });

    return res.status(201).json(allClubPostsToday);
  } catch (error) {
    return res.status(400).json({ message: "Could not fetch all clubs follower, basarisiz" });
  }
}


module.exports = {createSocialPost,getSocialPosts,getSingleSocialPost,createComment,
  getPostComments, updateComment, likePost, createClubPost, createClub, followClub,
  getClubs, getClub, getLikedPostsOfUser, updatePost, deletePost, deleteComment,updateClub, getClubPostByClub,
  getEventsToday
}

