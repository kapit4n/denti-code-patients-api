exports.createPatient = (req, res, next) => {
  res.status(201).json({ message: 'Patient Created'})
}

exports.getAllPatients = (req, res, next) => {
  res.status(200).json([])
}