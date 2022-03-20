/** @param {NS} ns **/
import { getAllServers } from "helper-functions.js";
export async function main(ns) {
	ns.tprint(getAllServers(ns).filter(item => ns.ls(item, "contract").length > 0))
}
