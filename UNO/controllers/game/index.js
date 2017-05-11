

const package = msg => {
  const toUser = 'Private data to player you' + JSON.stringify(msg);
  const toGroup = 'Share data to your group' + JSON.stringify(msg);

  return {player: toUser, group: toGroup};
};

module.exports = package;