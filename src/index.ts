"use strict";

//------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------
import useTrackByFunction, {
  RULE_NAME as useTrackByFunctionRuleName,
} from "./rules/use-track-by-or-aliases";

export default {
  rules: {
    [useTrackByFunctionRuleName]: useTrackByFunction,
  },
};
