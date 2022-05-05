const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
   
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });

    async function triggerUpdateOnConversation() {
      /* Is there a more direct way to update conversation */ 
      const uid1 = conversation.user1Id
      conversation.user1Id = 0;
      conversation.user1Id = uid1;
      await conversation.save();
    }
    triggerUpdateOnConversation()

    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
