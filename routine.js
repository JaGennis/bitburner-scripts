/** @param {NS} ns **/
export async function main(ns) {

	ns.disableLog("ALL")

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

		var crimes = ["Mug someone"]

		var bestCrime = crimes[0]

		for (var i = 0; i < crimes.length; i++)
			if (moneyPerSec(crimes[i]) > moneyPerSec(bestCrime))
				bestCrime = crimes[i]

		ns.commitCrime(bestCrime)
		await ns.sleep(ns.getCrimeStats(bestCrime).time)
	}

	async function program() {
		if (ns.getServerMoneyAvailable("home") >= 200000 && !ns.getPlayer().tor) {
			ns.purchaseTor()
			ns.print("Bought Tor server")
		}

		if (ns.getPlayer().tor) {
			for (let program of ns.getDarkwebPrograms())
				if (!ns.fileExists(program)
					&& ns.getDarkwebProgramCost(program) <= ns.getServerMoneyAvailable("home")) {
					ns.purchaseProgram(program)
					ns.print("Bought program " + program)
				}
		}
	}

	async function faction() {

		function focus() {
			return !ns.getOwnedAugmentations().includes("Neuroreceptor Management Implant")
		}

		function repNeededForFavor(favor) {
			return Math.pow(1.02, (favor - 1)) * 25500 - 25000
		}

		// function hasUnownedAugs(faction) {
		// return ns.getAugmentationsFromFaction(faction)
		// .filter(aug => !ns.getOwnedAugmentations().includes(aug))
		// .length > 0
		// }

		function isInterestingFaction(faction) {
			const reachableAugs = [... new Set(
				ns.getPlayer()
					.factions
					.map(fac => ns.getAugmentationsFromFaction(fac))
					.flat(Infinity))]

			return ns.getAugmentationsFromFaction(faction)
				.filter(aug => !ns.getOwnedAugmentations().includes(aug))
				.filter(aug => !reachableAugs.includes(aug))
				.length > 0
				&& !ns.checkFactionInvitations().includes(faction)
		}

		function getLowestCombatStat() {
			const p = ns.getPlayer()
			return Math.min(p.strength, p.defense, p.dexterity, p.agility)
		}

		for (let faction of ns.checkFactionInvitations())
			if (isInterestingFaction(faction)) {
				ns.joinFaction(faction)
				ns.print("Joined faction " + faction)
			}

		var cityFactions = ["Sector-12", "Chongqing", "New Tokyo", "Ishima", "Aevum", "Volhaven"]
		// Implement join order
		for (let faction of cityFactions) {
			if (isInterestingFaction(faction)) {
				ns.travelToCity(faction)
				ns.print("Traveled to city " + faction)
				break
			}
		}

		var crimeFactions = ["Slum Snakes", "Tetrads", "Silhouette", "Speakers for the Dead", "The Dark Army", "The Syndicate"]

		if (isInterestingFaction("Slum Snakes")) {
			if (getLowestCombatStat < 30) {
				ns.commitCrime("Mug someone")
				ns.print("Commiting crimes for Slum Snakes")
			}
		}

		if (isInterestingFaction("Tetrads")) {
			if (getLowestCombatStat < 75) {
				ns.commitCrime("Mug someone")
				ns.print("Commiting crimes for Tetrads")
			}
			ns.travelToCity("Ishima")
			ns.print("Traveled to Ishima")
			while(isInterestingFaction("Tetrads")){
				ns.print("Waiting for invitation to arrive")
				ns.print("Commiting crimes for Tetrads")
				ns.commitCrime("Homicide")
			}
		}

		if (isInterestingFaction("Speakers for the Dead")) {
			if (getLowestCombatStat < 300) {
				ns.commitCrime("Mug someone")
				ns.print("Commiting crimes for Speakers for the Dead")
			}
			if (ns.getPlayer().numPeopleKilled < 30) {
				ns.commitCrime("Homicide")
				ns.print("Commiting crimes for Speakers for the Dead")
			}
		}

		if (isInterestingFaction("The Dark Army")) {
			if (getLowestCombatStat < 300) {
				ns.commitCrime("Mug someone")
				ns.print("Commiting crimes for The Dark Army")
			}
			if (ns.getPlayer().numPeopleKilled < 5) {
				ns.commitCrime("Homicide")
				ns.print("Commiting crimes for The Dark Army")
			}
			ns.travelToCity("Chongqing")
			ns.print("Traveled to Chongqing")
			while(isInterestingFaction("The Dark Army")){
				ns.print("Waiting for invitation to arrive")
				ns.print("Commiting crimes for The Dark Army")
				ns.commitCrime("Homicide")
			}
		}

		if (isInterestingFaction("The Syndicate")) {
			if (getLowestCombatStat < 200) {
				ns.commitCrime("Mug someone")
				ns.print("Commiting crimes for The Dark Army")
			}
			ns.travelToCity("Sector-12")
			ns.print("Traveled to Sector-12")
			while(isInterestingFaction("The Syndicate")){
				ns.print("Waiting for invitation to arrive")
				ns.print("Commiting crimes for The Syndicate")
				ns.commitCrime("Homicide")
			}
		}

		// var boughtAugs = ["DataJack", "Neuralstimulator", "Embedded Netburner Module"]
		var boughtAugs = []

		var playerFactions = ns.getPlayer().factions
		// playerFactions = playerFactions.filter(fac => fac !== "BitRunners")
		for (let faction of ns.getPlayer().factions) {
			// TODO: Filter buyable augs
			var maxRep = Math.max(...ns.getAugmentationsFromFaction(faction)
				.filter(aug => !ns.getOwnedAugmentations().includes(aug))
				.filter(aug => !boughtAugs.includes(aug))
				.map(aug => ns.getAugmentationRepReq(aug)))
			if (maxRep > repNeededForFavor(150) + 110000 && ns.getFactionFavor(faction) < 150)
				var targetRep = repNeededForFavor(150)
			else
				var targetRep = maxRep
			if (ns.getFactionRep(faction) < targetRep) {
				ns.print("Working for faction " + faction)
				if (ns.workForFaction(faction, "Hacking Contracts", focus()))
					await ns.sleep(10000)
				else if (ns.workForFaction(faction, "Field Work", focus()))
					await ns.sleep(10000)
				else if (ns.workForFaction(faction, "Security Work", focus()))
					await ns.sleep(10000)
				else
					break
			}
		}

		// var bestFactions = ["Bachman...", "Fulcrum"]
	}

	while (true) {
		await program()
		await faction()
		// await crime()
	}
}