// Fonction qui permet de transformer nos fichiers que l'on reçoit sous forme de buffer en base64 afin de pouvoir les upload sur cloudinary
const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

module.exports = convertToBase64;
