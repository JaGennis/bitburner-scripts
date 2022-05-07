/** @param {NS} ns **/
export async function main(ns) {
	const scripts = [ 
		"/hwgw/dummy.js", 
		"/hwgw/grow", 
		"/hwgw/hack",
		"/hwgw/weaken2", 
		"/stock/grow", 
		"/stock/hack",
		"augs", 
		"backdoor", 
		"contracts", 
		"hacknet",
		"hwgw", 
		"hwgw-stock", 
		"propagate", 
		"routine", 
		"stabilize",
		"upgrade", 
        "/hwgw/weaken", 
        "helper-functions", 
        "stocks", 
		"git"]

	for (let script of scripts.map(script => script + ".js"))
		await ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/" + script, script)
}