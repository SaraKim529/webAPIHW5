var Usergrid = require('usergrid');
var express = rquire('express');

var dataClient = new Usergrid.client({
	orgName:'SaraKim',
	appName:'sandbox',
});

var app = express();
var router = express.Router();

app.use(bodyParser.json());	// Parse body response as json

var options1 = {
    type:'movies'	// endpoint to collection
};

router.route('/movies').get(function(request,response) {
	dataClient.createCollection(options1, function(error, movies) {
			if(error){
				// Error
			}

			else {
				// If review == true in query parameters
				// Also GET movie reviews
				if(request.query.review == "true")
				{
					// main movie collection
					var main_collection = {
						type:'movies'
					};
					// review collection that will be connected
					var connected_collection = {
						type:'reviews'
					};
					// relationship that connects the collection is "name" of movie
					var relationship = 'name';

						Usergrid.connect(main_collection, relationship, connected_collection, function(error, result) {
							if(error) {
								// error connecting
							}
							else {
								var reviewResponse = response.json(result);
								response.end();
							}
						});
				}
				else {
					var movieArr = [];		// Create array to hold whole collection
						// While next entity in movie collection exists, 
						// continue pusing into array
						while(movies.hasNextEntity()) {
							movieArr.push(movies.getNextEntity().get());
						}
					response.json(movieArr);	// Send movieArray content as json body response
					response.end();
				}

			}
	});

});


router.route('/movies/:name').get(function(request,response)  {
	var options2 = {
        type: 'movies', 
	    //uuid:request.params.id
	};
	
	dataClient.createEntity(options2, function(error, movie) {
		if(error) {
            //error
		}
		else {
			response.json(movie.get());
			response.end();
		}
	});

});

app.use('',router);