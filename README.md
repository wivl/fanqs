# fanqs

###not finished yet, don't use###

self-host music library

### dependencies
 
* nodejs, with koa and koa components and other modules
* mongodb

### prepare

make sure your mongodb service is started, using default 27017 port and currently we dont have the option to change. fix later.

then change the <code>config.json</code> file.

the <code>folders</code> list your music lib directory
the <code>url</code> is your server hostname, currently you should keep it listen on port 8964, change may cause bugs. fix later.

### run

make sure you have installed nodejs, then in the directory:

```
npm i
node index.js
```

then go http://localhost:8964/ and click the refrash button at first launch.
