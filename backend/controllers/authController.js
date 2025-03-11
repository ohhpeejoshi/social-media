import { User } from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import TryCatch from "../utils/TryCatch.js";
import getDataURL from "../utils/urlGenerator.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";

export const registerUser = TryCatch(async (req, res) => {

    const { name, email, password, gender } = req.body;
    const file = req.file;
    if (!name || !email || !password || !gender || !file) {
        return res.status(400).json({
            message: "Plese give all values!!",
        });
    }

    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({
            message: "User already exists!!",
        });
    }

    const fileURL = getDataURL(file);

    //hash pswd
    const hashPassword = await bcrypt.hash(password, 10);

    //upload image to cloudinary
    const myCloud = await cloudinary.v2.uploader.upload(fileURL.content);

    user = new User({
        name,
        email,
        password: hashPassword,
        gender,
        profilePic: {
            id: myCloud.public_id,
            url: myCloud.secure_url
        },
    });

    await user.save();

    generateToken(user._id, res);

    res.status(201).json({
        message: "User registered successfully!!",
        user: user,
    })
})


export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "Invalid email",
        });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
        return res.status(400).json({
            message: "Invalid credentials!!",
        });
    }

    generateToken(user._id, res);

    res.json({
        message: "User logged in successfully!!",
        user,
    })

});


export const logoutUser = TryCatch((req, res) => {
    res.cookie("token", "", { maxAge: 0 });
    res.json({
        message: "User logged out successfully!!",
    })
});
