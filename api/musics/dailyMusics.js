const fetch = require("../_interceptFetch");

export default async function getDailyMusics(_,res){
    try {
        const dailyMusics = await fetch(`${process.env.BACKEND_API_URL}?q=day`);
    
        res.send(dailyMusics.results);
      } catch (e) {
       if (e.message) {
          res.send(e);
        };
      }
}