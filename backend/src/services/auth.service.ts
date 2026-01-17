import { UserRepository } from "../repositories/user.repository";
import { BadRequestError } from "../utils/app.error";
import type { SignupInput } from "../validators/auth.validator";
import bcrypt from "bcrypt";

export class AuthService {
  userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async signup(data: SignupInput) {
    const { email, password } = data;
    const existingUser = await this.userRepository.getUserByEmail(email);

    if (existingUser) {
      throw new BadRequestError("EMAIL_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.createUser({
      ...data,
      password: hashedPassword,
    });
    return newUser;
  }
}
