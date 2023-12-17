const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
const VerificationObject = require('../models/Verification')


async function prereg(req,res){
  const {user_email}=req.body;
  if(!user_email){
    return res.status(422).json({'message': 'Invalid fields'})
  }
  let verificationcode=Math.floor(Math.random() * (999999 - 100000) + 100000);
  const verifications = await VerificationObject.find({ user_email: user_email }).exec();
  
  if(verifications.length > 0){
    await VerificationObject.deleteMany({ user_email: user_email }).exec();
  }
  console.log("deneme")
  await VerificationObject.create({user_email,verificationcode})
  await sendEmail(user_email, 'Bilkent Forum Project Verification Code', ("Your verification code is "+verificationcode+" ."))
  return res.status(200).json({'message': verificationcode+","+user_email})
} 


async function register(req, res){
  const {username, email, password, password_confirm, verificationcode} = req.body

  if(!username || !email || !password || !password_confirm || !verificationcode) {
    return res.status(422).json({'message': 'Invalid fields'})
  }

  if(password !== password_confirm) return res.status(422).json({'message': 'Passwords do not match'})

  const userExists = await User.exists({email}).exec()

  if(userExists) return res.sendStatus(409)

  const verification=await VerificationObject.findOne({user_email:email, verificationcode: verificationcode}).exec()
  console.log(verification);
  if(!verification)return res.status(401).json({'message': 'email - verification code does not match'})

  try {
    hashedPassword = await bcrypt.hash(password, 10)

    await User.create({email, username, password: hashedPassword})

    return res.sendStatus(201)
  } catch (error) {
    return res.status(400).json({message: "Could not register"})
  }
}

async function login(req, res){
  const {email, password } = req.body

  if(!email || !password) return res.status(422).json({'message': 'Invalid fields'})
  
  const user = await User.findOne({email}).exec()

  if(!user) return res.status(401).json({message: "Email or password is incorrect"})

  const match = await bcrypt.compare(password, user.password)

  if(!match) return res.status(401).json({message: "Email or password is incorrect"})


  const accessToken = jwt.sign(
    {
      id: user.id,
      username: user.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '14d'
    }
  )

  const refreshToken = jwt.sign(
    {
      id: user.id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '100d'
    }
  )

  user.refresh_token = refreshToken
  await user.save()

  res.cookie('refresh_token', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000})
  res.json({user: user, backendTokens:{accessToken:accessToken, refreshToken:user.refresh_token}})
}

async function logout(req, res){
  const cookies = req.cookies

  if(!cookies.refresh_token) return res.sendStatus(204)

  const refreshToken = cookies.refresh_token
  const user = await User.findOne({refresh_token: refreshToken}).exec()

  if(!user){
    res.clearCookie('refresh_token', {httpOnly: true, sameSite: 'None', secure: true})
    return res.sendStatus(204)
  }

  user.refresh_token = null
  await user.save()

  res.clearCookie('refresh_token', {httpOnly: true, sameSite: 'None', secure: true})
  res.sendStatus(204)
}

async function refresh(req, res){
  const cookies = req.cookies
  if(!cookies.refresh_token) return res.sendStatus(401).json({'message': 'middleware auth basarisiz'})
  const refreshToken = cookies.refresh_token

  const user = await User.findOne({refresh_token: refreshToken}).exec()

  if(!user) return res.sendStatus(403)

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if(err || user.id !== decoded.id) return res.sendStatus(403)

      const accessToken = jwt.sign(
        { id: decoded.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1800s' }
      )

      res.json({access_token: accessToken})
    }
  )
}


async function user(req, res){
  
  const user = req.user

  return res.status(200).json(user)
}

async function sendEmail(to, subject, text) {
  // E-posta gönderme işlemi için bir transporter oluşturun.
  const transporter = nodemailer.createTransport({
    service: 'hotmail', // veya kullanacağınız e-posta sağlayıcısı
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // E-posta gönderme işlemini gerçekleştirin.
  const mailOptions = {
    from: 'bilkent.forum.project@hotmail.com',
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('E-posta gönderildi.');
  } catch (error) {
    console.error('E-posta gönderilirken hata oluştu:', error);
  }
}

async function getProfile(req, res) {
  const {id} = req.body
  if(!id) return res.status(422).json({'message': 'id göndermedin'})
  try {
    console.log("id: ", id)
    const user = await User.findOne({_id:id}).exec()
    if(!user)return res.status(422).json({'message': 'kullanici yok'})
    res.json({username: user.username, email:user.email, imageURL: user.imageURL})
  } catch (error) {
    console.log(error)
    if(!user)return res.status(404).json({'message': 'kullanici yok'})
  }
}


async function deleteUser(req, res) {
  const {id} = req.body
  if(!id) return res.status(422).json({'message': 'id göndermedin'})
  console.log("id: ", id)
  const user = await User.findOne({_id:id}).exec()
  if(!user)return res.status(422).json({'message': 'kullanici yok'})
  
  const deleteduser = await User.findOneAndDelete({ _id: id }).exec();
  res.json({'message': 'kullanici silindi'})
}

async function changePassword(req, res) {
  const {oldPass, newPass, id} = req.body
  if(!oldPass || !newPass || !id) return res.status(422).json({'message': 'input göndermedin'})
  const user = await User.findOne({_id:id}).exec()
  if(!user)return res.status(422).json({'message': 'kullanici yok'})
  const match = await bcrypt.compare(oldPass, user.password)
  if(!match) return res.status(401).json({message: "Email or password is incorrect"})

  hashedPassword = await bcrypt.hash(newPass, 10)

  user.password = hashedPassword;
  await user.save();

  return res.sendStatus(201)
}

async function updateImage(req,res){
  const {imageURL} = req.body;
  const user = req.user;
  if(!imageURL) {
    return res.status(422).json({'message': 'Invalid fields'})
  }
  try {
    await User.findOneAndUpdate(
      { _id: user.id},
      { $set: { imageURL: imageURL } }
    );
    return res.status(201).json({message: "update image basarili"})
  } catch (error) {
    console.log(error)
    return res.status(400).json({message: "Could not update image"})
  }
}
async function getUsers(req,res){
  const user = req.user;
  try {
    const users = await User.find({});
    console.log(users)
    return res.status(201).json(users)
  } catch (error) {
    console.log(error)
    return res.status(400).json({message: "Could not get users"})
  }
}

async function updateRole(req,res){
  const {role, studentId} = req.body;
  const user = req.user;
  if(!role || !studentId) {
    return res.status(422).json({'message': 'Invalid fields'})
  }
  try {
    const users = await User.findOneAndUpdate(
      { _id: studentId},
      { $set: { role: role } }
    );

    return res.status(201).json({message: "update basarili"})
  } catch (error) {
    console.log(error)
    return res.status(400).json({message: "Could not get users"})
  }
}

async function banStasusChange(req,res){
  const {studentId} = req.body;
  if(!studentId) {
    return res.status(422).json({'message': 'Invalid fields'})
  }
  try {
    const currentUser = await User.findOne({ _id: studentId});
    const newBanStatus = !currentUser.isBanned;
    const users = await User.findOneAndUpdate(
      { _id: studentId},
      { $set: { isBanned: newBanStatus } }
    );

    return res.status(201).json({message: "ban change basarili"})
  } catch (error) {
    console.log(error)
    return res.status(400).json({message: "Could not ban change"})
  }
}
module.exports = {register, login, logout, refresh, user, prereg, getProfile, deleteUser,changePassword, updateImage, getUsers,updateRole,banStasusChange}