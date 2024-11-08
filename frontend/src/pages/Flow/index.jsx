import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { Typography, Button, Modal, Input } from "antd";

const { Title } = Typography;

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Iniciar Instruções" },
    position: { x: 250, y: 0 },
  },
  {
    id: "2",
    data: { label: "Passo 1: Verificar Dados" },
    position: { x: 100, y: 100 },
  },
  {
    id: "3",
    data: { label: "Passo 2: Tomar Ação" },
    position: { x: 400, y: 100 },
  },
  {
    id: "4",
    type: "output",
    data: { label: "Finalizar" },
    position: { x: 250, y: 200 },
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [newLabel, setNewLabel] = useState("");

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  // Função para adicionar um novo nó
  const addNode = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      data: { label: `Novo Nó ${nodes.length + 1}` },
      position: { x: Math.random() * 400, y: Math.random() * 200 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Função para exibir modal de edição
  const onNodeDoubleClick = (event, node) => {
    setSelectedNode(node);
    setNewLabel(node.data.label);
    setIsModalVisible(true);
  };

  // Função para salvar a edição do nó
  const handleOk = () => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: { ...node.data, label: newLabel },
          };
        }
        return node;
      })
    );
    setIsModalVisible(false);
    setSelectedNode(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedNode(null);
  };

  return (
    <>
      <Title level={2}>Fluxos</Title>
      <Button type="primary" onClick={addNode} style={{ marginBottom: 16 }}>
        Adicionar Novo Item
      </Button>
      <div
        style={{
          width: "calc(100% - 32px)",
          height: "calc(100% - 100px)",
          padding: "16px",
          borderRadius: "8px",
          backgroundColor: "white",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={onNodeDoubleClick}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>

      <Modal
        title="Editar Nó"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Digite o novo rótulo do nó"
        />
      </Modal>
    </>
  );
}

export default Flow;
