import {
  describe,
  expect,
  it
} from "vitest";

import {
  analyzeConversation
} from "../src/application/analyzeConversation";

import {
  MockAnalyzer
} from "../src/infrastructure/ai/mockAnalyzer";

describe(
  "Sales Copilot conversation analysis",

  () => {

    it(
      "detects a conversion problem and suggests a CTQ",

      async () => {

        const context = {

          sessionId:
            "academy-001",

          company: {
            name:
              "Academia Exemplo",

            sector:
              "Fitness"
          },

          spin: {
            stage:
              "SITUATION" as const,

            confidence:
              0.5
          },

          conversation: {},

          evidence: [],

          problems: [],

          ctqs: [],

          impacts: [],

          informationGaps: []
        };

        const result =
          await analyzeConversation(

            context,

            "Nós recebemos muitos leads, mas poucos fecham matrícula.",

            new MockAnalyzer()
          );

        expect(
          result.spin.stage
        ).toBe(
          "PROBLEM"
        );

        expect(
          result.problems.length
        ).toBeGreaterThan(0);

        expect(
          result.ctqs.some(
            ctq =>
              ctq.metric ===
              "lead_conversion_rate"
          )
        ).toBe(true);

        expect(
          result.nextAction?.type
        ).toBe(
          "QUESTION"
        );
      }
    );
  }
);