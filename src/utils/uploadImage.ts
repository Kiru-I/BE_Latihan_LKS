import fs from 'fs'
import path from 'path'

export const uploadImage = async (file: File | null) => {
  if (!file || !(file instanceof File)) return null

  const uploadDir = path.join(process.cwd(), 'uploads')

  // ✅ create folder if not exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const fileName = `${Date.now()}-${file.name}`
  const filePath = path.join(uploadDir, fileName)

  const buffer = Buffer.from(await file.arrayBuffer())

  await fs.promises.writeFile(filePath, buffer)

  return {
    fileName,
    url: `http://localhost:8000/uploads/${fileName}`
  }
}