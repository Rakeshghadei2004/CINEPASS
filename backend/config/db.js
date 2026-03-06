import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://rakeshghadei2004_db_user:rakesh123@cluster0.jloyhh8.mongodb.net/MovieBook')
    .then(() => console.log('DB CONNECTED'))
}