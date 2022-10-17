
import type {
  TmplAstTemplate,
  TmplAstTextAttribute,
} from '@angular-eslint/bundled-angular-compiler';
import { TmplAstBoundAttribute } from '@angular-eslint/bundled-angular-compiler';
import {
  createESLintRule,
  getTemplateParserServices,
} from '../utils/create-eslint-rule';
import { getOriginalAttributeName } from '../utils/get-original-attribute-name'

interface IOption {
  aliases?: string[],
}

/**
 * @description more info 👉 https://eslint.org/docs/latest/developer-guide/working-with-rules#contextoptions
 */
type Options = [];
export type MessageIds = 'useTrackByOrAliases';
export const RULE_NAME = 'use-track-by-or-aliases';

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ensures trackBy function or directive aliases are used',
      recommended: false,
    },
    schema: [
      {
        type: "object",
        properties: {
          aliases: {
            type: "array",
            items: {
              type: "string"
            },
            minItems: 1,
            uniqueItems: true
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      useTrackByOrAliases: 'Missing trackBy function in ngFor directive or directive aliases usage',
    },
  },
  defaultOptions: [],
  create(context) {
    const parserServices = getTemplateParserServices(context);

    return {
      'BoundAttribute.inputs[name="ngForOf"]'({
        parent: { inputs },
        sourceSpan,
      }: TmplAstBoundAttribute & { parent: TmplAstTemplate }) {
        if (inputs.some(isNgForTrackBy)) {
          return;
        }

        const loc = parserServices.convertNodeSourceSpanToLoc(sourceSpan);

        context.report({
          messageId: 'useTrackByOrAliases',
          loc,
        });
      },
      'BoundAttribute.templateAttrs'({
        parent: { templateAttrs, attributes },
      }: TmplAstBoundAttribute & { parent: TmplAstTemplate }) {
        if (templateAttrs.some(isNgForTrackBy)) {
          return;
        }

        const aliases: string[] = getAliasesOption(context.options);

        if (aliases.length > 0 && templateAttrs.some(templateAttr => isAnAlias(aliases, getOriginalAttributeName(templateAttr)))) {
          return;
        }

        if (aliases.length > 0 && attributes.some(attr => isAnAlias(aliases, getOriginalAttributeName(attr)))) {
          return;
        }

        const { start } = parserServices.convertNodeSourceSpanToLoc(
          templateAttrs[0].sourceSpan,
        );
        const { end } = parserServices.convertNodeSourceSpanToLoc(
          templateAttrs[templateAttrs.length - 1].sourceSpan,
        );
        const loc = {
          start: {
            ...start,
            column: start.column - 1,
          },
          end: {
            ...end,
            column: end.column + 1,
          },
        } as const;
        context.report({
          messageId: 'useTrackByOrAliases',
          loc,
        });
      },
    };
  },
});

function isNgForTrackBy(
  attribute: TmplAstBoundAttribute | TmplAstTextAttribute,
): attribute is TmplAstBoundAttribute & { name: 'ngForTrackBy' } {
  // console.log(attribute instanceof TmplAstBoundAttribute);

  return (
    attribute.name === 'ngForTrackBy'
  )
}

function isAnAlias( 
  aliases: string[],
  attribute: string,
): boolean {
  return aliases.includes(attribute);
}

function getAliasesOption(options: IOption[]): string[] {
  return options.find(option => 'aliases' in option)?.aliases ?? [];
}
