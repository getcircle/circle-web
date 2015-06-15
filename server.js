// This is a server that just lets you view static files
// and respects push state much in the same way divshot would
import express from 'express';
var app = express();

app.use(require('compression')());
app.use(require('body-parser')());
app.use(require('method-override')());
app.use(express.static(__dirname));
app.use(require('morgan')(':method :url - :status(:response-time ms)'));

app.get('*', function(request, response) {
    response.sendfile('./index.html');
});

var server = app.listen(9110, function() {
    console.log('Listening on port %d', server.address().port);
});
