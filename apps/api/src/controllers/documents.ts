import { Request, Response } from "express"
import * as documentService from "../services/documents"

export async function list(req: Request, res: Response) {
  const docs = await documentService.getDocuments(req.user!.userId)
  res.json({ success: true, data: docs })
}

export async function upload(req: Request, res: Response) {
  try {
    const file = req.file as Express.Multer.File | undefined
    if (!file) {
      return res.status(400).json({ success: false, error: "No file provided" })
    }
    const doc = await documentService.createDocument({
      userId: req.user!.userId,
      name: file.originalname,
      type: file.mimetype,
      url: `/uploads/${file.filename}`,
      size: file.size,
    })
    res.status(201).json({ success: true, data: doc })
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message })
  }
}
