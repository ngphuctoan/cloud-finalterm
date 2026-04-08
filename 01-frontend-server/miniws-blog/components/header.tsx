"use client";

import Link from "next/link";
import { Container, Nav, Navbar } from "react-bootstrap";

export default function Header() {
  return (
    <Navbar
      as="header"
      expand="lg"
      sticky="top"
      className="bg-body-tertiary mb-4"
    >
      <Container>
        <Navbar.Brand as={Link} href="/">
          MiniWS Blog
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <Nav>
            <Nav.Link as={Link} href="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} href="/blog">
              Blog
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
