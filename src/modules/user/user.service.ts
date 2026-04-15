import { UserRepository } from "./user.repository";

export class UserService {
  static async getAllUsers() {
    return UserRepository.findAll();
  }
}