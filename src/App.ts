
export class App {
	public hello(compiler: string) {
    	console.log(`Hello from ${compiler}`);

    	const elt = document.getElementById("greeting");
    	elt.innerText = `Hello from ${compiler}`;
	}
}