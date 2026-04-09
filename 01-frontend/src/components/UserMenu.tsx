import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dropdown, Spinner } from "react-bootstrap";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { logout } from "../actions";
import { useContext } from "react";
import UserContext from "../contexts/UserContext";

export default function UserMenu() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["auth"],
      });
      window.location.href = data.url;
    },
  });

  const user = useContext(UserContext);

  return (
    <Dropdown>
      <Dropdown.Toggle>
        <FaUser /> {user?.username || <Spinner size="sm" />}
      </Dropdown.Toggle>
      <Dropdown.Menu data-bs-theme="light">
        <Dropdown.Item onClick={() => mutation.mutate()}>
          <FaSignOutAlt /> Đăng xuất
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
