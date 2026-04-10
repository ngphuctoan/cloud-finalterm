import { Form, InputGroup } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { FaSearch } from "react-icons/fa";
import useSearchStore from "../stores/searchStore";

export default function SearchBar() {
  const query = useSearchStore((state) => state.query);
  const setQuery = useSearchStore((state) => state.setQuery);

  return (
    <InputGroup>
      <InputGroupText>
        <FaSearch />
      </InputGroupText>
      <Form.Control
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Tìm kiếm thư mục hoặc tệp tin..."
      />
    </InputGroup>
  );
}
