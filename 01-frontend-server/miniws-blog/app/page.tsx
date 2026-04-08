import Link from "next/link";
import { Col, Container, Row } from "react-bootstrap";

export default function Home() {
  return (
    <>
      <Container
        fluid
        className="p-5 rounded bg-body-secondary text-body-emphasis"
      >
        <Row>
          <Col lg={6}>
            <h1 className="mb-3">Welcome to MiniWS Blog</h1>
            <p className="lead">
              A blog site dedicated to homelabbing, self-hosting, and everything
              in-between! Maximize the fun using only open-source technologies.
            </p>
            <Link href="/blog" className="lead fw-medium link-body-emphasis">
              Check out blog...
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
}
