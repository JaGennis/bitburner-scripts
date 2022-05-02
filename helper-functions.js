/** @param {NS} ns **/

export function root(ns, server) {
	if (ns.fileExists("BruteSSH.exe"))
		ns.brutessh(server)
	if (ns.fileExists("FTPCrack.exe"))
		ns.ftpcrack(server)
	if (ns.fileExists("relaySMTP.exe"))
		ns.relaysmtp(server)
	if (ns.fileExists("HTTPWorm.exe"))
		ns.httpworm(server)
	if (ns.fileExists("SQLInject.exe"))
		ns.sqlinject(server)
	ns.nuke(server)
}

export function getAvailThreads(ns, script, server) {
	var availRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
	return availRam / ns.getScriptRam(script)
}

export function getAvailHacks(ns) {
	var hackScripts = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"]
	var availHacks = 0;

	for (var i = 0; i < hackScripts.length; i++)
		if (ns.fileExists(hackScripts[i]))
			availHacks++;
	return availHacks;
}

export function getAllServers(ns) {
	var allServers = ["home"]
	function collect(server) {
		var scannedServers = ns.scan(server)
		var toScan = []

		for (var i = 0; i < scannedServers.length; i++) {
			if (!allServers.includes(scannedServers[i])) {
				allServers.push(scannedServers[i]);
				toScan.push(scannedServers[i])
			}
		}
		for (var i = 0; i < toScan.length; i++)
			collect(toScan[i])
	}
	collect("home")
	return allServers
}

export function getBestServer(ns) {
	return getAllServers(ns).filter(server => ns.hasRootAccess(server))
			.sort(function (a, b) { return getFreeRam(ns, b) - getFreeRam(ns, a)})[0]
}

export function getFreeRam(ns, server) {
	return ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
}

export async function main(ns) {

}