import { describe, expect, test } from "bun:test";
import { DEVELOPMENT_SECRETS, refuseDevelopmentSecrets } from "../src/config";

describe("published development secrets", () => {
  test("are fine where nobody signs in", () => {
    expect(() =>
      refuseDevelopmentSecrets({ ...DEVELOPMENT_SECRETS }, false),
    ).not.toThrow();
  });

  test.each(Object.entries(DEVELOPMENT_SECRETS))(
    "%s at its default refuses a deployment people sign in to",
    (name, value) => {
      expect(() => refuseDevelopmentSecrets({ [name]: value }, true)).toThrow(
        name,
      );
    },
  );

  test("fresh secrets start", () => {
    expect(() =>
      refuseDevelopmentSecrets(
        {
          COMPUTER_TOKEN: "a-real-secret",
          SUPERVISOR_TOKEN: "another",
          WORKER_SHARED_SECRET: "and-another",
        },
        true,
      ),
    ).not.toThrow();
  });

  test("the explicit override lets it start", () => {
    expect(() =>
      refuseDevelopmentSecrets(
        {
          ...DEVELOPMENT_SECRETS,
          OPENBOT_ALLOW_DEVELOPMENT_SECRETS: "true",
        },
        true,
      ),
    ).not.toThrow();
  });
});
