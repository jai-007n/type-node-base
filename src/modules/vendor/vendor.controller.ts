import { vendorService } from "./vendor.service";
import { Request, Response } from "express";

export async function updateVendor(req: Request, res: Response) {
  try {
    const result = await vendorService.updateVendor(
      req.params.id as string,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}


export async function getVendor(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const vendor = await vendorService.getVendorById(id as string);

    return res.status(200).json({
      success: true,
      message: "vendor fetch successfully !!",
      data: vendor,
    });

  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}