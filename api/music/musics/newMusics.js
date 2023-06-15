const fetch = require("../_interceptFetch");

export default async function getNewMusics(_, res) {
  try {
    const newMusics = await fetch(`${process.env.BACKEND_API_URL}?q=new`);
    
    res.send(newMusics.results);
  } catch (e) {
    if (e.message) {
      res.send(e);
    };
  }
}
