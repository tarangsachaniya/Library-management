import mongoose from 'mongoose'

const connectDb = async()=>{
      try {
            const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/library`);
            console.log("DB Connected");
      } catch (error) {
            console.log(error);
      }
}

export default connectDb;