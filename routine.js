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

		function hasInterestingAugs(faction) {
			const reachableAugs = [... new Set(
				ns.getPlayer()
					.factions
					.map(fac => ns.getAugmentationsFromFaction(fac))
					.flat(Infinity))]

			return ns.getAugmentationsFromFaction(faction)
				.filter(aug => !ns.getOwnedAugmentations().includes(aug))
				.filter(aug => !reachableAugs.includes(aug))
				.length > 0
		}

		function isInterestingFaction(faction) {
			return hasInterestingAugs(faction) && !ns.checkFactionInvitations().includes(faction)
		}

		function getLowestCombatStat() {
			const p = ns.getPlayer()
			return Math.min(p.strength, p.defense, p.dexterity, p.agility)
		}


		for (let faction of ns.checkFactionInvitations()) {
			if (hasInterestingAugs(faction)) {
				ns.joinFaction(faction)
				ns.print("Joined faction " + faction)
			}
		}

		const continents = [["Sector-12", "Aevum"], ["Chongqing", "New Tokyo", "Ishima"], ["Volhaven"]]

		for (let continent of continents) {
			if (ns.getPlayer().factions.includes(continent[0]))
				break
			if (isInterestingFaction(continent[0])) {
				for (let city of continent) {
					ns.travelToCity(city)
					ns.print("Waiting for invitation of " + city)
					await ns.sleep(10000)
				}
				break;
			}
		}

		const crimeFactions = [
			{ name: "Slum Snakes", lowStat: 30, kills: 0 },
			{ name: "Tetrads", lowStat: 75, kills: 0, city: "Ishima" },
			{ name: "Speakers for the Dead", lowStat: 300, kills: 30 },
			{ name: "The Dark Army", lowStat: 300, kills: 5, city: "Chongqing" },
			{ name: "The Syndicate", lowStat: 200, kills: 0, city: "Sector-12" }
		]

		for (let faction of crimeFactions) {
			if (isInterestingFaction(faction.name)) {
				if (getLowestCombatStat() < faction.lowStat) {
					ns.commitCrime("Mug someone")
					ns.print("Commiting crimes for " + faction.name)
					await ns.sleep(ns.getCrimeStats("Mug someone").time)
				}
				if (ns.getPlayer().numPeopleKilled < faction.kills) {
					ns.commitCrime("Homicide")
					ns.print("Commiting crimes for " + faction.name)
					await ns.sleep(ns.getCrimeStats("Homicide").time)
				}
				if (faction.city != null
					&& getLowestCombatStat() < faction.lowStat
					&& ns.getPlayer().numPeopleKilled < faction.kills) {
					ns.travelToCity(faction.city)
					ns.print("Traveled to " + faction.city)
					while (isInterestingFaction(faction.name)) {
						ns.print("Waiting for invitation to arrive")
						ns.print("Commiting crimes for " + faction.name)
						ns.commitCrime("Homicide")
						await ns.sleep(ns.getCrimeStats("Homicide").time)
					}
				}
			}
		}

		const companies = ["ECorp", "MegaCorp", "KuaiGong International",
			"Four Sigma", "NWO", "Blade Industries", "OmniTek Incorporated",
			"Bachman & Associates", "Clarke Incorporated", "Fulcrum Technologies"]

		for (let company of companies) {
			let faction = company
			if (company == "Fulcrum Technologies")
				faction = "Fulcrum Secret Technologies"
			if (isInterestingFaction(faction)) {
				ns.applyToCompany(company, "IT")
				if (ns.workForCompany(company, focus())) {
					ns.print("Working for " + company)
					await ns.sleep(10000)
				}
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
	}

	while (true) {
		await program()
		await faction()
		// await crime()
	}
}