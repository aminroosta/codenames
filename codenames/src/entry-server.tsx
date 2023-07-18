import { randomUUID as uuid } from "crypto";
import { FetchEvent, parseCookie } from "solid-start";
import {
  createHandler,
  MiddlewareInput,
  renderAsync,
  StartServer,
} from "solid-start/entry-server";

const sessionMiddleware = ({ forward }: MiddlewareInput) => {
  return async (event: FetchEvent) => {
    const request = event.request;
    const { sid } = parseCookie(request.headers.get("cookie") ?? "");
    const sid_ = event.locals.sid = sid || uuid();

    const response = await forward(event);
    if (!sid) {
      const cookie = `sid=${sid_}; path=/; secure; HttpOnly; SameSite=Strict`
      response.headers.set("Set-Cookie", cookie);
    }
    return response;
  };
};

export default createHandler(
  sessionMiddleware,
  renderAsync((event) => <StartServer event={event} />)
);
