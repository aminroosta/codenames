import { APIEvent, json } from "solid-start";

export function GET({ locals }: APIEvent) {
  return json({ name: "John Doe" });
}

export function POST() {
  // ...
}

export function PATCH() {
  // ...
}

export function DELETE() {
  // ...
}


