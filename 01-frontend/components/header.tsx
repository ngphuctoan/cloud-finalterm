"use client";

import Link from "next/link";
import {
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Navbar,
  NavbarBrand,
} from "react-bootstrap";
import { FaFolder, FaSignOutAlt, FaUser } from "react-icons/fa";

export default function Header() {
  return (
    <Navbar as="header" bg="primary" data-bs-theme="dark" className="mb-5 py-2">
      <Container>
        <NavbarBrand as={Link} href="#" className="fw-bold">
          <FaFolder />
          &ensp; KeepBin
        </NavbarBrand>
        <Dropdown>
          <DropdownToggle>
            <FaUser /> admin
          </DropdownToggle>
          <DropdownMenu data-bs-theme="light">
            <DropdownItem>
              <FaSignOutAlt /> Đăng xuất
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Container>
    </Navbar>
  );
}
