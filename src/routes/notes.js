const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const { body, validationResult } = require('express-validator')
const Notes = require('../models/Notes')

//Route: 1 =>
//Fetching all notes from database using: GET /api/notes/fetchAllNotes, login required
router.get('/fetchAllNotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    }
    catch (err) {
        console.error(err)
        res.status(500).send("some error occered")
    }
})

// Route: 2 =>
//Add note in database using: GET /api/notes/AllNote, login required
router.post('/AddNote', fetchUser, [
    body('title', "Enter a valid Title").isLength({ mind: 3 }),
    body('description', "description must be 5 characters").isLength({ mind: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, tag } = req.body
        //Creating a note and saving to database
        const note = await Notes.create({ title, description, tag, user: req.user.id })
        res.status(200).json(note)
    }
    catch (err) {
        console.error(err)
        res.status(500).send("some error occered")
    }
})

//Route: 3 =>
//Updating an existing note using: PUT api/notes/updateNotes, login required
router.put('/updateNote/:id', fetchUser, async (req, res) => {
    try {
        const { title, description, tag } = req.body
        //create a new note Object
        const newNote = {}

        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        //find the note to be updated and update it 
        let note = await Notes.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Not Found")
        }
        if (note.user.toString() !== req.user.id) { return res.status(401).send("Not Allowed") }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note)
    }
    catch (err) {
        console.error(err)
        res.status(500).send("some error occered")
    }
})

//Route: 4 =>
//Deleting a note using: DELETE api/notes/deleteNote, login required
router.delete('/deleteNote/:id', fetchUser, async (req, res) => {
    try {
        //find the note and delete it
        let note = await Notes.findById(req.params.id)
        if (!note) { return res.status(404).send("Not Found") }

        //allow deletion if user owns the note
        if (note.user.toString() !== req.user.id) { return res.status(401).send("Not Allowed") }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.status(200).json({ Success: "Your Note Has Been Deleted", note })
    }
    catch (err) {
        console.error(err)
        res.status(500).send("some error occered")
    }
})

module.exports = router