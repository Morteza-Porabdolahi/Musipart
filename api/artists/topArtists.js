const fetch = require("../_interceptFetch");

export default async function getTopArtists(_,res){
    try {
        const topArtists = await fetch(`${process.env.BACKEND_API_URL}?q=trend`);
    
        res.send(topArtists.results);
      } catch (e) {
        if (e) console.log(e);
        res.send(e);
      }
}