import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/utils';
import type { MessageIds } from '../../../src/rules/use-track-by-or-aliases';

const messageId: MessageIds = 'useTrackByOrAliases';

/**
 * @description Tests on aliases usage and normal tests based on 👇
 * https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/tests/rules/use-track-by-function/cases.ts
 * 
 */
export const valid = [
  // @todo create a new test with [ngForTrackByProperty] format
  // {
  //   code: `
  //   <div *ngFor="let item of ['a', 'b', 'c'];" [ngForTrackByProperty]="'id'">
  //     {{ item }}
  //   </div>
  //   `,
  //   options: [{ aliases: ["ngForTrackByProperty"] }]
  // },
  {
    code: `
    <div *ngFor="let item of ['a', 'b', 'c']; trackByProperty: 'id'">
      {{ item }}
    </div>
    `,
    options: [{ aliases: ["ngForTrackByProperty"] }]
  },
  {
    code: `
    <div *ngFor="let item of ['a', 'b', 'c']; trackByIndex">
      {{ item }}
    </div>
    `,
    options: [{ aliases: ["toto", "ngForTrackByIndex"] }]
  },
  {
    code: `
    <div *ngFor="let item of ['a', 'b', 'c'];" ngForTrackByIndex>
      {{ item }}
    </div>
    `,
    options: [{ aliases: ["ngForTrackByIndex"] }]
  },
  {
    code:
      `
      <div *ngFor="let item of [1, 2, 3]; trackBy: trackByFn">
        {{ item }}
      </div>
    `, options: [{ aliases: ["toto"] }]
  },
  `
      <div *ngFor="let item of [1, 2, 3]; let i = index; trackBy: trackByFn">
        {{ item }}
      </div>
    `,
  `
      <div *ngFor="let item of [1, 2, 3]; trackBy : trackByFn">
        {{ item }}
      </div>
    `,
  `
      <div *ngFor='let item of [1, 2, 3]; let i = index; trackBy: trackByFn'>
        {{ item }}
      </div>
    `,
  `
      <div *ngFor  =  "let item of [1, 2, 3]; let i = index; trackBy : trackByFn">
        {{ item }}
      </div>
    `,
  `
      <ng-template ngFor let-item [ngForOf]="[1, 2, 3]" let-i="index"
        [ngForTrackBy]="trackByFn">
        {{ item }}
      </ng-template>
    `,
  `
      <div *ngFor="let item of ['a', 'b', 'c']; index as i; trackBy: trackByFn">
        {{ item }}
      </div>
      <ng-template ngFor let-item [ngForOf]="[1, 2, 3]" let-i="index"
        [ngForTrackBy]="trackByFn">
        {{ item }}
      </ng-template>
    `,
  `
      <div *ngFor="
        let item of [1, 2, 3];
        let i = index;
        trackBy : trackByFn
      ">
    `,
];

export const invalid = [
  convertAnnotatedSourceToFailureCase({
    description: 'should fail when alias is not present',
    annotatedSource: `
        <ul>
          <li *ngFor="let item of [1, 2, 3];">
              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            {{ item }}
          </li>
        </ul>
      `,
    messageId,
    options: [
      {
        aliases: ['missingTestAttribute']
      }
    ]
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'should fail when alias is wrong',
    annotatedSource: `
        <ul>
          <li *ngFor="let item of [1, 2, 3];" wrongTestAttribute>
              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            {{ item }}
          </li>
        </ul>
      `,
    messageId,
    options: [
      {
        aliases: ['missingTestAttribute']
      }
    ]
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'should fail when trackBy function is not present',
    annotatedSource: `
        <ul>
          <li *ngFor="let item of [1, 2, 3];">
              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            {{ item }}
          </li>
        </ul>
      `,
    messageId,
    options: [
      {
        aliases: ['missingTestAttribute']
      }
    ]
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'should fail when [ngForTrackBy] is missing in ng-template',
    annotatedSource: `
        <ng-template ngFor let-item [ngForOf]="[1, 2, 3]" let-i="index">
                                    ~~~~~~~~~~~~~~~~~~~~~
          {{ item }}
        </ng-template>
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail when there are two ngFor and for the second, trackBy function is not present',
    annotatedSource: `
        <div *ngFor="let item of [1, 2, 3]; trackBy: trackByFn">
          {{ item }}
        </div>
        <ul>
          <li *ngFor="let item of [1, 2, 3];">
              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            {{ item }}
          </li>
        </ul>
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail when trackBy function is missing in multiple *ngFor',
    annotatedSource: `
        <div *ngFor="let item of [1, 2, 3];">
             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          {{ item }}
        </div>
        <ng-template ngFor let-item [ngForOf]="[1, 2, 3]" let-i="index">
                                    ^^^^^^^^^^^^^^^^^^^^^
          {{ item }}
        </ng-template>
      `,
    messages: [
      {
        char: '~',
        messageId,
      },
      {
        char: '^',
        messageId,
      },
    ],
  }),
];
