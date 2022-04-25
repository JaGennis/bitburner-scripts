/** @param {NS} ns */
export async function main(ns) {

	ns.disableLog("ALL")

	while (true) {
		const bestSyms = ns.stock.getSymbols()
			.filter(sym => ns.stock.getForecast(sym) > 0.6)
			.sort((a,b) => ns.stock.getForecast(b) - ns.stock.getForecast(a))
			
		ns.print("Best stocks : " + bestSyms)

		for (let bestSym of bestSyms) {
			let numShares = ns.stock.getMaxShares(bestSym) - ns.stock.getPosition(bestSym)[0]
			while (ns.stock.getPurchaseCost(bestSym, numShares, "Long") > ns.getServerMoneyAvailable("home")
				&& numShares > 50000){
				numShares -= 1000
			}
	
			ns.stock.buy(bestSym, numShares)
			ns.print("Bought " + numShares + " shares of " + bestSym)
		}

		const investedSyms = ns.stock.getSymbols().filter(sym => ns.stock.getPosition(sym)[0] > 0)
		ns.print("Invested stocks : " + investedSyms)
		for (let sym of investedSyms) {
			ns.print(sym + " : " + ns.stock.getForecast(sym))
			if (ns.stock.getForecast(sym) < 0.55) {
				// Sell all
				ns.print("Sold all shares of " + sym)
				ns.stock.sell(sym, ns.stock.getPosition(sym)[0])
			}
		}
		await ns.sleep(1000 * 6)
	}
}