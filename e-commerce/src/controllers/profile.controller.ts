import type { Request, Response } from "express";
import { createProfile, deleteProfile, getProfileById, updateProfile } from "../services/profile.service";
import { successResponse } from "../utils/respons";


export const create = async (req: Request, res: Response) =>{
    const file = req.file
    if (!file) throw new Error("image is required");

    const { name, gender, address } = req.body;

    const imageURL = `/public/uploads/${file.filename}`


    const profile = await createProfile({
        name: String(name),
        gender: String(gender),
        address: String(address),
        profile_picture_url: imageURL,
        userId: Number(req.user?.id)
    })

    successResponse(res, 'Profile created successfully', profile);
}

export const getById = async (req: Request, res: Response) => {
    const profile = await getProfileById(Number(req.params.id));

    successResponse(res, 'Profile retrieved successfully', profile);
}

export const update = async (req: Request, res: Response) => {
    const profile = await updateProfile(Number(req.params.id), req.body);

    successResponse(res, 'Profile updated successfully', profile);

}

export const remove = async (req: Request, res: Response) => {
    const profile = await deleteProfile(Number(req.params.id));

    successResponse(res, 'Profile deleted successfully', profile);
}