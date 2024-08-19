// api/controllers/album.js
const Album = require('../models/album');
const multer = require('multer');
const cloudinary = require('../config/cloudinaryConfig');

// Configura multer para no guardar los archivos en el sistema de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const getAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    res.render('albumDetails', { album });
  } catch (error) {
    console.error('Error fetching album:', error);
    res.status(500).send('Internal Server Error');
  }
};

const addNewAlbum = async (req, res) => {
  try {
    const { title, artist, price, description } = req.body;
    if (!title || !price || !artist) {
      return res.render('addAlbum', { error: 'All fields are required!' });
    }
    
    const albumExists = await Album.findOne({ title });
    if (albumExists) {
      return res.render('addAlbum', { error: 'Album already exists!' });
    }

    let coverImageUrl = '';
    if (req.file) {
      // Usa una promesa para manejar la carga de imágenes
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'albums' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }).end(req.file.buffer);
      });
      coverImageUrl = result.secure_url;
    }

    const newAlbum = await Album.create({
      title,
      artist,
      price,
      description,
      coverImage: coverImageUrl
    });

    res.redirect('/');
  } catch (error) {
    console.error('Error adding album:', error);
    res.render('addAlbum', { error: 'An error occurred while adding the album.' });
  }
};

const deleteAlbum = async (req, res) => {
  try {
    await Album.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting album:', error);
    res.status(500).send('Internal Server Error');
  }
};

const updateAlbum = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      // Usa una promesa para manejar la carga de imágenes
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'albums' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }).end(req.file.buffer);
      });
      updateData.coverImage = result.secure_url;
    }

    const album = await Album.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!album) {
      return res.status(404).render('editAlbum', { error: 'Album not found', album: req.body });
    }

    res.redirect('/');
  } catch (error) {
    console.error('Error updating album:', error);
    res.status(500).render('editAlbum', { error: 'An error occurred while updating the album.', album: req.body });
  }
};

module.exports = { getAlbum, addNewAlbum, upload, deleteAlbum, updateAlbum };
