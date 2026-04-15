export class UserRepository {
  static async findAll() {
    return [
      { id: 1, name: "John" }
    ];
  }
}