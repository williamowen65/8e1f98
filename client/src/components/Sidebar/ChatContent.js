import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  unseen: {
    background: '#3A8DFF',
    alignSelf: 'center',
    borderRadius: '50px',
    lineHeight: '25px',
    paddingInline: "8px",
    color: "white"
  }
}));

const ChatContent = ({ conversation }) => {
  const classes = useStyles();

  const { otherUser } = conversation;
  const latestMessageText = conversation.id && conversation.latestMessageText;

  const unseen = conversation.messages.reduce((prev, curr) => {
    if(curr.viewed === false && curr.senderId === otherUser.id){
      return ++prev
    }
    return prev
  }, 0)

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      {unseen > 0 && <Box className={classes.unseen}>{unseen}</Box>}
    </Box>
  );
};

export default ChatContent;
