
const router = require("express").Router()
const Message = require("../models/Message")


router.post("/", async (req, res) => {
    try {

        const newMessage = new Message(req.body);

        await newMessage.save();

        res.status(200).json(newMessage)

    } catch(err) {
        res.status(500).json(err);
    }

});

router.get("/:conversationId", async (req, res) => {
    try {

        const messages = await Message.find({conversationId: req.params.conversationId});

        res.status(200).json(messages)

    } catch(err) {
        res.status(500).json(err);
    }

});

module.exports = router;