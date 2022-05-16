import React from "react";
import { Badge, Box, Typography } from "@material-ui/core";
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
    margin: "0 10px",
    '& span': {
      transformOrigin: 'center center',
      transform: 'scale(1) translate(0px, 100%)'
    }
  },
  bold: {
    fontWeight: 'bold',
    color: "black"
  }
}));

const ChatContent = ({ conversation, user}) => {
  const classes = useStyles();

  const viewed = conversation?.messages[conversation?.messages?.length - 1]?.viewed
  const isNotMine = conversation?.messages[conversation?.messages?.length - 1]?.senderId !== user.id

  const { otherUser } = conversation;
  const latestMessageText = conversation.id && conversation.latestMessageText;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={`${classes.previewText} ${viewed === false && isNotMine && classes.bold}`}>
          {latestMessageText}
        </Typography>
      </Box>
      <Badge badgeContent={conversation?.myUnseen?.length} color="primary"  className={classes.unseen} />
    </Box>
  );
};

export default ChatContent;
