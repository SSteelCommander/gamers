export const getSavedgameIds = () => {
  const savedgameIds = localStorage.getItem("saved_games")
    ? JSON.parse(localStorage.getItem("saved_games"))
    : [];

  return savedgameIds;
};

export const savegameIds = (gameIdArr) => {
  if (gameIdArr.length) {
    localStorage.setItem("saved_games", JSON.stringify(gameIdArr));
  } else {
    localStorage.removeItem("saved_games");
  }
};

export const removegameId = (gameId) => {
  const savedgameIds = localStorage.getItem("saved_games")
    ? JSON.parse(localStorage.getItem("saved_games"))
    : null;

  if (!savedgameIds) {
    return false;
  }

  const updatedSavedgameIds = savedgameIds?.filter(
    (savedgameId) => savedgameId !== gameId
  );
  localStorage.setItem("saved_games", JSON.stringify(updatedSavedgameIds));

  return true;
};
