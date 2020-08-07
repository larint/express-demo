import { DB } from '../helpers/db'
import { Credentials, User } from '../helpers/type'
import { Security } from '../helpers/security'

class Auth {

	static authenticate = async (credential: Credentials) => {
		let user: User[] = await DB.selectByParams({
			select: '*',
			table: 'users',
			where: ['email', credential.username],
			set: '?? = ?'
		});

		if (user.length == 0) {
			return false
		}

		const match = await Security.comparePassword(credential.password, user[0].password);

		if (match) {
			return true
		}

		return false
	}
}

export { Auth }
