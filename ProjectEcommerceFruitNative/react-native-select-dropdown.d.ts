declare module "react-native-select-dropdown" {
  interface SelectDropdownProps {
    data: any[];
    onSelect: (selectedItem: any, index: number) => void;
    buttonTextAfterSelection?: (selectedItem: any, index: number) => string;
    rowTextForSelection?: (item: any, index: number) => string;
    buttonStyle?: object;
    defaultButtonText?: string;
    disabled?: boolean;
  }
  const SelectDropdown: React.FC<SelectDropdownProps>;
  export default SelectDropdown;
}
