export default async function getMusic(req,res){
    try {
        const allArtistDatas = await fetch(
          `${BACKEND_API_URL}?q=search&t=${req.query.artist}`
        );
    
        const filterArtistMusics = allArtistDatas.results.filter(
          (item) => item.type === "song"
        );
    
        res.send(filterArtistMusics);
      } catch (e) {
        if (e) console.log(e);
        res.send(e);
      }
}
