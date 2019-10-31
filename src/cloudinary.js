import { cloudinaryCloud, cloudinaryUploadPreset } from './constants/config'

const uploadURL = `https://api.cloudinary.com/v1_1/${cloudinaryCloud}/image/upload`

function encodeBody(object) {
  const formData = new FormData()

  Object.keys(object).forEach((key) => formData.append(key, object[key]))

  return formData
}

export async function uploadImageToCloudinary(file) {
  const response = await fetch(uploadURL, {
    method: 'post',
    body: encodeBody({
      file,
      upload_preset: cloudinaryUploadPreset,
    }),
  })

  return (await response.json()).secure_url
}

export const imageQuality = {
  AUTO: '',
  ECO: 'eco',
  LOW: 'low',
  GOOD: 'good',
  BEST: 'best',
}

export function optimizeCloudinaryImage(url, quality = imageQuality.LOW, size = "f_auto") {
  if (!url || typeof url !== "string") {
    return url;
  }

  //Only manipulate urls served from cloudinary and ones that have not already been manipulated
  if (
      url.indexOf("res.cloudinary.com") === -1 ||
      url.indexOf("/q_auto:") > -1
  ) {
    return url;
  }

  const insertAfterString = "/image/upload/";
  const index = url.indexOf(insertAfterString);
  if (index === -1) {
    return url;
  }

  const qualityParams = `${size}/q_auto:${quality}/`;
  const indexToInsert = index + insertAfterString.length;

  return [
    url.slice(0, indexToInsert),
    qualityParams,
    url.slice(indexToInsert)
  ].join("");
}

// So you can do optimizeCoudinaryImage.LOW, optimizeCloudinaryImage.BEST, etc.
Object.assign(optimizeCloudinaryImage, imageQuality)
