import { Container, Navbar } from "react-bootstrap";
import { FaFolder } from "react-icons/fa";
import UserMenu from "./UserMenu";
import type { CSSProperties } from "react";

export default function AppHeader() {
  return (
    <Navbar
      as="header"
      bg="primary"
      data-bs-theme="dark"
      className="mb-4"
      style={
        {
          "--bs-navbar-padding-y": "0.5rem",
        } as CSSProperties
      }
    >
      <Container>
        <Navbar.Brand href="#" className="fw-bold">
          <FaFolder /> &ensp; KeepBin
        </Navbar.Brand>
        <UserMenu />
      </Container>
    </Navbar>
  );
}
