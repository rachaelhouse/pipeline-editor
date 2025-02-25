/*
 * Copyright 2018-2021 Elyra Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import produce from "immer";

import rawMigrate from "./";

// wrap migrate functions in immer
const migrate = produce<any>((d: any) => rawMigrate(d));

it("should only bump version", () => {
  const v2 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 2,
        },
        nodes: [],
      },
    ],
  };
  const expected = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 3,
        },
        nodes: [],
      },
    ],
  };
  const actual = migrate(v2);
  expect(actual).toEqual(expected);
});
