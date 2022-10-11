import { RuleTester } from '@angular-eslint/utils';
import rule, { RULE_NAME } from '../../../src/rules/use-track-by-or-aliases';
import { invalid, valid } from './cases';

const ruleTester = new RuleTester({
  parser: '@angular-eslint/template-parser',
});

// @ts-ignore // @todo find a proper way here 😢
ruleTester.run(RULE_NAME, rule, {
  valid,
  invalid,
});
