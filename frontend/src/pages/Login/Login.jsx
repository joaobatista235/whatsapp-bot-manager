import {
  Button,
  Input,
  FormLabel,
  FormControl,
  InputRightElement,
  InputGroup,
  ButtonGroup,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";

import { useState } from "react";
import { login } from "../../redux/models/authSlice";
import { BsEyeSlash } from "react-icons/bs";
import { BsEyeSlashFill } from "react-icons/bs";
import { Div } from "../../styles/style";
import { TODO } from "./style";

const Login = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [show, setShow] = useState(false);

  const handleLogin = async () => {
    dispatch(login(formData.email, formData.password));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Div
      $fullWidth
      $fullHeight
      justify={"center"}
      align={"center"}
      $backgroundColor={"#026887"}
    >
      <TODO
        direction={"column"}
        width={"400px"}
        gap={"16px"}
        padding={"32px"}
        $backgroundColor={"white"}
      >
        <h2 style={{ fontWeight: "bold", fontSize: "2rem" }}>Logar</h2>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            value={formData.email}
            onChange={handleInputChange}
            name="email"
            placeholder="email"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Senha</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              name="password"
              placeholder="senha"
            />
            <InputRightElement width="4.5rem">
              {show ? (
                <BsEyeSlash onClick={() => setShow((prev) => !prev)} cursor="pointer" />
              ) : (
                <BsEyeSlashFill onClick={() => setShow((prev) => !prev)} cursor="pointer" />
              )}
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <ButtonGroup
          marginTop={"16px"}
          width={"100%"}
          justifyContent={"space-between"}
        >
          <Button colorScheme="red" onClick={handleLogin}>
            Cancelar
          </Button>
          <Button colorScheme="green" onClick={handleLogin}>
            Entrar
          </Button>
        </ButtonGroup>
      </TODO>
    </Div>
  );
};

export default Login;
