const CACHE_NAME = "my-gym-tracker-v1.0.0";

const APP_SHELL = [
    "./",
    "./index.html",
    "./manifest.json"
];


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(
                    cache =>
                        cache.addAll(
                            APP_SHELL
                        )
                )
                .then(
                    () =>
                        self.skipWaiting()
                )

        );

    }
);


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches
                .keys()
                .then(
                    keys =>

                        Promise.all(

                            keys
                                .filter(
                                    key =>
                                        key !==
                                        CACHE_NAME
                                )

                                .map(
                                    key =>
                                        caches.delete(
                                            key
                                        )
                                )

                        )

                )

                .then(
                    () =>
                        self.clients.claim()
                )

        );

    }
);


/* =========================================================
   FETCH
========================================================= */

self.addEventListener(
    "fetch",
    event => {

        if (
            event.request.method !==
            "GET"
        ) {

            return;

        }


        const request =
            event.request;


        event.respondWith(

            caches
                .match(request)
                .then(
                    cachedResponse => {

                        if (
                            cachedResponse
                        ) {

                            return cachedResponse;

                        }


                        return fetch(request)

                            .then(
                                response => {

                                    if (
                                        !response ||
                                        response.status !==
                                        200 ||
                                        response.type ===
                                        "opaque"
                                    ) {

                                        return response;

                                    }


                                    const copy =
                                        response.clone();


                                    caches
                                        .open(
                                            CACHE_NAME
                                        )
                                        .then(
                                            cache => {

                                                cache.put(
                                                    request,
                                                    copy
                                                );

                                            }
                                        );


                                    return response;

                                }
                            )

                            .catch(
                                () => {

                                    if (
                                        request.mode ===
                                        "navigate"
                                    ) {

                                        return caches.match(
                                            "./index.html"
                                        );

                                    }

                                }
                            );

                    }
                )

        );

    }
);
