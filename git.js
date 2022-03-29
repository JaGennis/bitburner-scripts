/** @param {NS} ns **/
export async function main(ns) {
	const scripts = [ "backdoor", "contracts", "git", "hacknet",
        "helper-functions", "hwgw", "propagate", "routine", "stabilize",
        "upgrade", "/hwgw/weaken2", "/hwgw/grow", "/hwgw/hack", "/hwgw/weaken"]

	for (let script of scripts.map(script => script + ".js"))
		await ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/" + script, script)
}
