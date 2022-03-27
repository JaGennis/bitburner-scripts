/** @param {NS} ns **/
export async function main(ns) {

	async function crime() {

		function moneyPerSec(crime) {
			return ns.getCrimeStats(crime).money * ns.getCrimeChance(crime) / ns.getCrimeStats(crime).time
		}

        function expPerSec(crime) {
            var sumExp = ns.getCrimeStats(crime).charisma_exp + ns.getCrimeStats(crime).defense_exp + ns.getCrimeStats(crime).dexterity_exp
            return (sumExp * ns.getCrimeChance(crime) + (sumExp / 2) * (1 - ns.getCrimeChance(crime))) / ns.getCrimeStats(crime).time
        }

		// var crimes = ["Shoplift", "Rob store", "Mug someone", "Larceny", "Deal Drugs", "Bond Forgery"
	    //		, "Traffick illegal Arms", "Homicide", "Grand theft Auto", "Kidnap and Ransom"
	    //		, "Assassinate", "Heist"]

		var crimes = ["Traffick illegal Arms", "Grand theft Auto", "Kidnap and Ransom" , "Heist"]

		var bestCrime = crimes[0]

		for (var i = 0; i < crimes.length; i++)
			if (moneyPerSec(crimes[i]) > moneyPerSec(bestCrime))
				bestCrime = crimes[i]

		ns.commitCrime(bestCrime)
		await ns.sleep(ns.getCrimeStats(bestCrime).time)
	}

	async function program() {
		var programs = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe",
			"DeepscanV1.exe", "DeepscanV2.exe", "ServerProfiler.exe", "AutoLink.exe"]
		var levels = [50, 100, 250, 500, 750, 75, 400, 75, 25]

		if (ns.getServerMoneyAvailable("home") >= 200000 && !ns.getPlayer().tor)
			ns.purchaseTor()

		if (ns.getPlayer().tor) {
			for (var i = 0; i < ns.getDarkwebPrograms().length; i++) {
				var programCost = ns.getDarkwebProgramCost(ns.getDarkwebPrograms()[i])
				if (!ns.fileExists(ns.getDarkwebPrograms()[i]) && programCost <= ns.getServerMoneyAvailable("home")) {
					ns.purchaseProgram(ns.getDarkwebPrograms()[i])
				}
			}
		}

		for (var i = 0; i < programs.length; i++)
			if (!ns.fileExists(programs[i]) && ns.getHackingLevel() >= levels[i]) {
				ns.createProgram(programs[i], focus())
				while (ns.isBusy())
					await ns.sleep(1000)
			}
	}

	async function faction() {

		function focus() {
			return !ns.getOwnedAugmentations().includes("Neuroreceptor Management Implant")
		}

		function repNeededForFavor(favor) {
			return Math.pow(1.02, (favor - 1)) * 25500 - 25000
		}

		var invitations = ns.checkFactionInvitations()
		for (var i = 0; i < invitations.length; i++) {
			var factionAugs = ns.getAugmentationsFromFaction(invitations[i])
			var ownedAugs = ns.getOwnedAugmentations()
			var unownedAugs = factionAugs.filter(aug => !ownedAugs.includes(aug))
			if (unownedAugs.length > 0)
				ns.joinFaction(invitations[i])
		}

		var cityFactions = ["Sector-12", "Chongqing", "New Tokyo", "Ishima", "Aevum", "Volhaven"]
		for (var i = 0; i < cityFactions.length; i++) {
			var facAugs = (ns.getAugmentationsFromFaction(cityFactions[i])
				.filter(aug => !ns.getOwnedAugmentations().includes(aug)))
			if (facAugs.length > 0) {
				ns.travelToCity(cityFactions[i])
				break
			}
		}

		var crimeFactions = ["Slum Snakes", "Tetrads", "Silhouette", "Speakers for the Dead", "The Dark Army", "The Syndicate"]

		var playerFactions = ns.getPlayer().factions
		for (var i = 0; i < playerFactions.length; i++) {
			var maxRep = Math.max(...ns.getAugmentationsFromFaction(playerFactions[i])
				.map(aug => ns.getAugmentationRepReq(aug)))
			if (maxRep > repNeededForFavor(150) + 100000 && ns.getFactionFavor(playerFactions[i]) < 150)
				var targetRep = repNeededForFavor(150)
			else
				var targetRep = maxRep
			while (ns.getFactionRep(playerFactions[i]) < targetRep) {
				if (ns.workForFaction(playerFactions[i], "Hacking Contracts", focus()))
					await ns.sleep(10000)
				else if (ns.workForFaction(playerFactions[i], "Field Work", focus()))
					await ns.sleep(10000)
				else if (ns.workForFaction(playerFactions[i], "Security Work", focus()))
					await ns.sleep(10000)
				else
					break
			}
		}

		// var bestFactions = ["Bachman...", "Fulcrum"]
	}

	while (true) {
        await program()
		// await faction()
		await crime()
	}
}
