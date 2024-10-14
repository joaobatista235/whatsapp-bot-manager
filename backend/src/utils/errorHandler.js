const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Loga o erro no console

    // Define o status e a mensagem de erro
    const status = err.status || 500;
    const message = err.message || 'Algo deu errado.';

    // Envia a resposta ao cliente
    res.status(status).json({
        status: 'error',
        statusCode: status,
        message: message,
    });
};

module.exports = errorHandler;
