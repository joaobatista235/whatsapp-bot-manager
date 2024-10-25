import { Box, IconButton, Link, VStack } from "@chakra-ui/react";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/models/authSlice";

const SidebarItem = ({ icon, label, to, onClick }) => (
  <Box
    width="100%"
    borderRadius="4px"
    _hover={{
      bg: "#003e51",
      transition: "0.32s",
    }}
    display="flex"
    alignItems="center"
  >
    <NavLink
      to={to}
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", width: "100%" }}
    >
      <IconButton
        _hover={{}}
        icon={icon}
        aria-label={label}
        variant="ghost"
        color="white"
      />
      <Link ml={2} style={{ textDecoration: "none" }} color="white">
        {label}
      </Link>
    </NavLink>
  </Box>
);

const Sidebar = () => {
  const dispatch = useDispatch();

  return (
    <Box
      as="nav"
      pos="fixed"
      left="0"
      top="0"
      w="60"
      h="100vh"
      bg="#026887"
      color="white"
      px="4"
      py="5"
    >
      <VStack spacing={2} align="start">
        <SidebarItem icon={<FaHome />} label="Dashboard" to="/dashboard" />
        <SidebarItem
          icon={<FaSignOutAlt />}
          label="Logout"
          to="/logout"
          onClick={() => dispatch(logout())}
        />
      </VStack>
    </Box>
  );
};

export default Sidebar;
