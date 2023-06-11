export async function myFetch(...args) {
	const [url, options] = args;
	console.log(args);
	const response = await fetch(url, {
		...options,
		method: "GET",
		redirect: "follow",
		headers: { "Content-Type": "application/json" }
	});

	if (response.status >= 200 && response.status <= 299 && response.ok) {
		return response.json();
	} else {
		throw Error(`An error occurred with status ${response.status}`);
	}
}
