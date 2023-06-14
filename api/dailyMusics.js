export default async function getDailyMusics(_,res){
    try {
        const dailyMusics = await fetch(`${BACKEND_API_URL}?q=day`);
    
        res.send(dailyMusics.results);
      } catch (e) {
        if (e) console.log(e);
        res.send(e);
      }
}