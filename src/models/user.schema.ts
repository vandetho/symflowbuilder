import { model, models, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    githubId?: string;
    googleId?: string;
}

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            versionKey: false,
            virtuals: true,
            transform: (_, ret) => {
                delete ret._id;
            },
        },
    },
);

const SALT_WORK_FACTOR = process.env.SALT_WORK_FACTOR || 10;

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, SALT_WORK_FACTOR);
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = models.User || model<IUser>('User', userSchema);

export default User;
