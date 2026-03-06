import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const JWT_SECRET = 'your_jwt_secret_here';
const TOKEN_EXPIRES_IN = '24h';
/* ---------------- helpers ---------------- */
const emailIsValid = (e) => /\S+@\S+\.\S+/.test(String(e || ""));
const extractCleanPhone = (p) => String(p || "").replace(/\D/g, "");

const mkToken = (payload) => jwt.sign(payload, JWT_SECRET, {expiresIn: TOKEN_EXPIRES_IN});


//Register Function

export const registerUser = async (req, res) => {
    try{
        const {fullName , username, email, phone, birthDate, password } = req.body || {};

        if(!fullName || !username || !email || !phone || !birthDate || !password){
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        if(typeof fullName !== 'string' || fullName.trim().lemgth < 2){
            return res.status(400).json({
                success: false,
                message: 'Full name must be atleast 2 character.'
            })
        }

            if(typeof username !== 'string' || username.trim().lemgth < 3){
            return res.status(400).json({
                success: false,
                message: 'user name must be atleast 3 character.'
            })
        }

        if(!emailIsValid(email)){
            return res.status(400).json({
                success: false,
                message: 'Email is Invalid'
            })
        }

        const cleanedPhone = extractCleanPhone(phone);
        if(cleanedPhone.length < 6){
            return res.status(400).json({
                success: false,
                message: 'Phone number seems invalid.'
            })
        }

        if(String(password).length < 6 ){
            return res.status(400).json({
                success: false,
                message: 'Password must be atleast 6  characters long.'
            })
        }

        const parsedBirth = new Date(birthDate);
        if(Number.isNaN(parsedBirth.getTime())){
            return res.status(400).json({
                success: false,
                message: 'Birth Date Invalid.'
            })
        }

        const existingByEmail = await User.findOne({email: email.toLowerCase().trim()});
        if(existingByEmail) return res.status(400).json({
            success: false,
            message: 'Email already exist'
        })

           const existingByUsername = await User.findOne({username: username.trim().toLowerCase()});
        if(existingByUsername) return res.status(400).json({
            success: false,
            message: 'Username already used'
        })

        //Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = await User.create({
            fullName: fullName.trim(),
      username: username.trim(),
      email: email.toLowerCase().trim(),
      phone: phone,
      birthDate: parsedBirth,
      password: hashedPassword

        });

        const token  = mkToken({id: newUser._id});

        const userToReturn = {
            id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            phone: newUser.phone,
            birthDate: newUser.birthDate
        };

        return res.status(201).json({
            success: true,
            message: 'User Registred Successfully!',
            token,
            user: userToReturn
        });

    }
    catch (error){
        console.error('register error:', err );
        if(err.code === 11000){
            const dupKey = Object.keys(err.keyValue || {})[0];
            return res.status(400).json({
                success: false,
                message: `${dupKey} already exists.`
            })
        }
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        })
    }
}


//LOGIN FUNCTION

export async function login(req, res) {
    try {
        const { email, password} = req.body || {};

        if(!email || !password){
            return res.status(401).json({
                success: false,
                message: 'All Field are required.'
            });
        }

        const user = await User.findOne({ email })
        if(!user) return res.status(400).json({
            success: false,
            message: 'Invalid email or password'
        });

        const isMatch  = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({
            success: false,
            message: 'All Field are required.'
        });

        const token = mkToken({id: user._id.toString() });
        return res.status(200).json({
            success: true,
            message: 'Login successfully.',
            token,
            user: {
                id: user._id.toString(),
                 fullName: user.fullName,
                 username: user.username,
                 email: user.email,
                 phone: user.phone,
                 birthDate: user.birthDate
            }
        });

    } 
    
    catch (error) {
        console.error('Login Error');
        return res.status(500).json({
            success: false,
            message: 'Server error.'
        })
    }
}