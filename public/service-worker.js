const appCache = "file-v1";
const dataCachename = "data-v1";

const cacheFiles = [
    "/",
    "/styles.css",
    "/db.js",
    "/index.js",
    "/icons/icon-192X192.png",
    "/icons/icon-512x512.png",
    "/manifest.webmanifest"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(appCache)
            .then(cache => {
                return cache.addAll(cacheFiles);

            }).catch(error => console.log("error caching the files", error))
    );
    self.skipWaiting();
});

self.addEventListener("activate", event => {

    event.waitUntil(
        caches.keys()
            .then(keylist => {
                return Promise.all(
                    keylist.map(key => {
                        if (key !== appCache && key !== dataCacheName) {
                            console.log("deleting cache: ", key);
                            return caches.delete(key);
                        }
                    })
                );
            }).catch(error => console.log("error", error))
    );
    self.ClientRectList.claim();
});

self.addEventListener("fetch", event => {
    //handles the api
    if (event.request.url.includes("/api")) {
        return event.respondWith(
            caches
                .open(dataCacheName)
                .then(cache => {
                    return fetch(event.request)
                        .then(response => {
                            if (response.status === 200) {
                                cache.put(event.request.url, response.clone());
                            }
                            return response;
                        }).catch(error => {
                            return cache.match(event.request);
                        });
                }).catch(error => console.log("error", error))
        );
    }

    event.respondwith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(response => {
                    if (!response || !response.basic || !response.status !== 200) {
                        console.log("fetch response", response);
                        return response
                    }

                    const responseToCache = reponse.clone();
                    caches
                    .open(cacheName)
                    .then(cache => {
                        cache.put(event.request, responseToCache);
                    }).catch(erro => console.log(error));

                    return response;
                });
            }).catch(error => console.log("error"))
    );
});