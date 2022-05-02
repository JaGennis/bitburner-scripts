/** @param {NS} ns **/
export async function main(ns) {
	const scripts = [ "augs", "backdoor", "contracts", "git", "hacknet",
        "helper-functions", "hwgw", "propagate", "routine", "stabilize",
        "stocks", "upgrade", "/hwgw/weaken2", "/hwgw/grow", "/hwgw/hack",
        "/hwgw/weaken", "/hwgw/dummy.js"]

	for (let script of scripts.map(script => script + ".js"))
		await ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/" + script, script)
}