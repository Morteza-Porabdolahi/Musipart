export default async function (...args) {
    const [url, options] = args;
  
    const response = await fetch(url, {
      ...options,
    });

    if (response.status >= 200 && response.status <= 299 && response.ok) {
      return response.json();
    } else if(response.status >= 400 && response.status <= 499) {
      throw Error(`There is a problem with your network connection !`);
    }else{
      throw Error(response.statusText);
    }
  }