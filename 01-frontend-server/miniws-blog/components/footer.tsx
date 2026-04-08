import Link from "next/link";
import { Col, Container, Row } from "react-bootstrap";
import { BsGithub } from "react-icons/bs";

export default function Footer() {
  return (
    <Container as="footer">
      <Row className="py-3 mx-4 border-top">
        <Col className="text-body-secondary">
          &copy; {new Date().getFullYear()} MiniWS
        </Col>
        <Col xs="auto">
          <Link
            href="https://github.com/ngphuctoan/cloud-finalterm"
            className="text-body-secondary"
          >
            <BsGithub size={24} />
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
