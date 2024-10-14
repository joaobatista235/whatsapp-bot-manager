import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalOverlay,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Input,
  Image,
  Spinner,
  Textarea,
  Center,
} from "@chakra-ui/react";
import axios from "axios";

import "./Dashboard.css";

const Dashboard = () => {
    const initialRef = React.useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [qrCode, setQrCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nomeEmpresa: "",
        contexto: "",
        chaveAPI: "",
    });

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value,
    });
    };

    const handleSubmit = async () => {
    try {
        setLoading(true);
        const response = await axios.post(
        "http://localhost:3000/api/create-bot",
        {
            companyId: formData.nomeEmpresa,
            context: formData.contexto,
            apiKey: formData.chaveAPI,
        }
        );
        setQrCode(response.data.qrcode);
    } catch (error) {
        console.error(
        "Erro ao criar bot:",
        error.response ? error.response.data : error.message
        );
    }
    };

    return (
    <>
        <nav className="navbar">
        <div className="navbar-logo">LOGO</div>
        <ul className="navbar-menu">
            <li>
            <Button onClick={onOpen}>Criar bot de Whatsapp</Button>
            </li>
        </ul>
        </nav>

        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Criar bot</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
            <FormControl isRequired>
                <FormLabel>Nome da empresa</FormLabel>
                <Input
                ref={initialRef}
                placeholder="Nome da empresa"
                name="nomeEmpresa"
                value={formData.nomeEmpresa}
                onChange={handleInputChange}
                />
            </FormControl>

            <FormControl mt={4} isRequired>
                <FormLabel>Contexto</FormLabel>
                <Textarea
                placeholder="Contexto"
                name="contexto"
                value={formData.contexto}
                onChange={handleInputChange}
                rows={12}
                />
            </FormControl>

            <FormControl mt={4} isRequired>
                <FormLabel>Chave da OpenAI API</FormLabel>
                <Input
                placeholder="Chave da OpenAI API"
                name="chaveAPI"
                value={formData.chaveAPI}
                onChange={handleInputChange}
                />
            </FormControl>

            <FormControl mt={4}>
                <FormLabel>QR Code:</FormLabel>
                <Center>
                {loading ? (
                    <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                    />
                ) : (
                    qrCode && <Image src={`${qrCode}`} alt="QR Code" />
                )}
                </Center>
            </FormControl>
            </ModalBody>
            <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                Criar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
    </>
    );
};

export default Dashboard;
