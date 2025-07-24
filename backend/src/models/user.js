import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'; // encrypt password 


// //to load environment variables from .env
 dotenv.config();

// const uri = process.env.MONGO_URI;
// //add to server
// mongoose.connect(uri)
//     .then(() => console.log('✅ Connected to MongoDB Atlas'))
//     .catch(err => console.error('❌ Connection error:', err));

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters'],
            maxlength: [30, 'Username must be at most 30 characters']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            //validation rule that mongoose would validate the email format
            //any non-whitespace character  \. matches a literal dot 
            match: [/\S+@\S+\.\S+/, 'Invalid email address'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        }
    },
    { timestamps: true } //keep track of created and updated time

);
                                      //next para:call next to complete the operation
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch (error) {
        next(error);// Pass error to mongoose to log out
    }
    
});

userSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword,this.password);
                                               //point to current user
};
          //create mongo model and use schema structure
const User = mongoose.model('User',userSchema);

// connect database
// const uri = process.env.MONGO_URI;

// async function seed() {
//   try {
//     await mongoose.connect(uri);
//     console.log('MongoDB connected');

//     // add user
//     const user = new User({
//       username: 'testuser',
//       email: 'testuser@example.com',
//       password: '123456',
//       role: 'user',
//     });

//     await user.save();

//     console.log('User seeded:', user);

//     // disconnect
//     await mongoose.disconnect();
//     console.log('Disconnected from MongoDB');
//   } catch (err) {
//     console.error('❌ Error seeding user:', err);
//   }
// }

// seed();

export default User;