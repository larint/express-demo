import * as bcrypt from "bcrypt";

const saltRounds = 10

class Security {
	static createHash = async (data: string): Promise<string> => {
		return await bcrypt.hash(data, saltRounds)
	}
	static comparePassword = async (data: string, hash: string) => {
		return await bcrypt.compare(data, hash);
	}
}
export { Security }