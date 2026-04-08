import BlogCard from "@/components/blog-card";
import { getAllBlogs } from "@/lib/api";
import { Col, Row } from "react-bootstrap";

export default function Blog() {
  const allBlogs = getAllBlogs();

  return (
    <Row md={2} lg={3}>
      {allBlogs.map((blog, i) => (
        <Col key={i}>
          <BlogCard blog={blog} />
        </Col>
      ))}
    </Row>
  );
}
