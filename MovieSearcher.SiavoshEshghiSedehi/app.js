const express = require ("express");
const app = express();
const request = require ('request');
const port = process.env.PORT || "8888";
const path = require("path");

app.use(express.static('public'));
app.set("view engine", "ejs");

// searched movies

app.get("/resultsList", (req,res)=>{
  movies_serached = req.query.title;

  if(movies_serached==undefined){
    res.render("search");
    return;}

  var URL = "http://www.omdbapi.com/?s=" + movies_serached + "&apikey=d4a5e72a"
  request (URL, (err, response, body)=>{
    if(!err && response.statusCode == 200){
      var list = JSON.parse(body);


      //console.log(list);

      if(list["Search"]==undefined){
        res.render("search", {status:false});
        return;
      }
      res.render("resultsList", {
        list: list,
        search: movies_serached
      });
    }
  });
});

//for movies Details:

app.get("/movie/:id", (req,res)=>{
  var movID = req.params.id;

  if(movID==undefined){
    res.render("search", {status:false});
    return;
  }

	var URL = "http://www.omdbapi.com/?i=" + movID + "&plot=full&apikey=d4a5e72a"

  request(URL, (err, response, body)=>{

    if(!err && response.statusCode==200){
			var data = JSON.parse(body);
			if(data == undefined){
				//search error
				res.render("search", {status: false});

				return;
			}

      
			res.render("movie", { movie: data });
		};
	});
  });


//reviews

app.get("/movie", (req,res)=>{

  movies_serached = req.query.title;
  console.log(movies_serached);

  if(movies_serached==undefined){
    res.render("search");
    return;}

    var URL = "https://api.nytimes.com/svc/movies/v2/reviews//picks.json?query=" + movies_serached+ "&api-key=SAm28QH9Ffw4Z7ZYxPUYztRRfmKytI8U"
    request (URL, (err, response, body)=>{
      if(!err && response.statusCode == 200){
        var review = JSON.parse(body);
        
        console.log(review);
        

        if(review["results"] == undefined){
          //search error
          res.render("search", {status: false});
  
          return;
        }

        res.render("reviews", { review: review });
       
  
       
      };
    });
  });












//main page
app.get("/", (req,res)=>{
  res.render("search", {status:true});

});


//invalid routs
app.get("*", (req, res)=>{
  res.render("error");
})

app.listen(port, ()=>{
  console.log(`Listening on http://localhost:${port}`);
});