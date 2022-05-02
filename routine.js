/** @param {NS} ns **/
export async function main(ns) {

	ns.disableLog("ALL")

	const workTime = 2000
	const factionTime = 10000

	function focus() {
		return !ns.getOwnedAugmentations().includes("Neuroreceptor Management Implant")
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

	function buyPrograms() {
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

    function upgradeHome() {
        if (ns.getServerMoneyAvailable("home") >= ns.getUpgradeHomeRamCost())
            ns.upgradeHomeRam()
        if (ns.getServerMoneyAvailable("home") >= ns.getUpgradeHomeCoresCost())
            ns.upgradeHomeCores()
    }

	function checkInvitations() {
		for (let faction of ns.checkFactionInvitations()) {
			if (hasInterestingAugs(faction)) {
				ns.joinFaction(faction)
				ns.print("Joined faction " + faction)
			}
		}
	}

	async function cityFaction() {
		const continents = [["Sector-12", "Aevum"], ["Chongqing", "New Tokyo", "Ishima"], ["Volhaven"]]

		for (let continent of continents) {
			if (ns.getPlayer().factions.includes(continent[0]))
				break
			if (continent.some(isInterestingFaction) && ns.getServerMoneyAvailable("home") > 50200000) {
				for (let city of continent) {
					ns.print("Traveled to city " + city)
					if(ns.travelToCity(city)){
						ns.print("Waiting for invitation of " + city)
						await ns.sleep(10000)
					}
				}
				break;
			}
		}
	}

	async function crimeFaction(){
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
					&& getLowestCombatStat() >= faction.lowStat
					&& ns.getPlayer().numPeopleKilled >= faction.kills) {
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
	}

	async function companyFaction() {
		const allCompanies = ["ECorp", "MegaCorp", "KuaiGong International",
			"Four Sigma", "NWO", "Blade Industries", "OmniTek Incorporated",
			"Bachman & Associates", "Clarke Incorporated", "Fulcrum Technologies"]
		const favCompanies = ["Bachman & Associates", "ECorp","Fulcrum Technologies"]
		const companies = favCompanies.some(isInterestingFaction) ? favCompanies : allCompanies

		for (let company of companies) {
			let faction = company
			if (company == "Fulcrum Technologies")
				faction = "Fulcrum Secret Technologies"
			if (isInterestingFaction(faction)) {
				ns.applyToCompany(company, "IT")
				if (ns.workForCompany(company, focus())) {
					ns.print("Working for company " + company + " for " + workTime/1000 + " seconds")
					await ns.sleep(workTime)
				}
			}
		}
	}

	async function factionWork() {

		for (let faction of ns.getPlayer().factions) {
			// TODO: Filter buyable augs
			const maxRep = Math.max(...ns.getAugmentationsFromFaction(faction)
				.filter(aug => !ns.getOwnedAugmentations().includes(aug))
				.map(aug => ns.getAugmentationRepReq(aug)))
			if (ns.getFactionFavor(faction) + ns.getFactionFavorGain(faction) < 150
					&& ns.getFactionRep(faction) < maxRep){
				ns.print("Working for faction " + faction + " for " + factionTime/1000 + " seconds")
				if (ns.workForFaction(faction, "Hacking Contracts", focus()))
					await ns.sleep(factionTime)
				else if (ns.workForFaction(faction, "Field Work", focus()))
					await ns.sleep(factionTime)
				else if (ns.workForFaction(faction, "Security Work", focus()))
					await ns.sleep(factionTime)
				else
					break
			}
		}
	}

	while (true) {
		buyPrograms()
        upgradeHome()
		checkInvitations()
		await cityFaction()
		await companyFaction()
		await crimeFaction()
		await factionWork()
		// await crime()
	}
}
