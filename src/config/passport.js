import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import userModel from './models/userModel.js';

const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([req => req.cookies.jwt]),
    secretOrKey: 'contra',
};

passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
        const user = await userModel.findById(jwtPayload.id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

export default passport;
