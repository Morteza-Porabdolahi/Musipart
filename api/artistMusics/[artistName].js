const fetch = require("../_interceptFetch");

export default async function getArtistsMusics(req,res){
    try {
        const allArtistDatas = await fetch(
          `${process.env.BACKEND_API_URL}?q=search&t=${req.query.artistName}`
        );
    
        const filterArtistMusics = allArtistDatas.results.filter(
          (item) => item.type === "song"
        );
    
        res.send(filterArtistMusics);
      } catch (e) {
        if (e.message) {
          res.send(e);
        };
      }
}
