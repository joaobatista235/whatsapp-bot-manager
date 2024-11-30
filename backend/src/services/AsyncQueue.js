// AsyncQueue.js
export default class AsyncQueue {
  constructor() {
    this.items = [];
    this.isProcessing = false;
    this.pendingPromises = []; // Armazena as promessas pendentes
  }

  // Adiciona uma função assíncrona à fila
  enqueue(fn) {
    this.items.push(fn);
    if (!this.isProcessing) {
      this.processQueue(); // Inicia o processamento da fila se não estiver processando
    }
  }

  // Processa a fila, executando as funções assíncronas uma por uma
  async processQueue() {
    if (this.isProcessing) return; // Se já estiver processando, não faz nada
    this.isProcessing = true;

    // Executa as funções assíncronas uma por vez
    while (this.items.length > 0) {
      const currentItem = this.items.shift(); // Pega o próximo item da fila
      try {
        await currentItem(); // Executa a função assíncrona e aguarda sua resolução
      } catch (error) {
        console.error("Erro ao executar a tarefa:", error);
      }
    }

    this.isProcessing = false; // Termina o processamento quando a fila estiver vazia
  }

  // Verifica se a fila está vazia
  isEmpty() {
    return this.items.length === 0;
  }

  // Limpa todos os itens da fila
  clear() {
    this.items = [];
  }

  // Retorna o tamanho da fila
  size() {
    return this.items.length;
  }

  // Pausa o processamento da fila
  pause() {
    this.isProcessing = false;
  }

  // Retoma o processamento da fila
  resume() {
    if (!this.isProcessing) {
      this.processQueue(); // Retoma o processamento da fila
    }
  }

  // Executa uma tarefa manualmente, sem adicionar à fila
  async execute(fn) {
    try {
      await fn();
    } catch (error) {
      console.error("Erro ao executar a tarefa:", error);
    }
  }

  // Exibe as tarefas pendentes
  getPending() {
    return this.items.length;
  }
}
