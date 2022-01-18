import { cacheExchange } from "@urql/exchange-graphcache";
import { withUrqlClient } from "next-urql";
import { dedupExchange, fetchExchange } from "urql";
import { cacheUpdates } from "./cacheUpdate";

export const createURQLClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: cacheUpdates,
    }),
    ssrExchange,
    fetchExchange,
  ],
});
