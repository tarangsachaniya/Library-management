import mongoose from "mongoose";

const UserSchema  = new mongoose.Schema({
      name:{
            type:String,
            required:true,
            minlength: 5,
      },
      email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
      },
      phone:{
            type:Number,
            required:true,
            unique:true
      },
      password:{
            type:String,
            required:true,
      },
      role:{
            type:String,
            required:true,
            default:"patron" //patron,admin,librarian
      },
      status:{
            type:String,
            required:true,
            default:"active" //active,inactive or pending
      }
} , {timestamps : true}
);

const User = mongoose.model('User',UserSchema);
export default User;