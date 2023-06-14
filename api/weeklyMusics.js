export default async function fetchMusic(_,res){
    try {
        const weeklyMusics = await fetch(`${BACKEND_API_URL}?q=week`);
    
        res.send(weeklyMusics.results);
      } catch (e) {
        if (e) console.log(e);
        res.send(e);
      }
}