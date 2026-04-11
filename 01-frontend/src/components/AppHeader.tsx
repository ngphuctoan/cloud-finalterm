import { Container, Navbar, Stack } from "react-bootstrap";
import { FaFolder } from "react-icons/fa";
import UserMenu from "./UserMenu";
import { Link } from "react-router";
import ThemeToggle from "./ThemeToggle";

export default function AppHeader() {
  return (
    <Navbar
      as="header"
      bg="primary"
      data-bs-theme="dark"
      className="mb-5 shadow"
    >
      <Container>
        <Navbar.Brand as={Link} to="/folders" className="fw-bold">
          <FaFolder />{" "}
          <span className="d-none d-sm-inline">&ensp; KeepBin</span>
        </Navbar.Brand>
        <Stack direction="horizontal" gap={2}>
          <ThemeToggle />
          <UserMenu />
        </Stack>
      </Container>
    </Navbar>
  );
}
