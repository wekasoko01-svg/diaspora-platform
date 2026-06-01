import { Request, Response } from "express"
import * as requestService from "../services/requests"

export async function create(req: Request, res: Response) {
  try {
    const request = await requestService.createRequest(req.user!.userId, req.body)
    res.status(201).json({ success: true, data: request })
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message })
  }
}

export async function list(req: Request, res: Response) {
  const requests = await requestService.getRequests(req.user!.userId)
  res.json({ success: true, data: requests })
}

export async function getById(req: Request, res: Response) {
  const request = await requestService.getRequestById(req.params.id)
  if (!request) return res.status(404).json({ success: false, error: "Request not found" })
  res.json({ success: true, data: request })
}

export async function update(req: Request, res: Response) {
  const request = await requestService.updateRequestStatus(req.params.id, req.body.status, req.body.assignedTo)
  res.json({ success: true, data: request })
}
