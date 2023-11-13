/// <reference types="astro/client" />
/// <reference types="lucia" />

interface ImportMetaEnv {
  readonly TURSO_AUTH_TOKEN: string;
  readonly TURSO_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace Lucia {
	type Auth = import("./lib/server/lucia").Auth;
	type DatabaseUserAttributes = {
    avatar: string;
    email: string;
    forename: string;
    surname: string;
  };
	type DatabaseSessionAttributes = {};
}

declare namespace App {
	interface Locals {
		auth: import("lucia").AuthRequest;
	}
}