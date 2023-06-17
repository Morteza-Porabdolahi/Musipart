export default async function (...args) {
    const [url, options] = args;
  
    const response = await fetch(url, {
      ...options,
    });

    if (response.status >= 200 && response.status <= 299 && response.ok) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  }