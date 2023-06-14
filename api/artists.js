export default async function getArtists(req,res){
    try {
        const allArtists = await fetch(
          `${BACKEND_API_URL}?q=search&t=${req.query.artist}`
        );
        
        res.send(allArtists.results.filter(item => item.type === 'artist'));
      } catch (e) {
        if (e) console.log(e);
        res.send(e);
      }
}