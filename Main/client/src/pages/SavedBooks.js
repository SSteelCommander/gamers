import React from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";

import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { REMOVE_game } from "../utils/mutations";
import { removegameId } from "../utils/localStorage";

import Auth from "../utils/auth";

const Savedgames = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const [removegame, { error }] = useMutation(REMOVE_game);

  const userData = data?.me || {};

  // create function that accepts the game's mongo _id value as param and deletes the game from the database
  const handleDeletegame = async (gameId) => {
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removegame({
        variables: { gameId },
      });

      // upon success, remove game's id from localStorage
      removegameId(gameId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing {userData.username}'s games!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedgames?.length
            ? `Viewing ${userData.savedgames.length} saved ${
                userData.savedgames.length === 1 ? "game" : "games"
              }:`
            : "You have no saved games!"}
        </h2>
        <div>
          <Row>
            {userData.savedgames?.map((game) => {
              return (
                <Col md="4">
                  <Card key={game.gameId} border="dark">
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
                      <Button
                        className="btn-block btn-danger"
                        onClick={() => handleDeletegame(game.gameId)}
                      >
                        Delete this game!
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      </Container>
    </>
  );
};

export default Savedgames;
