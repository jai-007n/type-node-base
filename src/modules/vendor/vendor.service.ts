import { vendorRepository, VendorRepository } from "./vendor.repository";

export class VendorService {

  private vendorRepo: VendorRepository;
  constructor(vendorRepo: VendorRepository) {
    this.vendorRepo = vendorRepo;
  }

  async updateVendor(id: string, data: any) {
    const vendor = await this.vendorRepo.findById(id);

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    // business logic example
    if (data.email) {
      const existing = await this.vendorRepo.findByEmail(data.email);
      if (existing && existing.id !== id) {
        throw new Error("Email already exists");
      }
    }

    return this.vendorRepo.updateById(id, data);
  }

  async getVendorById(id: string) {
    const vendor = await this.vendorRepo.findById(id);

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    return vendor;
  }
}


export const vendorService = new VendorService(vendorRepository);