import { IBaseRepository } from "../../repository/IBaseInterface";
import { Vendor } from "./vendor.model";

export interface IVendorInterface  extends IBaseRepository<Vendor>{
     findByEmail(email: string): Promise<Vendor | null>;
}