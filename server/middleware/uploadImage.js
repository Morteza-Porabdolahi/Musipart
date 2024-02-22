const bufferToDataUri = require("../utils/file.js");
const { uploadToCloudinary } = require("../services/uploadService");

exports.uploadImage = async (req, res, next) => {
	try {
		const { file } = req;

		if (file) {
			const fileFormat = file.mimetype.split("/")[1];
			const { base64 } = bufferToDataUri(fileFormat, file.buffer);
			const { url, public_id } = await uploadToCloudinary(fileFormat, base64);

			res.locals.image = { url, public_id };

			next();
		}
	} catch (e) {
		res.status(e.statusCode || 500).send({ message: e.message });
	}
};
