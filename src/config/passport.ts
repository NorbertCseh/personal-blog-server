import User from '../models/User';
import * as passportJwt from 'passport-jwt';
import keys from './keys';

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

interface options {
	jwtFromRequest;
	secretOrKey;
}

const settings: options = { jwtFromRequest: null, secretOrKey: null };
settings.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
settings.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
	passport.use(
		new JwtStrategy(settings, (jwt_payload, done) => {
			User.findById(jwt_payload.id)
				.then((user) => {
					if (user) {
						return done(null, user);
					}
					return done(null, false);
				})
				.catch((err) => console.log(err));
		})
	);
};
