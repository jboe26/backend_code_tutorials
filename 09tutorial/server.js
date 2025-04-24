const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Built in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// Built in middleware for json
app.use(express.json());

// Serve Static Files
app.use('/', express.static(path.join(__dirname, '/public')));

// Routes
app.use('/', require('./routes/root'));
app.use('/employees', require('./routes/api/employees'));

app.all(/^\/.+/, (req, res) => {
    res.status(404);

    if (req.accepts('html')) {
        // If the client accepts HTML, serve the 404.html file
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        // If the client accepts JSON, send a JSON response
        res.json({ error: "404 Not Found" });
    } else {
        // Default to plain text if neither HTML nor JSON is acceptable
        res.type('txt').send("404 Not Found");
    }
});


app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    

