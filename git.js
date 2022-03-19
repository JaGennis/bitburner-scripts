/** @param {NS} ns **/
export async function main(ns) {
	await ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/hacknet.js", "hacknet.js")
	await ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/helper-functions.js", "helper-functions.js")
	await ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/propagate.js", "propagate.js")
	await ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/routine.js", "routine.js")
	await ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/stabilize.js", "stabilize.js")
	await ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/upgrade.js", "upgrade.js")

	await ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/hwgw.js", "hwgw.js")
	await ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/hwgw/hack.js", "/hwgw/hack.js")
	await ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/hwgw/weaken.js", "/hwgw/weaken.js")
	await ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/hwgw/grow.js", "/hwgw/grow.js")
	await ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/hwgw/weaken2.js", "/hwgw/weaken2.js")

	await ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/git.js", "git.js")
}
