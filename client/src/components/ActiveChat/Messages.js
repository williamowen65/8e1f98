import React from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  let userLastMessageIdx;
  for(let i = messages.length - 1; i > 0; i--){
    if(messages[i].senderId === userId){
      userLastMessageIdx = i;
      break;
    }
  }

  return (
    <Box>
      {messages.map((message, i) => {
        const time = moment(message.createdAt).format('h:mm');
        const isLatestMsg = userLastMessageIdx === i
        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} otherUser={otherUser} isLatestMsg={isLatestMsg} viewed={message.viewed}/>
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
