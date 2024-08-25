import {User} from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";

const registerUser = async (req, res) => {
    const {username, email, password} = req.body;
    try{
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message: "User already exists"});
        const newUser = new User({
            username, email, password
        })

        await newUser.save();

        res.status(201).json({message: "user registered successfully", newUser});
    }catch(error){
        console.log(error);
        res.status(500).json({message: "server error", error})
    }
}

const loginUser = async (req, res) => {
    const {email, username, password} = req.body;
    if(!username && !email){
        throw new ApiError(400, "username or email required")
    }
    const user = await User.findOne({$or: [{username}, {email}]})

    if(!user){
        throw new ApiError(404, "User not found")
    }

    const isPasswordValid = await user.comparePasswords(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid password")
    }

    const accessToken = await user.generateAccessToken();

    const loggedInUser = await User.findById(user._id).select(" -password");

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
  
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json({message: "User logged in", loggedInUser,accessToken});
}

export {registerUser, loginUser}