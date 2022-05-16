const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const _Join_Conversation_User = require('./_join_conversation_user');

// associations

User.belongsToMany(Conversation, {through: _Join_Conversation_User});
Conversation.belongsToMany(User, {through: _Join_Conversation_User});
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message
};
