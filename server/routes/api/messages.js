const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const { Op } = require("sequelize");

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

router.put('/update', async(req,res,next) => {
  try {
    const { conversationId, userIds, myUnseen} = req.body;
    if (!req.user || !userIds.includes(req.user.id)) {
      return res.sendStatus(401);
    }
    const veiwerId = req.user.id;
    const messages = await Message.update(
      {
        viewed: true
      },
      {
        where: {
          conversationId: conversationId,
          senderId: {
            [Op.not]: veiwerId
          },
        },
        returning: true
      }
    ).then(async function(result) {
      const convo = await Conversation.findOne({where: {id: conversationId}})
      convo.set({unseen: convo.unseen.filter(el => !myUnseen.includes(el))})
      convo.save()
    })
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

module.exports = router;
