import { BaseRepository } from "../../repository/BaseRepository";
import { IVendorInterface } from "./vendor.interface";
import { Vendor } from "./vendor.model";

export class VendorRepository extends BaseRepository<Vendor> implements IVendorInterface {

  constructor() {
    super(Vendor);
  }


  static async findAll() {
    return [
      { id: 1, name: "John" }
    ];
  }

  async findByEmail(email: string): Promise<Vendor | null> {
    return this.model.findOne({ where: { email } });
  }
}

export const vendorRepository = new VendorRepository();