export default async function getNewMusics(_,res){
    try {
        const newMusics = await fetch(`${BACKEND_API_URL}?q=new`);
    
        res.send(newMusics.results);
      } catch (e) {
        if (e) console.log(e);
        res.send(e);
      }
}