import mongoose from "mongoose";
import { GenderEnum, ProviderEnum } from "../../common/enums/index.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required to signup"],
      minLength: [3, "First name should contain at least 3 characters {VALUE}"],
      maxLength: [
        30,
        `First name can't contain more than 30 characters {VALUE}`,
      ],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required to signup"],
      minLength: [3, "Last name should contain at least 3 characters {VALUE}"],
      maxLength: [
        30,
        `Last name can't contain more than 30 characters {VALUE}`,
      ],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required to signin"],
      unique: [true, `You can't register with the same mail twice`],
    },
    password: {
      type: String,
      required: [true, "You should enter a password to signup"],
      minLength: [8, `Password can't be less than 8 characters`],
    },
    gender: {
      type: Number,
      enum: Object.values(GenderEnum),
      default: GenderEnum.Male,
    },
    phone: {
      type: String,
    },
    confirmedEmail: {
      type: Date,
    },
    changeCredentialTime: {
      type: Date,
    },
    provider: {
      type: Number,
      enum: Object.values(ProviderEnum),
      default: GenderEnum.System,
    },
    profilePicture: String,
    coverProfilePictures: [String],
  },
  {
    collection: "Users",
    strict: true,
    strictQuery: true,
    optimisticConcurrency: true,
    toJSON: { virtuals: true },
    timestamps: true,
    autoIndex: true
  },
);

userSchema.virtual(`username`).set(function (value) {
    const [firstName, lastName] = value.split(` `);
    this.set({
        firstName: firstName,
        lastName: lastName
    })
}).get(function() {
    return this.firstName + ' ' + this.lastName
}
)

export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);
