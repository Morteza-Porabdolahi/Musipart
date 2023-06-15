const fetch = require("../../_interceptFetch");

export default async function getArtists(req,res){
    try {
        const searchedArtists = await fetch(
          `${process.env.BACKEND_API_URL}?q=search&t=${req.query.artistName}`
        );
        
        res.send(searchedArtists.results.filter(item => item.type === 'artist'));
      } catch (e) {
        if (e.message) {
          res.send(e);
        };
      }
}