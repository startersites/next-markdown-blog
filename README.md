# Next.js Markdown Blog Starter

A lightly opinionated, full-featured Next.js blog managed through Git Workflows with markdown files.

## Features

- Posts, Categories, Tags, and Authors
- Full API
- Content management UI with workflows
- No database, hosted in git repo
- Config file for managing blog settings
- Metadata integration

## Main Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [NetlifyCMS](https://www.netlifycms.org/) - Git workflow content management
- [TailwindCSS](https://tailwindcss.com/) (optional) - Utility CSS framework

## Deploying to Netlify

1. Deploy repo to Netlify
2. Enable Netlify Identity on the site
3. Under the Identity settings, enable Git Gateway
4. Open your deployed site and navigate to `yoursite.app/admin`
5. You should now be able to sign up and login to the admin

### Private admin

By default the admin side will allow anyone to signup and login. To change this:

1. Under Identity settings, change the registration preferences to invite-only
2. Then in the Identity tab, invite yourself and any other desired admin users
3. After you accept the invite and are redirected back to your site, add `/admin` to the end of your url but before the `#access-token`
4. You should now be able to create an account and login
