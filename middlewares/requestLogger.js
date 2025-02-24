const requestLogger = (req, res, next) => {
  const start = Date.now(); // Start time

  res.on("finish", () => {
    // Event listener for response finish
    const duration = Date.now() - start; // Calculate duration
    console.log(
      `${req.method} ${req.originalUrl} ` +
        `Status: ${res.statusCode} - ${duration}ms`,
    );
  });

  next();
};

export default requestLogger;
