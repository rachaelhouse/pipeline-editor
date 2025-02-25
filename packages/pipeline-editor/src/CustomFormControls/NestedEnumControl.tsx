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

import { useCallback, useEffect } from "react";

import { useSelect } from "downshift";
import { useTheme } from "styled-components";

import {
  EnumButton,
  EnumContainer,
  EnumIcon,
  EnumLabel,
  EnumMenu,
  EnumMenuItem,
} from "./components";
import { createControl, useControlState } from "./control";
import { getErrorMessages, getNestedEnumValidators } from "./validators";

export interface Data {
  value: string;
  label: string;
  options?: {
    value: string;
    label: string;
  }[];
}

export interface FlatData {
  value: string;
  option: string;
}

interface Props {
  data: Data[];
  placeholder: string;
  required?: boolean;
}

function flatten(data: Data[]): any[] {
  let flattenedData: FlatData[] = [];
  data.forEach((item: Data) => {
    item.options?.forEach((option: Data) => {
      flattenedData.push({
        value: item.value,
        option: option.value,
      });
    });
  });
  return flattenedData;
}

function getLabel(value: FlatData, data: Data[], placeholder: string): string {
  const entry = data.find((item) => item.value === value?.value);
  const option = entry?.options?.find((opt) => opt.value === value.option);
  return entry && option ? entry.label + ": " + option.label : placeholder;
}

function NestedEnumControl({
  data = [],
  placeholder = "Select a value",
  required,
}: Props) {
  const [value, setValue] = useControlState<FlatData>();

  const theme = useTheme();

  const flattenedData = flatten(data);

  const handleSelectedItemChange = useCallback(
    ({ selectedItem }) => {
      if (selectedItem.value) {
        setValue(selectedItem);
      } else {
        setValue(undefined);
      }
    },
    [setValue]
  );

  useEffect(() => {
    if (
      value !== undefined &&
      !flatten(data).find((item) => item.value === value.value)
    ) {
      setValue(undefined);
    }
  }, [data, value, setValue]);

  const {
    selectedItem,
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  } = useSelect({
    items: flattenedData,
    selectedItem: value,
    onSelectedItemChange: handleSelectedItemChange,
  });

  const validators = getNestedEnumValidators({ data, required });

  let errorMessages = required ? getErrorMessages(value, validators) : [];

  return (
    <div className={errorMessages.length > 0 ? "error" : undefined}>
      <EnumContainer isOpen={isOpen}>
        <EnumButton {...getToggleButtonProps()}>
          <EnumLabel>{getLabel(selectedItem, data, placeholder)}</EnumLabel>
          <EnumIcon className="elyricon elyricon-chevron-down">
            {theme.overrides?.chevronDownIcon}
          </EnumIcon>
        </EnumButton>
        <EnumMenu {...getMenuProps()}>
          {isOpen &&
            flattenedData.map((item: FlatData, index: number) => {
              const label = getLabel(item, data, placeholder);
              return (
                <EnumMenuItem
                  key={`${item.value}${item.option}${index}`}
                  {...getItemProps({ item, index })}
                >
                  <EnumLabel title={label}>{label}</EnumLabel>
                </EnumMenuItem>
              );
            })}
        </EnumMenu>
      </EnumContainer>
    </div>
  );
}

export default createControl("NestedEnumControl", NestedEnumControl);
