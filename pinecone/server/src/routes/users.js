import express from "express"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {
    UserModel
} from "../models/Users.js"

const router = express.Router()

// gets username info from front end
router.post("/register", async (req, res) => {
    const {
        username,
        password
    } = req.body;

    // Checks to see if user exists
    const user = await UserModel.findOne({
        username
    });

    // checks to see if user existsalready
    if (user) {
        return res.json({
            message: "User already exists."
        });
    }

    // if user doesnt already exist, encrypt password for user
    const hashedPassword = await bcrypt.hash(password, 10)

    //add user to DB
    const newUser = new UserModel({
        username,
        password: hashedPassword // set password to hashed PW
    })
    await newUser.save();

    res.json({
        message: "User Registered successfully."
    })
});

// web token (JWT)


router.post("/login", async (req, res) => {
    const {
        username,
        password
    } = req.body;

    const user = await UserModel.findOne({
        username
    });

    // checks to see if user existsalready
    if (!user) {
        return res.json({
            message: "User doesnt exists."
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        res.json({
            message: "Username or password is wrong"
        })
    }

    const token = jwt.sign({
        id: user._id
    }, "secret")
    res.json({
        token,
        userID: user._id
    })
});


export {
    router as userRouter}

    export const verifyToken = (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (authHeader) {
          jwt.verify(authHeader, "secret", (err) => {
            if (err) {
              return res.sendStatus(403);
            }
            next();
          });
        } else {
          res.sendStatus(401);
        }
};