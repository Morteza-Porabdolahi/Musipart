const fetch = require("../../_interceptFetch");

export default async function fetchMusic(_,res){
    try {
        const weeklyMusics = await fetch(`${process.env.BACKEND_API_URL}?q=week`);
    
        res.send(weeklyMusics.results);
      } catch (e) {
        if (e.message) {
          res.send(e);
        };
      }
}