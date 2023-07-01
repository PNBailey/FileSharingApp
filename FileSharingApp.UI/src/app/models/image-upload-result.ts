import { ImageUploadError } from "./image-upload-error";

export class ImageUploadResult {
    error: ImageUploadError;
    url: string;
}