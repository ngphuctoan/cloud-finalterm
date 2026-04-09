import { Container, Navbar } from "react-bootstrap";
import { FaFolder } from "react-icons/fa";
import UserMenu from "./UserMenu";

export default function AppHeader() {
  return (
    <Navbar as="header" bg="primary" data-bs-theme="dark" className="mb-5 py-2">
      <Container>
        <Navbar.Brand href="#" className="fw-bold">
          <FaFolder /> &ensp; KeepBin
        </Navbar.Brand>
        <UserMenu />
      </Container>
    </Navbar>
  );
}
