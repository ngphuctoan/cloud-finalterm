import { Container, Navbar, Stack } from "react-bootstrap";
import { FaFolder } from "react-icons/fa";
import UserMenu from "./UserMenu";
import type { CSSProperties } from "react";
import { Link } from "react-router";
import ThemeToggle from "./ThemeToggle";

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
        <Navbar.Brand as={Link} to="/folders" className="fw-bold">
          <FaFolder /> &ensp; KeepBin
        </Navbar.Brand>
        <Stack direction="horizontal" gap={2}>
          <ThemeToggle />
          <UserMenu />
        </Stack>
      </Container>
    </Navbar>
  );
}
