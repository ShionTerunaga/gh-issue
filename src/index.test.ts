import { describe, expect, it, vi } from "vitest";

vi.mock("./run", () => ({
    run: vi.fn(),
}));

import { main } from "./index";

describe("main", () => {
    it("is exported", () => {
        expect(main).toBeTypeOf("function");
    });
});
