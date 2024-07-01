import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';
import bcrypt from 'bcryptjs';
export const loginUser = async (req, res) => {
      let { email, password } = req.body;
      if (!email || !password) {
            return res.status(400).json({ message: "Please enter all the fields." });
      }
      try {
            const user = await User.findOne({ email });
            if (!user) {
                  return res.status(400).json({ message: "Invalid Credentials" });
            }
            const validPassword = await bcrypt.compare(
                  req.body.password,
                  user.password
                );
            if (!validPassword) {
                  return res.status(400).json({ message: "Invalid Credentials" });
            }
            const token = jwt.sign({
                  user: user._id,
            },process.env.JWT_SECRET,{
                  expiresIn: '1d'
            });

            if(!token){
                  return res.status(400).json({message: "message occur while generating token" });
            }

            password = undefined;

            res.cookie("token",token,{
                  httpOnly: true,
                  maxAge: 24 * 60 * 60 * 1000
            });
            res.status(200).json({ user, token, message:"Login successfully" });


      } catch (err) {
            console.log(err);
      }
}


export const registerUser = async (req, res) => {
      let { name, email, phone, password, cpassword } = req.body;
      if (!name || !email || !phone || phone.length != 10 || !password || !cpassword || password.length < 6) {
            return res.status(400).json({ message: "Please enter all the fields." });
      }
      if (password !== cpassword) {
            return res.status(400).json({ message: "Password does not match." });
      }
      try {
            const user = await User.findOne({ email });
            if (user) {
                  return res.status(400).json({ message: "Email already exists." });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            password = hashedPassword;
            const newUser = await User.create({
                  name,
                  email,
                  phone,
                  password,
            });
            if(!newUser){
                  return res.status(400).json({message:"Something went wrong."});
            }
            return res.status(201).json({ message: "User registered successfully." });
      } catch (err) {
            console.log(err);
            return res.status(500).json({
                  message: "Something went wrong. Please try again later.",
            });
      }

}

