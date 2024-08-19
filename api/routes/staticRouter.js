const express = require('express');
const router = express.Router();
const Album = require('../models/album');

router.get('/', async (req, res) => {
    try {
        const albums = await Album.find();
        res.render('home', { album: albums });
    } catch (error) {
        console.error('Error fetching albums:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/add/new', (req, res) => {
    res.render('addAlbum', { album: new Album() });
});

router.get('/edit/:id', async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        if (!album) {
            return res.status(404).send('Album not found');
        }
        res.render('editAlbum', { album });
    } catch (error) {
        console.error('Error fetching album:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
