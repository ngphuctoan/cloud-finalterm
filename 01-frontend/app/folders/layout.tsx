import Header from "@/components/header";
import { Container } from "react-bootstrap";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <Container>{children}</Container>
    </>
  );
}
