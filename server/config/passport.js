const LocalStrategy = require("passport-local").Strategy;
const bcrypyt = require("bcryptjs");

const{User}= require("../models/test");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ 
          where: {
              email: email}
         })
        .then((user, error) => {
            //console.log(`From passport: ${JSON.stringify(user)}, ${email} ${password}`);
            if(error) {
                console.log(error);
                throw error
            }

            if (!user) {
                console.log("That user is not registered");
                return done(null, false, {
                message: "That user is not registered"
                });
            }

            //Compare password
            bcrypyt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;

                if (isMatch) {
                return done(null, user);
                } else {
                console.log("Password incorrect");
                return done(null, false, { message: "Password incorrect" });
                }
            });
        })
    })
  );

  //Sessions
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({where: {id: id}}).then((user, error) => {
      done(error, user);
    });
  });
};