import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import { compare,hash } from 'bcryptjs';
import User from "../typeorm/entities/User";
import UsersRepository from "../typeorm/repositories/UsersRepository";

interface IRequest {
  user_id: string,
  name: string,
  email: string,
  password: string,
  old_password: string
}

const hashSalt = 8;//NÃO MUDAR

class UpdateProfileSerevice {
  public async execute({
    user_id,
    name,
    email,
    password,
    old_password
  }: IRequest):Promise<User> {
    const userRepository = getCustomRepository(UsersRepository);

    const user = await userRepository.findById(user_id);

    if(!user) {
      throw new AppError("User not found");
    }

    const userUpdateEmail = await userRepository.findByEmail(email);

    if(userUpdateEmail && userUpdateEmail.id !== user_id) {
      throw new AppError("This email is already used for another user.");
    }

    if(password && !old_password) {
      throw new AppError("Old password is required.");
    }

    if(password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if(!checkOldPassword) {
        throw new AppError("Old password doesn't match.");
      }

      user.password = await hash(password, hashSalt);
    }

    user.name = name;
    user.email = email;

    await userRepository.save(user);

    return user;
  }
}
export default UpdateProfileSerevice;
