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

export function optimizeCloudinaryImage(url, quality = imageQuality.LOW) {
  if (typeof url !== 'string') {
    return url
  }

  const matches = url.match(
    /^(https?:\/\/res.cloudinary.com\/[^\/]+\/image\/upload)\/(.*)$/
  )

  if (!matches) {
    return url
  }

  const [_, base, details] = matches
  const qualityParam = ['q_auto', quality].filter((x) => x).join(':')
  const newUrl = [base, qualityParam, details].join('/')

  return newUrl
}

// So you can do optimizeCoudinaryImage.LOW, optimizeCloudinaryImage.BEST, etc.
Object.assign(optimizeCloudinaryImage, imageQuality)
