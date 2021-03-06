import passport, { Profile } from 'passport';
import { Application, Request, Response, NextFunction } from 'express';

import userModel from '../users/user.model';
import Iuser from '../users/user.interface';
import LocalStrategy from './passport.local';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('local', (err: Error, user: Iuser) => {
    if (err) {
      res.sendStatus(401);
    } else if (!user) {
      res.sendStatus(401);
    } else {
      req.logIn(user, (error: Error) => {
        if (error) {
          res.sendStatus(401);
        } else {
          res.status(200).send(user);
        }
      });
    }
  })(req, res, next);
};

export const init = (app: Application) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: Profile, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    userModel.findById(id, (err, user) => {
      done(err, user as Iuser);
    });
  });

  passport.use(LocalStrategy);

  app.post('/api/login', authenticate);
  app.get('/api/login/success', (req: Request, res: Response) => {
    return res.status(200).send({ user: req.user });
  });
  app.get('/api/login/fail', (_, res: Response) => {
    return res.sendStatus(401);
  });
};
