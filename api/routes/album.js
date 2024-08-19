const express=require("express")
const router=express.Router()
const {getAlbum, addNewAlbum, upload, deleteAlbum, updateAlbum} = require("../controllers/album")
router.get("/:id",getAlbum)
router.post("/",upload.single('coverImage'), addNewAlbum)
router.delete("/:id",deleteAlbum)
router.patch("/:id",upload.single('coverImage'), updateAlbum)
module.exports=router