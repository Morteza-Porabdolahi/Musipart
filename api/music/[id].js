const fetch = require("../_interceptFetch");

export default async function getMusic(req,res){
    try {
        const specificMusic = await fetch(`${process.env.BACKEND_API_URL}/?q=info&t=${req.query.id}`);
    
        res.send(specificMusic);
      } catch (e) {
        if (e.message) {
          res.send(e);
        };
      }
}