const fetch = require("../_interceptFetch");

export default async function getMusics(req,res){
    try {
        const getSearchedSongs = await fetch(
          `${process.env.BACKEND_API_URL}?q=search&t=${req.query.musicName}`
        );
    
        res.send(getSearchedSongs.results.filter(item => item.type === 'song'));
      } catch (e) {
        if (e.message) {
          res.send(e);
        };
      }
}