// Native Imports
const url = require("url");
const {sep} = require("path");

// Used for Permission Resolving only...
const {Permissions} = require("discord.js");

// Express Session
const express = require("express");

const app = express();

// Express Plugins
const passport = require("passport");
const session = require("express-session");
const {Strategy} = require("passport-discord");
const helmet = require("helmet");

// Used to parse Markdown from things like ExtendedHelp
const md = require("marked");

exports.init = (client) => {
  this.client = client;
  const dataDir = `${client.clientBaseDir}bwd${sep}dashboard${sep}`;
  const templateDir = `${dataDir}templates${sep}`;

  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  passport.use(new Strategy({
      clientID: client.user.id,
      clientSecret: client.config.dash.oauthSecret,
      callbackURL: client.config.dash.callback,
      scope: ["identify", "guilds"],
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => done(null, profile));
    }));

  app.use(session({
    secret: "k0madai$lif3",
    resave: false,
    saveUninitialized: false,
  }));

  app.engine("html", require("ejs").renderFile);
  app.set("view engine", "html");

  const bodyParser = require("body-parser");
  app.use(bodyParser.json()); // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true,
  }));

  app.locals.domain = client.config.dash.domain;

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(helmet());

  app.use("/semantic", express.static(`${dataDir}semantic`));
  app.use("/res", express.static(`${dataDir}res`));

  function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    return res.redirect("/login");
  }

  function checkAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.id === client.config.ownerID) return next();
    req.session.backURL = req.originalURL;
    return res.redirect("/");
  }

  app.get("/", (req, res) => {
    res.render(`${templateDir}index.ejs`, {
      bot: client,
      user: req.user,
      auth: req.isAuthenticated(),
    });
  });

  app.get("/login",
    (req, res, next) => {
      if (req.session.backURL) {
        req.session.backURL = req.session.backURL;
      } else if (req.headers.referer) {
        const parsed = url.parse(req.headers.referer);
        if (parsed.hostname === app.locals.domain) {
          req.session.backURL = parsed.path;
        }
      } else {
        req.session.backURL = "/";
      }
      next();
    },
    passport.authenticate("discord"));

  app.get("/callback", passport.authenticate("discord", {
    failureRedirect: "/autherror",
  }), (req, res) => {
    if (req.session.backURL) {
      res.redirect(req.session.backURL);
      req.session.backURL = null;
    } else {
      res.redirect("/");
    }
  });

  app.get("/admin", checkAdmin, (req, res) => {
    res.render(`${templateDir}admin.ejs`, {
      bot: client,
      user: req.user,
      auth: req.isAuthenticated(),
    });
  });

  app.get("/dashboard", checkAuth, (req, res) => {
    res.render(`${templateDir}dashboard.ejs`, {
      perms: Permissions,
      bot: client,
      user: req.user,
      auth: req.isAuthenticated(),
    });
  });

  app.get('/manage/:guildID', checkAuth, async(req, res) => {
    console.log(req.params);
    const guild = client.guilds.get(req.params.guildID);
    if(!guild) return res.status(404);
    const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
    if (req.user.id === client.config.ownerID) {
      console.log(`Admin bypass for managing server: ${req.params.guildID} from IP ${req.ip}`);
    } else if (!isManaged) {
      res.redirect("/");
    }
    await guild.fetchMembers();
    res.render(`${templateDir}manage.ejs`, {
      bot: client,
      guild,
      user: req.user,
      auth: req.isAuthenticated(),
    });
  });
  
  app.post('/execute/:guildID/:cmd', checkAuth, async(req, res) => {
    try{
      console.log(req.originalUrl);
      console.log(req.params);
      const guild = client.guilds.get(req.params.guildID);
      console.log(`Attempt to execute command ${req.params.cmd} on server: ${guild.id} from IP ${req.ip}`);
      if(!guild) return res.status(404);
      if(typeof this[req.params.cmd] !== "function") return res.status(404);
      const isManaged = !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
      if (req.user.id === client.config.ownerID) {
        console.log(`Admin bypass for executing command ${req.params.cmd} on server: ${guild.id} from IP ${req.ip}`);
      } else if (!isManaged) {
        return res.status(403).send({"success": false, "message": "You do not have permission to execute this command."});
      }
      const response = await this[req.params.cmd](guild, req.body).catch(e=>res.status(500).send(e));
      if(response) return res.json({"success": true});
    } catch(e) {
      console.log(e);
      res.json({"success": false, "message": e});
    }
  });

  app.get("/docs", (req, res) => {
    res.render(`${templateDir}docs.ejs`, {
      bot: client,
      user: req.user,
      auth: req.isAuthenticated(),
      md
    });
  });

  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  client.site = app.listen(client.config.dash.port);
};


/* Custom Commands */

exports.leaveGuild = async (guild, options) => {
  return new Promise(async (resolve, reject) => {
    try{
      if(options.message) await guild.channels.get(guild.id).sendMessage(options.message);
      await guild.leave();
      resolve(true);
    } catch(e) {
      console.log(e);
      reject(e);
    }
  });
};
