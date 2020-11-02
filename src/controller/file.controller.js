const uploadFile = require("../middleware/upload");
const fs = require("fs");
const baseUrl = "http://localhost:3000";

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);
    if (req.file === undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    const directoryPath = baseUrl + "/src/images/uploads/";
    return directoryPath + req.file.originalname;
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/src/images/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

module.exports = {
  upload,
  download,
};
