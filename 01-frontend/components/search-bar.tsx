import { Form, InputGroup } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function SearchBar({ folderName }: { folderName?: string }) {
  return (
    <InputGroup>
      <InputGroupText>
        <FaMagnifyingGlass />
      </InputGroupText>
      <Form.Control
        placeholder={
          folderName
            ? `Tìm kiếm trong thư mục "${folderName}"...`
            : "Tìm kiếm..."
        }
      />
    </InputGroup>
  );
}
