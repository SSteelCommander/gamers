import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_game = gql`
  mutation savegame($gameData: gameInput!) {
    savegame(gameData: $gameData) {
      _id
      username
      email
      savedgames {
        gameId
        authors
        image
        description
        title
        link
      }
    }
  }
`;

export const REMOVE_game = gql`
  mutation removegame($gameId: ID!) {
    removegame(gameId: $gameId) {
      _id
      username
      email
      savedgames {
        gameId
        authors
        image
        description
        title
        link
      }
    }
  }
`;
