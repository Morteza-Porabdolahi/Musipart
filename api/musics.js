export default async function getMusics(req,res){
    try {
        const getSearchedSongs = await fetch(
          `${BACKEND_API_URL}?q=search&t=${req.query.q}`
        );
    
        res.send(getSearchedSongs.results.filter(item => item.type === 'song'));
      } catch (e) {
        if (e) console.log(e);
        res.send(e);
      }
}