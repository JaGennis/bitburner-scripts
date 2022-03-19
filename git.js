/** @param {NS} ns **/
export async function main(ns) {
	ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/hacknet.js", "hacknet.js")
	ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/helper-functions.js", "helper-functions.js")
	ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/propagate.js", "propagate.js")
	ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/routine.js", "routine.js")
	ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/stabilize.js", "stabilize.js")
	ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/upgrade.js", "upgrade.js")

	ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/hwgw.js", "hwgw.js")
	ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/hwgw/hack.js", "/hwgw/hack.js")
	ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/hwgw/weaken.js", "/hwgw/weaken.js")
	ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/hwgw/grow.js", "/hwgw/grow.js")
	ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/hwgw/weaken2.js", "/hwgw/weaken2.js")

	ns.wget("https://raw.githubusercontent.com/JaGennis/bitburner-scripts/main/git.js", "git.js")
}