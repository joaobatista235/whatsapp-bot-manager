const errorHandler = (err, req, res, next) => {
    console.log("AAA")
    console.error(err.stack);

    const status = err.status || 500;
    const message = err.message || 'Algo deu errado.';

    res.status(status).json({
        status: 'error',
        statusCode: status,
        message: message,
    });
};

module.exports = errorHandler;
