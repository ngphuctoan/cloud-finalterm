"use client";

import { Blog } from "@/types/blog";
import Link from "next/link";
import {
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
} from "react-bootstrap";

export default function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Card
      as={Link}
      href={`/blog/${blog.slug}`}
      className="link-underline link-body-emphasis link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover"
      style={{ minHeight: 200 }}
    >
      <CardBody>
        <CardTitle>{blog.title}</CardTitle>
        <CardSubtitle className="mb-3 text-body-secondary">
          {blog.author} &bull; {blog.date.toLocaleDateString()}
        </CardSubtitle>
        <CardText>{blog.preview}</CardText>
      </CardBody>
    </Card>
  );
}
