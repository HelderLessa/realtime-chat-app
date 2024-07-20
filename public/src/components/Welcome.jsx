import React from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";

export default function Welcome({ currentUser }) {
  if (!currentUser) {
    return <div>Loading...</div>;
  }
  return (
    <Container>
      <img src={Robot} alt="Robot" />
      <h1>
        Welcome, <span>{currentUser.username}!</span>
      </h1>
      <h3>Please select a chat to Start Messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  img {
    height: 20rem;
  }
  span {
    color: #4e00ff;
  }
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    h3 {
      width: 100%; // Garante que o h3 ocupe toda a largura disponível
      text-align: center; // Centraliza o texto dentro do h3
    }
  }
`;
