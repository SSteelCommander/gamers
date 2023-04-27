import React, { useState, useEffect } from "react";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";

import { useMutation } from "@apollo/client";
import { SAVE_game } from "../utils/mutations";
import { savegameIds, getSavedgameIds } from "../utils/localStorage";

import Auth from "../utils/auth";

const Searchgames = () => {
  // create state for holding returned google api data
  const [searchedgames, setSearchedgames] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // create state to hold saved gameId values
  const [savedgameIds, setSavedgameIds] = useState(getSavedgameIds());

  const [savegame, { error }] = useMutation(SAVE_game);

  // set up useEffect hook to save `savedgameIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => savegameIds(savedgameIds);
  });

  // create method to search for games and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/games/v1/volumes?q=${searchInput}`
      );

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { items } = await response.json();

      const gameData = items.map((game) => ({
        gameId: game.id,
        authors: game.volumeInfo.authors || ["No author to display"],
        title: game.volumeInfo.title,
        description: game.volumeInfo.description,
        image: game.volumeInfo.imageLinks?.thumbnail || "",
      }));

      setSearchedgames(gameData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a game to our database
  const handleSavegame = async (gameId) => {
    // find the game in `searchedgames` state by the matching id
    const gameToSave = searchedgames.find((game) => game.gameId === gameId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await savegame({
        variables: { gameData: { ...gameToSave } },
      });
      console.log(savedgameIds);
      setSavedgameIds([...savedgameIds, gameToSave.gameId]);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for games!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a game"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className="pt-5">
          {searchedgames.length
            ? `Viewing ${searchedgames.length} results:`
            : "Search for a game to begin"}
        </h2>
        <Row>
          {searchedgames.map((game) => {
            return (
              <Col md="4">
                <Card key={game.gameId} border="dark" className="mb-3">
                  {game.image ? (
                    <Card.Img
                      src={game.image}
                      alt={`The cover for ${game.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{game.title}</Card.Title>
                    <p className="small">Authors: {game.authors}</p>
                    <Card.Text>{game.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedgameIds?.some(
                          (savedId) => savedId === game.gameId
                        )}
                        className="btn-block btn-info"
                        onClick={() => handleSavegame(game.gameId)}
                      >
                        {savedgameIds?.some(
                          (savedId) => savedId === game.gameId
                        )
                          ? "game Already Saved!"
                          : "Save This game!"}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default Searchgames;
