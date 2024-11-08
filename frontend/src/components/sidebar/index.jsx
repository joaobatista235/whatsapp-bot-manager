import { Box, IconButton, Link, VStack } from "@chakra-ui/react";
import {
  FaBezierCurve,
  FaCalendarAlt,
  FaCommentDots,
  FaHome,
  FaPortrait,
  FaSignOutAlt,
  FaWrench,
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/models/authSlice";
import { Div } from "../../styles/style";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const SidebarItem = ({ icon, label, to, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  console.log(location.pathname === to);

  return (
    <Box
      width="100%"
      borderRadius="4px"
      bg={isActive ? "#003e51" : null}
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
};

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
        <Div $fullWidth justify="center" margin="0 0 24px 0">
          <Avatar size={64} icon={<UserOutlined />} />
        </Div>
        <SidebarItem icon={<FaHome />} label="Dashboard" to="/dashboard" />
        <SidebarItem icon={<FaCommentDots />} label="Conversas" to="/chats" />
        <SidebarItem icon={<FaPortrait />} label="Contatos" to="/contacts" />
        <SidebarItem icon={<FaCalendarAlt />} label="Agenda" to="/agenda" />
        <SidebarItem icon={<FaBezierCurve />} label="Fluxos" to="/flow" />

        <SidebarItem icon={<FaWrench />} label="Configurações" to="/settings" />
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
