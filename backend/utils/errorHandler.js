// anywhere i use this, i can eliminate the try/catch block, and write a more pure if/else, knowing that server.js 
// is giving errors to my errorhandler, because my asynchandler is sending them to it

const errorHandler = (err, req, res, next) => {
    // Sometimes errors come with a 200 status code by mistake; we want to ensure it's a 500 if it's a server crash
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
  
    // Handle Mongoose "CastError" (e.g., someone sends a fake ID)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      statusCode = 404;
      message = 'Resource not found';
    }
  
    res.status(statusCode).json({
      message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  export { errorHandler };