# Using HTTPS in developement

NGINX is configured to use https. To do this, you need to :
 1. Add `safeofficeanywhere.dev` &rarr; `127.0.0.1` to your `hosts` file. For example, on linux, you should have something like this:
 ```
 # SafeOfficeAnywhere
 127.0.0.1 safeofficeanywhere.dev www.safeofficeanywhere.dev
 ```
 2. Then, add root CA's certificate to the system-wide trust store. On ubuntu, you can do this with:

```bash
sudo cp ./reverse-proxy/ssl/rootCA.crt /usr/local/share/ca-certificates/rootCA.crt
sudo update-ca-certificates
```

 3. Enjoy!
