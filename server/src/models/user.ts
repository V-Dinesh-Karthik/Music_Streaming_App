import mongoose from "mongoose"
import bcrypt from "bcrypt"

export interface IUser extends mongoose.Document {
    email: string,
    username: string,
    password: string,
    token?: string,
    createdAt: Date,
    updatedAt: Date,
    comparePassword(password: string): Promise<boolean>
}


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
})


userSchema.pre("save",async function(next){
    const user = this as IUser

    if(!user.isModified("password")) return next()

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(user.password,salt)


    user.password = hash;

    return next()
})


userSchema.methods.comparePassword = async function(password: string)  {
    const user = this as IUser
    return bcrypt.compareSync(password,user.password)
}

const user = mongoose.model<IUser>("User", userSchema)

export default user