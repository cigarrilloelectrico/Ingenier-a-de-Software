import multer from 'multer'

const storage = multer.memoryStorage()

const formatosPermitidos = ['image/jpeg', 'image/png']

const fileFilter = (req, file, cb) => {
  if (!formatosPermitidos.includes(file.mimetype)) {
    const error = new Error('La imagen debe estar en formato JPG o PNG')
    error.statusCode = 400
    return cb(error)
  }

  cb(null, true)
}

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
})

export default upload