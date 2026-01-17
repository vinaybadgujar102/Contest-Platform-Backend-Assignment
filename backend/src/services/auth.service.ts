import { UserRepository } from "../repositories/user.repository";
import { BadRequestError, UnAuthorizedError } from "../utils/app.error";
import { generateToken } from "../utils/jwt.utils";
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

  async login(email: string, password: string) {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new UnAuthorizedError("INVALID_CREDENTIALS");
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw new UnAuthorizedError("INVALID_CREDENTIALS");
    }

    const token = generateToken({ userId: user.id, role: user.role });
    return token;
  }
}
