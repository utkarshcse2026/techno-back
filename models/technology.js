const mongoose = require('mongoose');

const technologySchema = new mongoose.Schema({
  techname: {
    type: String,
    required: true
  },
  crop: {
    type: String,
    required: true
  },
  location: {
    type: [Number],  
    required: true
  }
});

module.exports = mongoose.model('Technology', technologySchema);
