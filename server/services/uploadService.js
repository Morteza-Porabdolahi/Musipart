const multer = require("multer");
const cloudinary = require("cloudinary");

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const memoryStorage = multer.memoryStorage();
const upload = multer({
	storage: memoryStorage,
});

const uploadToCloudinary = async (format, fileString) => {
	try {
		const { uploader } = cloudinary;
		const response = await uploader.upload(
			`data:image/${format};base64,${fileString}`
		);

		return response;
	} catch (e) {
		throw new Error(e.message);
	}
};

const removeFromCloudinary = async (publicId = "") => {
	try {
		const { uploader } = cloudinary;
		const response = await uploader.destroy(publicId);

		return response;
	} catch (e) {
		throw new Error(e.message);
	}
};

module.exports = {
	upload,
	uploadToCloudinary,
	removeFromCloudinary
};
