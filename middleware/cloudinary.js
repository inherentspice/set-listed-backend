const cloudinary = require('cloudinary').v2;


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

const cloudinaryUploadLarge = file => cloudinary.uploader.upload(file, {
  folder: "Set-Listed",
  width: 725,
  height: 250,
  crop:"scale"
});

const cloudinaryUpload = file => cloudinary.uploader.upload(file, {
  folder: "Set-Listed",
  width: 250,
  height: 250,
  crop:"scale"
});

const cloudinaryDelete = publicId => cloudinary.uploader.destroy(publicId);

module.exports = {
  cloudinaryUpload,
  cloudinaryUploadLarge,
  cloudinaryDelete
}
