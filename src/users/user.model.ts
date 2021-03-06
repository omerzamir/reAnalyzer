import { Schema, model, HookNextFunction } from 'mongoose';
import bcrypt from 'bcrypt';
import Iuser from './user.interface';

const userSchema = new Schema(
  {
    uniqueId: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    settings: {
      type: {},
      default: { colors: ['#E9A951', '#237675', '#2E1510'] },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateHash = function generateHash(
  password: string
): string {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

userSchema.methods.validPassword = function validPassword(
  password: string
): boolean {
  return bcrypt.compareSync(password, this.password);
};

userSchema.pre<Iuser>('save', function preSave(
  this: Iuser,
  next: HookNextFunction
) {
  if (this.password) {
    this.password = this.generateHash(this.password);
  }

  next();
});

export default model<Iuser>('users', userSchema);
